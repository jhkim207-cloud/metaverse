package com.biz.management.auth.dto;

import com.biz.management.menu.dto.MenuDto;

import java.util.List;

public class LoginResponse {

    private Long userId;
    private String username;
    private String displayName;
    private String employeeId;
    private String email;
    private List<String> roles;
    private List<MenuDto> menus;

    public LoginResponse() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public List<String> getRoles() { return roles; }
    public void setRoles(List<String> roles) { this.roles = roles; }

    public List<MenuDto> getMenus() { return menus; }
    public void setMenus(List<MenuDto> menus) { this.menus = menus; }
}
