package com.biz.management.menu.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * 메뉴 DTO
 */
public class MenuDto {

    private Long id;
    private String code;
    private String name;
    private Long parentId;
    private String path;
    private String icon;
    private String menuType;
    private Integer sortOrder;
    private Boolean isActive;
    private Integer depth;
    private List<MenuDto> children = new ArrayList<>();

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getParentId() { return parentId; }
    public void setParentId(Long parentId) { this.parentId = parentId; }

    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getMenuType() { return menuType; }
    public void setMenuType(String menuType) { this.menuType = menuType; }

    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Integer getDepth() { return depth; }
    public void setDepth(Integer depth) { this.depth = depth; }

    public List<MenuDto> getChildren() { return children; }
    public void setChildren(List<MenuDto> children) { this.children = children; }
}
