package com.biz.management.site.mapper;

import com.biz.management.site.dto.ProductionResultDto;
import com.biz.management.site.dto.ProductionSummaryDto;
import com.biz.management.site.dto.WorkOrderWithResultDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Mapper
public interface ProductionResultMapper {

    List<WorkOrderWithResultDto> findWorkOrdersWithResults(@Param("requestDate") String requestDate);

    List<ProductionResultDto> findByWorkRequestId(@Param("workRequestId") Long workRequestId);

    ProductionResultDto findById(@Param("id") Long id);

    ProductionSummaryDto getDailySummary(@Param("requestDate") String requestDate);

    void insert(ProductionResultDto dto);

    void update(ProductionResultDto dto);

    void delete(@Param("id") Long id);

    Map<String, BigDecimal> sumByWorkRequestId(@Param("workRequestId") Long workRequestId);
}
