package com.biz.management.site.mapper;

import com.biz.management.site.dto.ProductionPlanDto;
import com.biz.management.site.dto.SalesOrderDetailDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ProductionPlanMapper {

    List<ProductionPlanDto> findByDateRange(@Param("startDate") String startDate, @Param("endDate") String endDate);

    List<ProductionPlanDto> findBySiteNm(@Param("siteNm") String siteNm);

    void updateSchedule(@Param("id") Long id,
                        @Param("startDate") String startDate,
                        @Param("endDate") String endDate,
                        @Param("machineNo") String machineNo);

    void insert(ProductionPlanDto plan);

    void insertPlanOrderDetail(@Param("planId") Long planId,
                               @Param("detailId") Long detailId,
                               @Param("assignedQuantity") Integer assignedQuantity);

    List<ProductionPlanDto> findUncompletedByTargetDate(@Param("targetDate") String targetDate);

    ProductionPlanDto findById(@Param("id") Long id);

    void insertPlanDetail(@Param("planId") Long planId,
                          @Param("orderDetailId") Long orderDetailId,
                          @Param("orderNo") String orderNo,
                          @Param("lineSeq") Integer lineSeq,
                          @Param("materialCd") String materialCd,
                          @Param("materialNm") String materialNm,
                          @Param("productCategory") String productCategory,
                          @Param("width") java.math.BigDecimal width,
                          @Param("height") java.math.BigDecimal height,
                          @Param("thickness") java.math.BigDecimal thickness,
                          @Param("unitType") String unitType,
                          @Param("quantity") Integer quantity,
                          @Param("area") java.math.BigDecimal area,
                          @Param("unit") String unit,
                          @Param("unitPrice") java.math.BigDecimal unitPrice,
                          @Param("amount") java.math.BigDecimal amount,
                          @Param("dong") String dong,
                          @Param("ho") String ho,
                          @Param("floor") String floor,
                          @Param("windowType") String windowType,
                          @Param("locationDetail") String locationDetail,
                          @Param("deliveryDate") String deliveryDate,
                          @Param("remarks") String remarks);
}
