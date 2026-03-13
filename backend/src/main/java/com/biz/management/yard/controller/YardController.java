package com.biz.management.yard.controller;

import com.biz.management.common.dto.ApiResponse;
import com.biz.management.yard.dto.*;
import com.biz.management.yard.service.YardService;
import org.springframework.web.bind.annotation.*;

/**
 * 야적장 REST API
 */
@RestController
@RequestMapping("/api/v1/yard")
public class YardController {

    private final YardService yardService;

    public YardController(YardService yardService) {
        this.yardService = yardService;
    }

    /** 야적장 전체 조회 */
    @GetMapping("/{yardCd}")
    public ApiResponse<YardViewDto> getYardView(@PathVariable String yardCd) {
        return ApiResponse.success(yardService.getYardView(yardCd));
    }

    /** 물건 추가 */
    @PostMapping("/{yardCd}/items")
    public ApiResponse<Void> addItem(@PathVariable String yardCd, @RequestBody YardItemDto item) {
        item.setYardCd(yardCd);
        yardService.addItem(item);
        return ApiResponse.success(null);
    }

    /** 물건 업데이트 */
    @PutMapping("/{yardCd}/items/{id}")
    public ApiResponse<Void> updateItem(@PathVariable String yardCd, @PathVariable Long id,
                                        @RequestBody YardItemDto item) {
        item.setId(id);
        item.setYardCd(yardCd);
        yardService.updateItem(item);
        return ApiResponse.success(null);
    }

    /** 물건 삭제 */
    @DeleteMapping("/{yardCd}/items/{id}")
    public ApiResponse<Void> removeItem(@PathVariable Long id) {
        yardService.removeItem(id);
        return ApiResponse.success(null);
    }

    /** CCTV 알람 토글 */
    @PutMapping("/{yardCd}/cctv/{id}/alarm")
    public ApiResponse<Void> toggleAlarm(@PathVariable String yardCd, @PathVariable Long id,
                                         @RequestParam(required = false) String cctvNm) {
        yardService.toggleCctvAlarm(id, yardCd, cctvNm != null ? cctvNm : "unknown");
        return ApiResponse.success(null);
    }
}
