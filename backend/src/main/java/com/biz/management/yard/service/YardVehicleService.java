package com.biz.management.yard.service;

import com.biz.management.yard.dto.YardCctvDto;
import com.biz.management.yard.dto.YardRouteDeviationDto;
import com.biz.management.yard.dto.YardRouteDto;
import com.biz.management.yard.dto.YardVehicleDto;
import com.biz.management.yard.mapper.YardMapper;
import com.biz.management.yard.mapper.YardVehicleMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.util.List;

@Service
public class YardVehicleService {

    private static final Logger log = LoggerFactory.getLogger(YardVehicleService.class);
    private static final BigDecimal DEVIATION_THRESHOLD = new BigDecimal("50");

    private final YardVehicleMapper mapper;
    private final YardMapper yardMapper;

    public YardVehicleService(YardVehicleMapper mapper, YardMapper yardMapper) {
        this.mapper = mapper;
        this.yardMapper = yardMapper;
    }

    public List<YardVehicleDto> getVehicles(String yardCd) {
        return mapper.selectVehicles(yardCd);
    }

    public void addVehicle(YardVehicleDto vehicle) {
        if (vehicle.getStatus() == null) vehicle.setStatus("IDLE");
        mapper.insertVehicle(vehicle);
    }

    /**
     * 차량 위치 업데이트 + 경로 이탈 감지 + CCTV 연동
     */
    public void updatePosition(Long id, BigDecimal x, BigDecimal z, BigDecimal heading, BigDecimal speed) {
        mapper.updateVehiclePosition(id, x, z, heading, speed);

        YardVehicleDto vehicle = mapper.selectVehicleById(id);
        if (vehicle == null || vehicle.getAssignedRouteId() == null) return;

        List<YardRouteDto.Waypoint> waypoints = mapper.selectWaypoints(vehicle.getAssignedRouteId());
        if (waypoints.size() < 2) return;

        BigDecimal minDist = minDistanceToRoute(x, z, waypoints);
        boolean wasOffRoute = Boolean.TRUE.equals(vehicle.getIsOffRoute());
        boolean isNowOffRoute = minDist.compareTo(DEVIATION_THRESHOLD) > 0;

        if (isNowOffRoute && !wasOffRoute) {
            // 새로 이탈 감지
            mapper.updateVehicleOffRoute(id, true);
            mapper.updateVehicleStatus(id, "OFF_ROUTE");

            Long cctvId = findCoveringCctv(vehicle.getYardCd(), x, z);

            YardRouteDeviationDto deviation = new YardRouteDeviationDto();
            deviation.setYardCd(vehicle.getYardCd());
            deviation.setVehicleId(id);
            deviation.setRouteId(vehicle.getAssignedRouteId());
            deviation.setDeviationDist(minDist);
            deviation.setDetectedByCctvId(cctvId);
            deviation.setPositionX(x);
            deviation.setPositionZ(z);
            mapper.insertDeviation(deviation);

            // CCTV 알람 자동 활성화
            if (cctvId != null) {
                yardMapper.updateCctvAlarm(cctvId, true);
                yardMapper.insertAlarmLog(vehicle.getYardCd(), "CCTV-" + cctvId,
                        "ROUTE_DEVIATION",
                        vehicle.getVehicleNm() + " 경로 이탈 감지 (거리: " + minDist.intValue() + ")");
                log.info("경로 이탈 감지: vehicle={}, dist={}, cctv={}", vehicle.getVehicleNm(), minDist, cctvId);
            }
        } else if (!isNowOffRoute && wasOffRoute) {
            // 경로 복귀
            mapper.updateVehicleOffRoute(id, false);
            mapper.updateVehicleStatus(id, "MOVING");
        }
    }

    public void updateStatus(Long id, String status) {
        mapper.updateVehicleStatus(id, status);
    }

    public List<YardRouteDto> getRoutes(String yardCd) {
        List<YardRouteDto> routes = mapper.selectRoutes(yardCd);
        for (YardRouteDto route : routes) {
            route.setWaypoints(mapper.selectWaypoints(route.getId()));
        }
        return routes;
    }

    public YardRouteDto createRoute(YardRouteDto route) {
        if (route.getStatus() == null) route.setStatus("PLANNED");
        mapper.insertRoute(route);
        if (route.getWaypoints() != null) {
            for (YardRouteDto.Waypoint wp : route.getWaypoints()) {
                wp.setRouteId(route.getId());
                mapper.insertWaypoint(wp);
            }
        }
        return route;
    }

    public void assignRouteToVehicle(Long routeId, Long vehicleId) {
        mapper.assignRoute(vehicleId, routeId);
    }

    public void deleteRoute(Long id) {
        mapper.deleteRoute(id);
    }

    public List<YardRouteDeviationDto> getDeviations(String yardCd) {
        return mapper.selectDeviations(yardCd);
    }

    public void acknowledgeDeviation(Long id) {
        mapper.acknowledgeDeviation(id);
    }

    /**
     * 차량 좌표에서 경로(웨이포인트 선분들)까지의 최소 거리 계산
     */
    private BigDecimal minDistanceToRoute(BigDecimal px, BigDecimal pz,
                                          List<YardRouteDto.Waypoint> waypoints) {
        BigDecimal minDist = null;
        for (int i = 0; i < waypoints.size() - 1; i++) {
            BigDecimal dist = distPointToSegment(
                    px, pz,
                    waypoints.get(i).getPositionX(), waypoints.get(i).getPositionZ(),
                    waypoints.get(i + 1).getPositionX(), waypoints.get(i + 1).getPositionZ());
            if (minDist == null || dist.compareTo(minDist) < 0) {
                minDist = dist;
            }
        }
        return minDist != null ? minDist : BigDecimal.ZERO;
    }

    /** 점(px,pz)에서 선분(ax,az)-(bx,bz)까지의 최단 거리 */
    private BigDecimal distPointToSegment(BigDecimal px, BigDecimal pz,
                                          BigDecimal ax, BigDecimal az,
                                          BigDecimal bx, BigDecimal bz) {
        double pxd = px.doubleValue(), pzd = pz.doubleValue();
        double axd = ax.doubleValue(), azd = az.doubleValue();
        double bxd = bx.doubleValue(), bzd = bz.doubleValue();

        double dx = bxd - axd, dz = bzd - azd;
        double lenSq = dx * dx + dz * dz;

        if (lenSq == 0) {
            // 선분 길이 0 (두 점 동일)
            double d = Math.sqrt((pxd - axd) * (pxd - axd) + (pzd - azd) * (pzd - azd));
            return BigDecimal.valueOf(d).round(new MathContext(4));
        }

        double t = ((pxd - axd) * dx + (pzd - azd) * dz) / lenSq;
        t = Math.max(0, Math.min(1, t));

        double closestX = axd + t * dx;
        double closestZ = azd + t * dz;
        double dist = Math.sqrt((pxd - closestX) * (pxd - closestX) + (pzd - closestZ) * (pzd - closestZ));
        return BigDecimal.valueOf(dist).round(new MathContext(4));
    }

    /**
     * 이탈 지점을 커버하는 CCTV 찾기 (커버리지 반경 내 가장 가까운 것)
     */
    private Long findCoveringCctv(String yardCd, BigDecimal px, BigDecimal pz) {
        List<YardCctvDto> cctvs = yardMapper.selectYardCctvs(yardCd);
        Long closestId = null;
        double closestDist = Double.MAX_VALUE;

        for (YardCctvDto cctv : cctvs) {
            double cx = cctv.getPositionX().doubleValue();
            double cz = cctv.getPositionZ().doubleValue();
            double radius = cctv.getCoverageRadius() != null ? cctv.getCoverageRadius().doubleValue() : 200;

            double dist = Math.sqrt(
                    Math.pow(px.doubleValue() - cx, 2) + Math.pow(pz.doubleValue() - cz, 2));

            if (dist <= radius && dist < closestDist) {
                closestDist = dist;
                closestId = cctv.getId();
            }
        }
        return closestId;
    }
}
