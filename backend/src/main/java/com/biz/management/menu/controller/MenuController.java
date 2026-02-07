package com.biz.management.menu.controller;

import com.biz.management.common.dto.ApiResponse;
import com.biz.management.menu.dto.MenuDto;
import com.biz.management.menu.service.MenuService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/menus")
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping
    public ApiResponse<List<MenuDto>> getMenuTree() {
        List<MenuDto> menuTree = menuService.getMenuTree();
        return ApiResponse.success(menuTree);
    }
}
