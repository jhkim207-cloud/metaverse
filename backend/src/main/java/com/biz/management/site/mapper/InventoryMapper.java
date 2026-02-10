package com.biz.management.site.mapper;

import com.biz.management.site.dto.InventoryDto;
import com.biz.management.site.dto.InventoryTransactionDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface InventoryMapper {

    List<InventoryDto> findAll();

    List<InventoryDto> search(@Param("inventoryType") String inventoryType,
                              @Param("keyword") String keyword);

    List<InventoryTransactionDto> findRecentTransactions(@Param("limit") int limit);

    List<InventoryTransactionDto> findTransactionsByMaterial(@Param("materialCd") String materialCd);
}
