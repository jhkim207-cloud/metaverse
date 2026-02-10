package com.biz.management.site.mapper;

import com.biz.management.site.dto.CodeMasterDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CodeMasterMapper {

    List<CodeMasterDto> findByGroupCode(@Param("groupCode") String groupCode);
}
