package com.biz.management.auth.mapper;

import com.biz.management.auth.dto.UserDto;
import com.biz.management.menu.dto.MenuDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AuthMapper {

    UserDto findByUsername(@Param("username") String username);

    List<String> findRoleCodesByUserId(@Param("userId") Long userId);

    List<MenuDto> findMenusByUserId(@Param("userId") Long userId);

    void incrementFailedLoginCount(@Param("userId") Long userId);

    void resetFailedLoginCount(@Param("userId") Long userId);

    void updateLastLoginAt(@Param("userId") Long userId);
}
