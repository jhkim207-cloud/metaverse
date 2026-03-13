package com.biz.management.yard.mapper;

import com.biz.management.yard.dto.YardRouteDeviationDto;
import com.biz.management.yard.dto.YardRouteDto;
import com.biz.management.yard.dto.YardVehicleDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.math.BigDecimal;
import java.util.List;

@Mapper
public interface YardVehicleMapper {

    List<YardVehicleDto> selectVehicles(@Param("yardCd") String yardCd);

    void insertVehicle(YardVehicleDto vehicle);

    void updateVehiclePosition(@Param("id") Long id,
                               @Param("currentX") BigDecimal currentX,
                               @Param("currentZ") BigDecimal currentZ,
                               @Param("heading") BigDecimal heading,
                               @Param("speed") BigDecimal speed);

    void updateVehicleStatus(@Param("id") Long id, @Param("status") String status);

    void updateVehicleOffRoute(@Param("id") Long id, @Param("isOffRoute") Boolean isOffRoute);

    void assignRoute(@Param("vehicleId") Long vehicleId, @Param("routeId") Long routeId);

    List<YardRouteDto> selectRoutes(@Param("yardCd") String yardCd);

    YardRouteDto selectRouteById(@Param("id") Long id);

    List<YardRouteDto.Waypoint> selectWaypoints(@Param("routeId") Long routeId);

    void insertRoute(YardRouteDto route);

    void insertWaypoint(YardRouteDto.Waypoint waypoint);

    void deleteRoute(@Param("id") Long id);

    List<YardRouteDeviationDto> selectDeviations(@Param("yardCd") String yardCd);

    void insertDeviation(YardRouteDeviationDto deviation);

    void acknowledgeDeviation(@Param("id") Long id);

    /** 차량 단건 조회 */
    YardVehicleDto selectVehicleById(@Param("id") Long id);
}
