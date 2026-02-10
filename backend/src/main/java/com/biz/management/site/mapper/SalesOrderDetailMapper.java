package com.biz.management.site.mapper;

import com.biz.management.site.dto.SalesOrderCreateRequest;
import com.biz.management.site.dto.SalesOrderDetailDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SalesOrderDetailMapper {

    List<SalesOrderDetailDto> findByHeaderId(@Param("headerId") Long headerId);

    List<SalesOrderDetailDto> findByIds(@Param("ids") List<Long> ids);

    void updateProductionStatus(@Param("id") Long id, @Param("status") String status);

    void insertBatch(@Param("headerId") Long headerId, @Param("orderNo") String orderNo,
                     @Param("details") List<SalesOrderCreateRequest.DetailItem> details);

    void deleteByHeaderId(@Param("headerId") Long headerId);
}
