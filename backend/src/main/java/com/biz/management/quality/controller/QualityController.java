package com.biz.management.quality.controller;

import com.biz.management.common.dto.ApiResponse;
import com.biz.management.quality.dto.QualityDashboardDto;
import com.biz.management.quality.service.QualityService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 품질 SPC API
 */
@RestController
@RequestMapping("/api/v1/quality")
public class QualityController {

    private final QualityService qualityService;

    public QualityController(QualityService qualityService) {
        this.qualityService = qualityService;
    }

    /**
     * 품질 대시보드 데이터 조회
     * @param period 조회 기간 (예: 30d, 7d)
     */
    @GetMapping("/dashboard")
    public ApiResponse<QualityDashboardDto> getDashboard(
            @RequestParam(required = false) String period) {
        QualityDashboardDto data = qualityService.getDashboard(period);
        return ApiResponse.success(data);
    }
}
