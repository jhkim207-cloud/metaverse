package com.biz.management.cutting.controller;

import com.biz.management.common.dto.ApiResponse;
import com.biz.management.cutting.dto.CuttingDailyLayoutDto;
import com.biz.management.cutting.service.CuttingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 재단 최적화 API
 */
@RestController
@RequestMapping("/api/v1/cutting")
public class CuttingController {

    private final CuttingService cuttingService;

    public CuttingController(CuttingService cuttingService) {
        this.cuttingService = cuttingService;
    }

    /**
     * 일별 재단 배치도 조회
     * @param date 조회 일자 (YYYY-MM-DD, 기본: 오늘)
     */
    @GetMapping("/daily-layout")
    public ApiResponse<CuttingDailyLayoutDto> getDailyLayout(
            @RequestParam(required = false) String date) {
        CuttingDailyLayoutDto layout = cuttingService.getDailyLayout(date);
        return ApiResponse.success(layout);
    }
}
