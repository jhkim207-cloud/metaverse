package com.biz.management.site.service;

import com.biz.management.site.dto.BusinessPartnerDto;
import com.biz.management.site.mapper.BusinessPartnerMapper;
import org.springframework.stereotype.Service;

@Service
public class BusinessPartnerService {

    private final BusinessPartnerMapper businessPartnerMapper;

    public BusinessPartnerService(BusinessPartnerMapper businessPartnerMapper) {
        this.businessPartnerMapper = businessPartnerMapper;
    }

    public BusinessPartnerDto findByBpCd(String bpCd) {
        return businessPartnerMapper.findByBpCd(bpCd);
    }
}
