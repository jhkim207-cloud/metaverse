package com.biz.management.site.controller;

import com.biz.management.common.dto.ApiResponse;
import com.biz.management.site.dto.BusinessPartnerDto;
import com.biz.management.site.service.BusinessPartnerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/business-partners")
public class BusinessPartnerController {

    private final BusinessPartnerService businessPartnerService;

    public BusinessPartnerController(BusinessPartnerService businessPartnerService) {
        this.businessPartnerService = businessPartnerService;
    }

    @GetMapping("/by-bp-cd/{bpCd}")
    public ApiResponse<BusinessPartnerDto> findByBpCd(@PathVariable String bpCd) {
        BusinessPartnerDto bp = businessPartnerService.findByBpCd(bpCd);
        if (bp == null) {
            return ApiResponse.error("거래처를 찾을 수 없습니다.");
        }
        return ApiResponse.success(bp);
    }

    @GetMapping("/search")
    public ApiResponse<List<BusinessPartnerDto>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String bpType) {
        List<BusinessPartnerDto> list = businessPartnerService.searchByName(keyword, bpType);
        return ApiResponse.success(list);
    }
}
