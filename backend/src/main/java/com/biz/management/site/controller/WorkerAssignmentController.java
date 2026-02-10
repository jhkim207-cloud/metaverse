package com.biz.management.site.controller;

import com.biz.management.common.dto.ApiResponse;
import com.biz.management.site.dto.WorkerDailyAssignmentDto;
import com.biz.management.site.dto.WorkerAssignmentTypeDto;
import com.biz.management.site.service.WorkerAssignmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/worker-assignments")
public class WorkerAssignmentController {

    private final WorkerAssignmentService workerAssignmentService;

    public WorkerAssignmentController(WorkerAssignmentService workerAssignmentService) {
        this.workerAssignmentService = workerAssignmentService;
    }

    @GetMapping("/daily")
    public ApiResponse<List<WorkerDailyAssignmentDto>> findByWorkDate(@RequestParam String workDate) {
        List<WorkerDailyAssignmentDto> assignments = workerAssignmentService.findByWorkDate(workDate);
        return ApiResponse.success(assignments);
    }

    @GetMapping("/types")
    public ApiResponse<List<WorkerAssignmentTypeDto>> findAssignmentTypes() {
        List<WorkerAssignmentTypeDto> types = workerAssignmentService.findAllAssignmentTypes();
        return ApiResponse.success(types);
    }

    @GetMapping("/dates")
    public ApiResponse<List<String>> findAvailableDates() {
        List<String> dates = workerAssignmentService.findAvailableDates();
        return ApiResponse.success(dates);
    }
}
