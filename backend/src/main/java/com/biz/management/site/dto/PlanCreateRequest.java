package com.biz.management.site.dto;

import java.util.List;

public class PlanCreateRequest {

    private String startDate;
    private String endDate;
    private String machineNo;
    private String category;
    private String customerNm;
    private String siteNm;
    private String remarks;
    private String workRequestNo;
    private String siteCd;
    private List<DetailAssignment> details;

    public PlanCreateRequest() {}

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }

    public String getMachineNo() { return machineNo; }
    public void setMachineNo(String machineNo) { this.machineNo = machineNo; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getCustomerNm() { return customerNm; }
    public void setCustomerNm(String customerNm) { this.customerNm = customerNm; }

    public String getSiteNm() { return siteNm; }
    public void setSiteNm(String siteNm) { this.siteNm = siteNm; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public String getWorkRequestNo() { return workRequestNo; }
    public void setWorkRequestNo(String workRequestNo) { this.workRequestNo = workRequestNo; }

    public String getSiteCd() { return siteCd; }
    public void setSiteCd(String siteCd) { this.siteCd = siteCd; }

    public List<DetailAssignment> getDetails() { return details; }
    public void setDetails(List<DetailAssignment> details) { this.details = details; }

    public static class DetailAssignment {

        private Long detailId;
        private Integer assignedQuantity;

        public DetailAssignment() {}

        public Long getDetailId() { return detailId; }
        public void setDetailId(Long detailId) { this.detailId = detailId; }

        public Integer getAssignedQuantity() { return assignedQuantity; }
        public void setAssignedQuantity(Integer assignedQuantity) { this.assignedQuantity = assignedQuantity; }
    }
}
