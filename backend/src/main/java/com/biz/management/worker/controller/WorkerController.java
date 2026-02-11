package com.biz.management.worker.controller;

import com.biz.management.common.dto.ApiResponse;
import com.biz.management.worker.dto.WorkerDistributionDto;
import com.biz.management.worker.service.WorkerDistributionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 작업자 배치 API
 */
@RestController
@RequestMapping("/api/v1/workers")
public class WorkerController {

    private final WorkerDistributionService workerDistributionService;

    public WorkerController(WorkerDistributionService workerDistributionService) {
        this.workerDistributionService = workerDistributionService;
    }

    /**
     * 작업자 일일 분포 조회
     * @param date 조회 일자 (YYYY-MM-DD, 기본: 오늘)
     */
    @GetMapping("/daily-distribution")
    public ApiResponse<WorkerDistributionDto> getDailyDistribution(
            @RequestParam(required = false) String date) {
        WorkerDistributionDto data = workerDistributionService.getDailyDistribution(date);
        return ApiResponse.success(data);
    }
}
