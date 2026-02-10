package com.biz.management.site.mapper;

import com.biz.management.site.dto.PackingOrderDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PackingOrderMapper {

    List<PackingOrderDto> findAll();
}
