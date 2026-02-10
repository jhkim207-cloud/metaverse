package com.biz.management.site.service;

import com.biz.management.site.dto.CodeMasterDto;
import com.biz.management.site.mapper.CodeMasterMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CodeMasterService {

    private final CodeMasterMapper codeMasterMapper;

    public CodeMasterService(CodeMasterMapper codeMasterMapper) {
        this.codeMasterMapper = codeMasterMapper;
    }

    public List<CodeMasterDto> findByGroupCode(String groupCode) {
        return codeMasterMapper.findByGroupCode(groupCode);
    }
}
