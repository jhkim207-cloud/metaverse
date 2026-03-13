package com.biz.management.yard.controller;

import com.biz.management.common.dto.ApiResponse;
import com.biz.management.yard.dto.YardRouteDeviationDto;
import com.biz.management.yard.dto.YardRouteDto;
import com.biz.management.yard.dto.YardVehicleDto;
import com.biz.management.yard.service.YardVehicleService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * 야적장 차량/경로 REST API
 */
@RestController
@RequestMapping("/api/v1/yard/{yardCd}")
public class YardVehicleController {

    private final YardVehicleService vehicleService;

    public YardVehicleController(YardVehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    /** 차량 목록 */
    @GetMapping("/vehicles")
    public ApiResponse<List<YardVehicleDto>> getVehicles(@PathVariable String yardCd) {
        return ApiResponse.success(vehicleService.getVehicles(yardCd));
    }

    /** 차량 등록 */
    @PostMapping("/vehicles")
    public ApiResponse<Void> addVehicle(@PathVariable String yardCd, @RequestBody YardVehicleDto vehicle) {
        vehicle.setYardCd(yardCd);
        vehicleService.addVehicle(vehicle);
        return ApiResponse.success(null);
    }

    /** 차량 위치 업데이트 */
    @PutMapping("/vehicles/{id}/position")
    public ApiResponse<Void> updatePosition(@PathVariable Long id, @RequestBody Map<String, BigDecimal> body) {
        vehicleService.updatePosition(id,
                body.getOrDefault("currentX", BigDecimal.ZERO),
                body.getOrDefault("currentZ", BigDecimal.ZERO),
                body.getOrDefault("heading", BigDecimal.ZERO),
                body.getOrDefault("speed", BigDecimal.ZERO));
        return ApiResponse.success(null);
    }

    /** 차량 상태 변경 */
    @PutMapping("/vehicles/{id}/status")
    public ApiResponse<Void> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        vehicleService.updateStatus(id, body.get("status"));
        return ApiResponse.success(null);
    }

    /** 경로 목록 */
    @GetMapping("/routes")
    public ApiResponse<List<YardRouteDto>> getRoutes(@PathVariable String yardCd) {
        return ApiResponse.success(vehicleService.getRoutes(yardCd));
    }

    /** 경로 생성 */
    @PostMapping("/routes")
    public ApiResponse<YardRouteDto> createRoute(@PathVariable String yardCd, @RequestBody YardRouteDto route) {
        route.setYardCd(yardCd);
        return ApiResponse.success(vehicleService.createRoute(route));
    }

    /** 경로 차량 할당 */
    @PutMapping("/routes/{routeId}/assign")
    public ApiResponse<Void> assignRoute(@PathVariable Long routeId, @RequestBody Map<String, Long> body) {
        vehicleService.assignRouteToVehicle(routeId, body.get("vehicleId"));
        return ApiResponse.success(null);
    }

    /** 경로 삭제 */
    @DeleteMapping("/routes/{routeId}")
    public ApiResponse<Void> deleteRoute(@PathVariable Long routeId) {
        vehicleService.deleteRoute(routeId);
        return ApiResponse.success(null);
    }

    /** 이탈 이력 */
    @GetMapping("/deviations")
    public ApiResponse<List<YardRouteDeviationDto>> getDeviations(@PathVariable String yardCd) {
        return ApiResponse.success(vehicleService.getDeviations(yardCd));
    }

    /** 이탈 확인 */
    @PutMapping("/deviations/{id}/ack")
    public ApiResponse<Void> ackDeviation(@PathVariable Long id) {
        vehicleService.acknowledgeDeviation(id);
        return ApiResponse.success(null);
    }
}
