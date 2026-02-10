package com.biz.management.site.service;

import com.biz.management.site.dto.InventoryDto;
import com.biz.management.site.dto.InventoryTransactionDto;
import com.biz.management.site.mapper.InventoryMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryService {

    private final InventoryMapper inventoryMapper;

    public InventoryService(InventoryMapper inventoryMapper) {
        this.inventoryMapper = inventoryMapper;
    }

    public List<InventoryDto> findAll() {
        return inventoryMapper.findAll();
    }

    public List<InventoryDto> search(String inventoryType, String keyword) {
        return inventoryMapper.search(inventoryType, keyword);
    }

    public List<InventoryTransactionDto> findRecentTransactions(int limit) {
        return inventoryMapper.findRecentTransactions(limit);
    }

    public List<InventoryTransactionDto> findTransactionsByMaterial(String materialCd) {
        return inventoryMapper.findTransactionsByMaterial(materialCd);
    }
}
