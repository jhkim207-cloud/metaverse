package com.biz.management.site.controller;

import com.biz.management.common.dto.ApiResponse;
import com.biz.management.site.dto.DeliveryDetailDto;
import com.biz.management.site.dto.DeliveryHeaderDto;
import com.biz.management.site.service.DeliveryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/deliveries")
public class DeliveryController {

    private final DeliveryService deliveryService;

    public DeliveryController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    @GetMapping
    public ApiResponse<List<DeliveryHeaderDto>> findAll() {
        return ApiResponse.success(deliveryService.findAll());
    }

    @GetMapping("/search")
    public ApiResponse<List<DeliveryHeaderDto>> search(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo) {
        return ApiResponse.success(deliveryService.search(status, keyword, dateFrom, dateTo));
    }

    @GetMapping("/{deliveryNo}/details")
    public ApiResponse<List<DeliveryDetailDto>> findDetails(@PathVariable String deliveryNo) {
        return ApiResponse.success(deliveryService.findDetailsByDeliveryNo(deliveryNo));
    }
}
