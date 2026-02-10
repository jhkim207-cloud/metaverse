package com.biz.management.site.mapper;

import com.biz.management.site.dto.DeliveryDetailDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface DeliveryDetailMapper {

    List<DeliveryDetailDto> findByDeliveryNo(@Param("deliveryNo") String deliveryNo);
}
