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

    @PostMapping
    public ApiResponse<Void> create(@RequestBody SitePriceDto dto) {
        sitePriceService.create(dto);
        return ApiResponse.success(null);
    }

    @PutMapping("/{id}")
    public ApiResponse<Void> update(@PathVariable Long id, @RequestBody SitePriceDto dto) {
        sitePriceService.update(id, dto);
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        sitePriceService.delete(id);
        return ApiResponse.success(null);
    }
}
