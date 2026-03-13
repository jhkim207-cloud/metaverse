package com.biz.management.yard.service;

import com.biz.management.yard.dto.*;
import com.biz.management.yard.mapper.YardMapper;
import com.biz.management.yard.mapper.YardVehicleMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class YardService {

    private final YardMapper yardMapper;
    private final YardVehicleMapper vehicleMapper;

    public YardService(YardMapper yardMapper, YardVehicleMapper vehicleMapper) {
        this.yardMapper = yardMapper;
        this.vehicleMapper = vehicleMapper;
    }

    /** 야적장 전체 뷰 조회 (차량/경로 포함) */
    public YardViewDto getYardView(String yardCd) {
        YardViewDto view = new YardViewDto();
        view.setMaster(yardMapper.selectYardMaster(yardCd));
        view.setItems(yardMapper.selectYardItems(yardCd));
        view.setCctvs(yardMapper.selectYardCctvs(yardCd));
        view.setVehicles(vehicleMapper.selectVehicles(yardCd));
        List<YardRouteDto> routes = vehicleMapper.selectRoutes(yardCd);
        for (YardRouteDto r : routes) {
            r.setWaypoints(vehicleMapper.selectWaypoints(r.getId()));
        }
        view.setRoutes(routes);
        return view;
    }

    /** 물건 추가 */
    public void addItem(YardItemDto item) {
        yardMapper.insertYardItem(item);
    }

    /** 물건 업데이트 */
    public void updateItem(YardItemDto item) {
        yardMapper.updateYardItem(item);
    }

    /** 물건 삭제 */
    public void removeItem(Long id) {
        yardMapper.deleteYardItem(id);
    }

    /** CCTV 알람 토글 */
    public void toggleCctvAlarm(Long id, String yardCd, String cctvNm) {
        List<YardCctvDto> cctvs = yardMapper.selectYardCctvs(yardCd);
        YardCctvDto target = cctvs.stream()
                .filter(c -> c.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("CCTV not found: " + id));

        boolean newStatus = !Boolean.TRUE.equals(target.getAlarmStatus());
        yardMapper.updateCctvAlarm(id, newStatus);

        String alarmType = newStatus ? "ALARM_ON" : "ALARM_OFF";
        yardMapper.insertAlarmLog(yardCd, cctvNm, alarmType, cctvNm + " 알람 " + (newStatus ? "활성화" : "해제"));
    }
}
