package com.biz.management.site.dto;

import java.util.List;

public class WorkOrderCreateRequest {

    private String requestDate;
    private List<Long> planDetailIds;

    public WorkOrderCreateRequest() {}

    public String getRequestDate() { return requestDate; }
    public void setRequestDate(String requestDate) { this.requestDate = requestDate; }

    public List<Long> getPlanDetailIds() { return planDetailIds; }
    public void setPlanDetailIds(List<Long> planDetailIds) { this.planDetailIds = planDetailIds; }
}
