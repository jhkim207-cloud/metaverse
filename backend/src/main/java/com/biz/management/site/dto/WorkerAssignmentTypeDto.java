package com.biz.management.site.dto;

public class WorkerAssignmentTypeDto {

    private Long id;
    private String assignmentTypeCd;
    private String assignmentTypeNm;
    private String description;
    private Integer sortOrder;
    private Boolean isActive;

    public WorkerAssignmentTypeDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAssignmentTypeCd() { return assignmentTypeCd; }
    public void setAssignmentTypeCd(String assignmentTypeCd) { this.assignmentTypeCd = assignmentTypeCd; }

    public String getAssignmentTypeNm() { return assignmentTypeNm; }
    public void setAssignmentTypeNm(String assignmentTypeNm) { this.assignmentTypeNm = assignmentTypeNm; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
