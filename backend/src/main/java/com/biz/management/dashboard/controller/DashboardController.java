package com.biz.management.dashboard.controller;

import com.biz.management.common.dto.ApiResponse;
import com.biz.management.dashboard.dto.DashboardDto.*;
import com.biz.management.dashboard.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/production-flow")
    public ApiResponse<WorkflowResponse> getProductionFlow(
            @RequestParam(defaultValue = "daily") String period) {
        return ApiResponse.success(dashboardService.getProductionFlow(Period.from(period)));
    }

    @GetMapping("/material-flow")
    public ApiResponse<WorkflowResponse> getMaterialFlow(
            @RequestParam(defaultValue = "daily") String period) {
        return ApiResponse.success(dashboardService.getMaterialFlow(Period.from(period)));
    }

    @GetMapping("/operations")
    public ApiResponse<OperationsResponse> getOperations(
            @RequestParam(defaultValue = "daily") String period) {
        return ApiResponse.success(dashboardService.getOperations(Period.from(period)));
    }

    @GetMapping("/site-summary")
    public ApiResponse<SiteSummaryResponse> getSiteSummary(
            @RequestParam(defaultValue = "daily") String period) {
        return ApiResponse.success(dashboardService.getSiteSummary(Period.from(period)));
    }
}
