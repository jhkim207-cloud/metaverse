package com.biz.management.workflow.dto;

/**
 * 워크플로우 업무 항목 DTO
 */
public class WorkflowItemDto {

    private Long id;
    private String title;
    private String customer;
    private String product;
    private String status;
    private String priority;
    private String dueDate;
    private String orderType;
    private String stageCode;
    private String projectName;
    private String projectPhase;

    public WorkflowItemDto() {}

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCustomer() { return customer; }
    public void setCustomer(String customer) { this.customer = customer; }

    public String getProduct() { return product; }
    public void setProduct(String product) { this.product = product; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }

    public String getOrderType() { return orderType; }
    public void setOrderType(String orderType) { this.orderType = orderType; }

    public String getStageCode() { return stageCode; }
    public void setStageCode(String stageCode) { this.stageCode = stageCode; }

    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }

    public String getProjectPhase() { return projectPhase; }
    public void setProjectPhase(String projectPhase) { this.projectPhase = projectPhase; }
}
