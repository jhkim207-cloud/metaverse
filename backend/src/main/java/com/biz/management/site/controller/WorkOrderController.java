package com.biz.management.site.controller;

import com.biz.management.common.dto.ApiResponse;
import com.biz.management.site.dto.ProductionPlanDetailDto;
import com.biz.management.site.dto.ProductionPlanDto;
import com.biz.management.site.dto.WorkOrderCreateRequest;
import com.biz.management.site.dto.WorkOrderDto;
import com.biz.management.site.service.WorkOrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/work-orders")
public class WorkOrderController {

    private final WorkOrderService workOrderService;

    public WorkOrderController(WorkOrderService workOrderService) {
        this.workOrderService = workOrderService;
    }

    @GetMapping("/plans")
    public ApiResponse<List<ProductionPlanDto>> findUncompletedPlans(@RequestParam String targetDate) {
        List<ProductionPlanDto> plans = workOrderService.findUncompletedPlans(targetDate);
        return ApiResponse.success(plans);
    }

    @GetMapping("/plans/{planId}/details")
    public ApiResponse<List<ProductionPlanDetailDto>> findPlanDetails(@PathVariable Long planId) {
        List<ProductionPlanDetailDto> details = workOrderService.findPlanDetails(planId);
        return ApiResponse.success(details);
    }

    @PostMapping
    public ApiResponse<List<WorkOrderDto>> createWorkOrders(@RequestBody WorkOrderCreateRequest request) {
        List<WorkOrderDto> created = workOrderService.createWorkOrders(request);
        return ApiResponse.success(created);
    }

    @GetMapping
    public ApiResponse<List<WorkOrderDto>> findByRequestDate(@RequestParam(required = false) String requestDate) {
        List<WorkOrderDto> orders = (requestDate != null && !requestDate.isEmpty())
                ? workOrderService.findWorkOrders(requestDate)
                : workOrderService.findAllWorkOrders();
        return ApiResponse.success(orders);
    }

    @GetMapping("/by-plan/{planId}")
    public ApiResponse<List<WorkOrderDto>> findByPlanId(@PathVariable Long planId) {
        List<WorkOrderDto> orders = workOrderService.findWorkOrdersByPlanId(planId);
        return ApiResponse.success(orders);
    }
}
