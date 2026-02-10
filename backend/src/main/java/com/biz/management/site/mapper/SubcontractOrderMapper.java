package com.biz.management.site.mapper;

import com.biz.management.site.dto.SubcontractOrderDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SubcontractOrderMapper {

    List<SubcontractOrderDto> findAll();
}
