package com.biz.management.site.mapper;

import com.biz.management.site.dto.SitePriceDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SitePriceMapper {

    List<SitePriceDto> findBySiteCd(@Param("siteCd") String siteCd);
}
