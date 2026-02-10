package com.biz.management.site.controller;

import com.biz.management.common.dto.ApiResponse;
import com.biz.management.site.dto.CodeMasterDto;
import com.biz.management.site.service.CodeMasterService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/codes")
public class CodeMasterController {

    private final CodeMasterService codeMasterService;

    public CodeMasterController(CodeMasterService codeMasterService) {
        this.codeMasterService = codeMasterService;
    }

    @GetMapping
    public ApiResponse<List<CodeMasterDto>> findByGroupCode(@RequestParam String groupCode) {
        List<CodeMasterDto> codes = codeMasterService.findByGroupCode(groupCode);
        return ApiResponse.success(codes);
    }
}
