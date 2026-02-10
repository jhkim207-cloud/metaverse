package com.biz.management.site.controller;

import com.biz.management.common.dto.ApiResponse;
import com.biz.management.site.dto.PackingOrderDto;
import com.biz.management.site.service.PackingOrderService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/packing-orders")
public class PackingOrderController {

    private final PackingOrderService packingOrderService;

    public PackingOrderController(PackingOrderService packingOrderService) {
        this.packingOrderService = packingOrderService;
    }

    @GetMapping
    public ApiResponse<List<PackingOrderDto>> findAll() {
        List<PackingOrderDto> orders = packingOrderService.findAll();
        return ApiResponse.success(orders);
    }
}
