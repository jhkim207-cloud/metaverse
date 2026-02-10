package com.biz.management.site.mapper;

import com.biz.management.site.dto.SalesOrderCreateRequest;
import com.biz.management.site.dto.SalesOrderHeaderDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SalesOrderHeaderMapper {

    List<SalesOrderHeaderDto> findAll();

    List<SalesOrderHeaderDto> findBySiteNm(@Param("siteNm") String siteNm);

    SalesOrderHeaderDto findById(@Param("id") Long id);

    String nextOrderNo();

    void insert(@Param("req") SalesOrderCreateRequest request, @Param("orderNo") String orderNo);

    void update(@Param("id") Long id, @Param("req") SalesOrderCreateRequest request);

    void delete(@Param("id") Long id);

    void updateTotalAmount(@Param("id") Long id);
}
