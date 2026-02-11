package com.biz.management.production.controller;

import com.biz.management.common.dto.ApiResponse;
import com.biz.management.production.dto.DashboardKpiDto;
import com.biz.management.production.service.ProductionDashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 생산 대시보드 KPI API
 */
@RestController
@RequestMapping("/api/v1/production")
public class ProductionDashboardController {

    private final ProductionDashboardService dashboardService;

    public ProductionDashboardController(ProductionDashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    /**
     * 대시보드 KPI 통합 조회
     * @param date 조회 일자 (YYYY-MM-DD, 기본: 오늘)
     */
    @GetMapping("/dashboard-kpi")
    public ApiResponse<DashboardKpiDto> getDashboardKpi(
            @RequestParam(required = false) String date) {
        DashboardKpiDto kpi = dashboardService.getDashboardKpi(date);
        return ApiResponse.success(kpi);
    }
}
