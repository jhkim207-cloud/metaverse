package com.biz.management.site.controller;

import com.biz.management.common.dto.ApiResponse;
import com.biz.management.site.dto.InventoryDto;
import com.biz.management.site.dto.InventoryTransactionDto;
import com.biz.management.site.service.InventoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public ApiResponse<List<InventoryDto>> findAll() {
        return ApiResponse.success(inventoryService.findAll());
    }

    @GetMapping("/search")
    public ApiResponse<List<InventoryDto>> search(
            @RequestParam(required = false) String inventoryType,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.success(inventoryService.search(inventoryType, keyword));
    }

    @GetMapping("/transactions/recent")
    public ApiResponse<List<InventoryTransactionDto>> recentTransactions(
            @RequestParam(defaultValue = "30") int limit) {
        return ApiResponse.success(inventoryService.findRecentTransactions(limit));
    }

    @GetMapping("/transactions/{materialCd}")
    public ApiResponse<List<InventoryTransactionDto>> transactionsByMaterial(
            @PathVariable String materialCd) {
        return ApiResponse.success(inventoryService.findTransactionsByMaterial(materialCd));
    }
}
