package com.biz.management.site.mapper;

import com.biz.management.site.dto.SitePriceDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SitePriceMapper {

    List<SitePriceDto> findBySiteCd(@Param("siteCd") String siteCd);

    void insert(SitePriceDto dto);

    void update(@Param("id") Long id, @Param("req") SitePriceDto req);

    void delete(@Param("id") Long id);

    void updateCustomerBySiteCd(@Param("siteCd") String siteCd,
                                @Param("customerCd") String customerCd,
                                @Param("customerNm") String customerNm);
}
