package com.biz.management.menu.service;

import com.biz.management.menu.dto.MenuDto;
import com.biz.management.menu.mapper.MenuMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class MenuService {

    private final MenuMapper menuMapper;

    public MenuService(MenuMapper menuMapper) {
        this.menuMapper = menuMapper;
    }

    /**
     * 활성 메뉴를 2레벨 트리 구조로 반환
     */
    public List<MenuDto> getMenuTree() {
        List<MenuDto> flatList = menuMapper.findAllActive();
        return buildTree(flatList);
    }

    private List<MenuDto> buildTree(List<MenuDto> flatList) {
        Map<Long, MenuDto> map = new LinkedHashMap<>();
        List<MenuDto> roots = new ArrayList<>();

        for (MenuDto menu : flatList) {
            menu.setChildren(new ArrayList<>());
            map.put(menu.getId(), menu);
        }

        for (MenuDto menu : flatList) {
            if (menu.getParentId() == null) {
                roots.add(menu);
            } else {
                MenuDto parent = map.get(menu.getParentId());
                if (parent != null) {
                    parent.getChildren().add(menu);
                }
            }
        }

        return roots;
    }
}
