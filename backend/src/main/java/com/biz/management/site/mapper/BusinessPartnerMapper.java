package com.biz.management.site.mapper;

import com.biz.management.site.dto.BusinessPartnerDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface BusinessPartnerMapper {

    BusinessPartnerDto findByBpCd(@Param("bpCd") String bpCd);

    java.util.List<BusinessPartnerDto> searchByName(@Param("keyword") String keyword, @Param("bpType") String bpType);
}
