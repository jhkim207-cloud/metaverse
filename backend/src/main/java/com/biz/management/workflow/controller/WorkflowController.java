package com.biz.management.workflow.controller;

import com.biz.management.common.dto.ApiResponse;
import com.biz.management.workflow.dto.StageCountDto;
import com.biz.management.workflow.dto.WorkflowItemDto;
import com.biz.management.workflow.service.WorkflowService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/workflow")
public class WorkflowController {

    private final WorkflowService workflowService;

    public WorkflowController(WorkflowService workflowService) {
        this.workflowService = workflowService;
    }

    @GetMapping("/stage-counts")
    public ApiResponse<List<StageCountDto>> getStageCounts() {
        List<StageCountDto> counts = workflowService.getStageCounts();
        return ApiResponse.success(counts);
    }

    @GetMapping("/stages/{stageCode}/items")
    public ApiResponse<List<WorkflowItemDto>> getStageItems(@PathVariable String stageCode) {
        List<WorkflowItemDto> items = workflowService.getStageItems(stageCode);
        return ApiResponse.success(items);
    }

    @GetMapping("/items/{itemId}")
    public ApiResponse<WorkflowItemDto> getItem(@PathVariable Long itemId) {
        WorkflowItemDto item = workflowService.getItem(itemId);
        if (item == null) {
            return ApiResponse.error("항목을 찾을 수 없습니다.");
        }
        return ApiResponse.success(item);
    }
}
