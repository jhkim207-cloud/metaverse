package com.biz.management.site.controller;

import com.biz.management.common.dto.ApiResponse;
import com.biz.management.site.dto.SitePriceDto;
import com.biz.management.site.service.SitePriceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/site-prices")
public class SitePriceController {

    private final SitePriceService sitePriceService;

    public SitePriceController(SitePriceService sitePriceService) {
        this.sitePriceService = sitePriceService;
    }

    @GetMapping("/by-site-cd/{siteCd}")
    public ApiResponse<List<SitePriceDto>> findBySiteCd(@PathVariable String siteCd) {
        List<SitePriceDto> prices = sitePriceService.findBySiteCd(siteCd);
        return ApiResponse.success(prices);
    }
}
