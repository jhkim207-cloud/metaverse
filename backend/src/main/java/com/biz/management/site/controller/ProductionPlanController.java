package com.biz.management.site.controller;

import com.biz.management.common.dto.ApiResponse;
import com.biz.management.site.dto.PlanCreateRequest;
import com.biz.management.site.dto.ProductionPlanDto;
import com.biz.management.site.service.ProductionPlanService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/production-plans")
public class ProductionPlanController {

    private final ProductionPlanService productionPlanService;

    public ProductionPlanController(ProductionPlanService productionPlanService) {
        this.productionPlanService = productionPlanService;
    }

    @GetMapping
    public ApiResponse<List<ProductionPlanDto>> findByWeek(@RequestParam String weekStart) {
        List<ProductionPlanDto> plans = productionPlanService.findByWeek(weekStart);
        return ApiResponse.success(plans);
    }

    @GetMapping("/by-site")
    public ApiResponse<List<ProductionPlanDto>> findBySiteNm(@RequestParam String siteNm) {
        List<ProductionPlanDto> plans = productionPlanService.findBySiteNm(siteNm);
        return ApiResponse.success(plans);
    }

    @PutMapping("/{id}/schedule")
    public ApiResponse<Void> assignSchedule(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String startDate = body.get("startDate");
        String endDate = body.get("endDate");
        String machineNo = body.get("machineNo");
        productionPlanService.assignSchedule(id, startDate, endDate, machineNo);
        return ApiResponse.success(null);
    }

    @PostMapping
    public ApiResponse<ProductionPlanDto> create(@RequestBody ProductionPlanDto plan) {
        ProductionPlanDto created = productionPlanService.createPlan(plan);
        return ApiResponse.success(created);
    }

    @PostMapping("/with-details")
    public ApiResponse<ProductionPlanDto> createWithDetails(@RequestBody PlanCreateRequest request) {
        ProductionPlanDto created = productionPlanService.createPlanWithDetails(request);
        return ApiResponse.success(created);
    }
}
