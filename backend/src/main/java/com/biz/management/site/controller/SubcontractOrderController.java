package com.biz.management.site.controller;

import com.biz.management.common.dto.ApiResponse;
import com.biz.management.site.dto.SubcontractOrderDto;
import com.biz.management.site.service.SubcontractOrderService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/subcontract-orders")
public class SubcontractOrderController {

    private final SubcontractOrderService subcontractOrderService;

    public SubcontractOrderController(SubcontractOrderService subcontractOrderService) {
        this.subcontractOrderService = subcontractOrderService;
    }

    @GetMapping
    public ApiResponse<List<SubcontractOrderDto>> findAll() {
        List<SubcontractOrderDto> orders = subcontractOrderService.findAll();
        return ApiResponse.success(orders);
    }
}
