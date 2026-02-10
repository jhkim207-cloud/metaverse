package com.biz.management.auth.dto;

public class UserDto {

    private Long id;
    private String username;
    private String passwordHash;
    private String displayName;
    private String employeeId;
    private String email;
    private Boolean isActive;
    private Integer failedLoginCount;

    public UserDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Integer getFailedLoginCount() { return failedLoginCount; }
    public void setFailedLoginCount(Integer failedLoginCount) { this.failedLoginCount = failedLoginCount; }
}
