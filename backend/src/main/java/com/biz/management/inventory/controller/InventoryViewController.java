package com.biz.management.inventory.controller;

import com.biz.management.common.dto.ApiResponse;
import com.biz.management.inventory.dto.WarehouseViewDto;
import com.biz.management.inventory.service.InventoryViewService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 창고/재고 3D 뷰 API
 */
@RestController
@RequestMapping("/api/v1/inventory")
public class InventoryViewController {

    private final InventoryViewService inventoryViewService;

    public InventoryViewController(InventoryViewService inventoryViewService) {
        this.inventoryViewService = inventoryViewService;
    }

    /**
     * 창고 3D 뷰 데이터 조회
     */
    @GetMapping("/warehouse-view")
    public ApiResponse<WarehouseViewDto> getWarehouseView() {
        WarehouseViewDto data = inventoryViewService.getWarehouseView();
        return ApiResponse.success(data);
    }
}
