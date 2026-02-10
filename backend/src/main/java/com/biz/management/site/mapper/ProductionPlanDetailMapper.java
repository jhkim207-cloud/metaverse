package com.biz.management.site.mapper;

import com.biz.management.site.dto.ProductionPlanDetailDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ProductionPlanDetailMapper {

    List<ProductionPlanDetailDto> findByPlanId(@Param("planId") Long planId);

    List<ProductionPlanDetailDto> findByIds(@Param("ids") List<Long> ids);
}
