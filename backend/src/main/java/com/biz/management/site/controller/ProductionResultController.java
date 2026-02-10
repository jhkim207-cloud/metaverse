package com.biz.management.site.controller;

import com.biz.management.common.dto.ApiResponse;
import com.biz.management.site.dto.ProductionResultCreateRequest;
import com.biz.management.site.dto.ProductionResultDto;
import com.biz.management.site.dto.ProductionResultUpdateRequest;
import com.biz.management.site.dto.ProductionSummaryDto;
import com.biz.management.site.dto.WorkOrderWithResultDto;
import com.biz.management.site.service.ProductionResultService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/production-results")
public class ProductionResultController {

    private final ProductionResultService productionResultService;

    public ProductionResultController(ProductionResultService productionResultService) {
        this.productionResultService = productionResultService;
    }

    @GetMapping("/work-orders")
    public ApiResponse<List<WorkOrderWithResultDto>> findWorkOrdersWithResults(
            @RequestParam(required = false) String requestDate) {
        return ApiResponse.success(productionResultService.findWorkOrdersWithResults(requestDate));
    }

    @GetMapping("/{workRequestId}/results")
    public ApiResponse<List<ProductionResultDto>> findByWorkRequestId(
            @PathVariable Long workRequestId) {
        return ApiResponse.success(productionResultService.findByWorkRequestId(workRequestId));
    }

    @GetMapping("/summary")
    public ApiResponse<ProductionSummaryDto> getDailySummary(
            @RequestParam(required = false) String requestDate) {
        return ApiResponse.success(productionResultService.getDailySummary(requestDate));
    }

    @PostMapping
    public ApiResponse<ProductionResultDto> createResult(
            @RequestBody ProductionResultCreateRequest request) {
        return ApiResponse.success(productionResultService.createResult(request));
    }

    @PostMapping("/full-complete")
    public ApiResponse<ProductionResultDto> fullComplete(
            @RequestBody Map<String, Object> request) {
        Long workRequestId = Long.valueOf(request.get("workRequestId").toString());
        String productionDate = request.get("productionDate").toString();
        return ApiResponse.success(productionResultService.fullComplete(workRequestId, productionDate));
    }

    @PutMapping("/{id}")
    public ApiResponse<ProductionResultDto> updateResult(
            @PathVariable Long id,
            @RequestBody ProductionResultUpdateRequest request) {
        return ApiResponse.success(productionResultService.updateResult(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteResult(@PathVariable Long id) {
        productionResultService.deleteResult(id);
        return ApiResponse.success(null);
    }
}
