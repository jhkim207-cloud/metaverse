package com.biz.management.site.mapper;

import com.biz.management.site.dto.DeliveryHeaderDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface DeliveryHeaderMapper {

    List<DeliveryHeaderDto> findAll();

    List<DeliveryHeaderDto> search(@Param("status") String status,
                                   @Param("keyword") String keyword,
                                   @Param("dateFrom") String dateFrom,
                                   @Param("dateTo") String dateTo);
}
