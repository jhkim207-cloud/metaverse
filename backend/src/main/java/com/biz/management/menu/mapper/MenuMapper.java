package com.biz.management.menu.mapper;

import com.biz.management.menu.dto.MenuDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MenuMapper {

    List<MenuDto> findAllActive();
}
