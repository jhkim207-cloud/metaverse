package com.biz.management.site.controller;

import com.biz.management.common.dto.ApiResponse;
import com.biz.management.site.dto.SiteMasterDto;
import com.biz.management.site.dto.SiteMasterCreateRequest;
import com.biz.management.site.service.SiteMasterService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sites")
public class SiteMasterController {

    private final SiteMasterService siteMasterService;

    public SiteMasterController(SiteMasterService siteMasterService) {
        this.siteMasterService = siteMasterService;
    }

    @GetMapping
    public ApiResponse<List<SiteMasterDto>> findAll() {
        List<SiteMasterDto> sites = siteMasterService.findAll();
        return ApiResponse.success(sites);
    }

    @GetMapping("/{id}")
    public ApiResponse<SiteMasterDto> findById(@PathVariable Long id) {
        SiteMasterDto site = siteMasterService.findById(id);
        if (site == null) {
            return ApiResponse.error("현장을 찾을 수 없습니다.");
        }
        return ApiResponse.success(site);
    }

    @PostMapping
    public ApiResponse<Void> create(@Valid @RequestBody SiteMasterCreateRequest request) {
        try {
            siteMasterService.create(request);
            return ApiResponse.success(null, "현장이 등록되었습니다.");
        } catch (IllegalArgumentException e) {
            return ApiResponse.error(e.getMessage(), "DUPLICATE_SITE_CD");
        }
    }

    @PutMapping("/{id}")
    public ApiResponse<Void> update(@PathVariable Long id, @Valid @RequestBody SiteMasterCreateRequest request) {
        try {
            siteMasterService.update(id, request);
            return ApiResponse.success(null, "현장이 수정되었습니다.");
        } catch (IllegalArgumentException e) {
            return ApiResponse.error(e.getMessage(), "UPDATE_FAILED");
        }
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        try {
            siteMasterService.delete(id);
            return ApiResponse.success(null, "현장이 삭제되었습니다.");
        } catch (IllegalArgumentException e) {
            return ApiResponse.error(e.getMessage(), "DELETE_FAILED");
        }
    }
}
