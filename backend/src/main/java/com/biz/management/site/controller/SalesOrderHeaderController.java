package com.biz.management.site.controller;

import com.biz.management.common.dto.ApiResponse;
import com.biz.management.site.dto.SalesOrderCreateRequest;
import com.biz.management.site.dto.SalesOrderDetailDto;
import com.biz.management.site.dto.SalesOrderHeaderDto;
import com.biz.management.site.service.SalesOrderDetailService;
import com.biz.management.site.service.SalesOrderHeaderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sales-orders")
public class SalesOrderHeaderController {

    private final SalesOrderHeaderService salesOrderHeaderService;
    private final SalesOrderDetailService salesOrderDetailService;

    public SalesOrderHeaderController(SalesOrderHeaderService salesOrderHeaderService,
                                       SalesOrderDetailService salesOrderDetailService) {
        this.salesOrderHeaderService = salesOrderHeaderService;
        this.salesOrderDetailService = salesOrderDetailService;
    }

    @GetMapping
    public ApiResponse<List<SalesOrderHeaderDto>> findAll() {
        List<SalesOrderHeaderDto> orders = salesOrderHeaderService.findAll();
        return ApiResponse.success(orders);
    }

    @GetMapping("/{headerId}/details")
    public ApiResponse<List<SalesOrderDetailDto>> findDetailsByHeaderId(@PathVariable Long headerId) {
        List<SalesOrderDetailDto> details = salesOrderDetailService.findByHeaderId(headerId);
        return ApiResponse.success(details);
    }

    @GetMapping("/next-order-no")
    public ApiResponse<String> nextOrderNo() {
        String orderNo = salesOrderHeaderService.nextOrderNo();
        return ApiResponse.success(orderNo);
    }

    @PostMapping
    public ApiResponse<SalesOrderHeaderDto> create(@RequestBody SalesOrderCreateRequest request) {
        SalesOrderHeaderDto created = salesOrderHeaderService.create(request);
        return ApiResponse.success(created);
    }

    @PutMapping("/{id}")
    public ApiResponse<SalesOrderHeaderDto> update(@PathVariable Long id,
                                                    @RequestBody SalesOrderCreateRequest request) {
        SalesOrderHeaderDto updated = salesOrderHeaderService.update(id, request);
        return ApiResponse.success(updated);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        salesOrderHeaderService.delete(id);
        return ApiResponse.success(null);
    }
}
