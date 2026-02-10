package com.biz.management.site.dto;

import java.math.BigDecimal;

public class ProductionPlanDto {

    private Long id;
    private String planNo;
    private String productionDate;
    private String startDate;
    private String endDate;
    private String machineNo;
    private String category;
    private String customerNm;
    private String siteNm;
    private String location;
    private Integer thickness;
    private String productType;
    private String materialNm;
    private Integer quantity;
    private BigDecimal area;
    private String options;
    private Integer completedQuantity;
    private BigDecimal completedArea;
    private Integer defectQuantity;
    private BigDecimal defectArea;
    private Integer pendingQuantity;
    private BigDecimal pendingArea;
    private String shippingDate;
    private BigDecimal unitPrice;
    private BigDecimal amount;
    private String planStatus;
    private String remarks;
    private String workRequestNo;
    private String plannedStartDate;
    private String plannedEndDate;
    private String siteCd;

    public ProductionPlanDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPlanNo() { return planNo; }
    public void setPlanNo(String planNo) { this.planNo = planNo; }

    public String getProductionDate() { return productionDate; }
    public void setProductionDate(String productionDate) { this.productionDate = productionDate; }

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

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Integer getThickness() { return thickness; }
    public void setThickness(Integer thickness) { this.thickness = thickness; }

    public String getProductType() { return productType; }
    public void setProductType(String productType) { this.productType = productType; }

    public String getMaterialNm() { return materialNm; }
    public void setMaterialNm(String materialNm) { this.materialNm = materialNm; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getArea() { return area; }
    public void setArea(BigDecimal area) { this.area = area; }

    public String getOptions() { return options; }
    public void setOptions(String options) { this.options = options; }

    public Integer getCompletedQuantity() { return completedQuantity; }
    public void setCompletedQuantity(Integer completedQuantity) { this.completedQuantity = completedQuantity; }

    public BigDecimal getCompletedArea() { return completedArea; }
    public void setCompletedArea(BigDecimal completedArea) { this.completedArea = completedArea; }

    public Integer getDefectQuantity() { return defectQuantity; }
    public void setDefectQuantity(Integer defectQuantity) { this.defectQuantity = defectQuantity; }

    public BigDecimal getDefectArea() { return defectArea; }
    public void setDefectArea(BigDecimal defectArea) { this.defectArea = defectArea; }

    public Integer getPendingQuantity() { return pendingQuantity; }
    public void setPendingQuantity(Integer pendingQuantity) { this.pendingQuantity = pendingQuantity; }

    public BigDecimal getPendingArea() { return pendingArea; }
    public void setPendingArea(BigDecimal pendingArea) { this.pendingArea = pendingArea; }

    public String getShippingDate() { return shippingDate; }
    public void setShippingDate(String shippingDate) { this.shippingDate = shippingDate; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getPlanStatus() { return planStatus; }
    public void setPlanStatus(String planStatus) { this.planStatus = planStatus; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public String getWorkRequestNo() { return workRequestNo; }
    public void setWorkRequestNo(String workRequestNo) { this.workRequestNo = workRequestNo; }

    public String getPlannedStartDate() { return plannedStartDate; }
    public void setPlannedStartDate(String plannedStartDate) { this.plannedStartDate = plannedStartDate; }

    public String getPlannedEndDate() { return plannedEndDate; }
    public void setPlannedEndDate(String plannedEndDate) { this.plannedEndDate = plannedEndDate; }

    public String getSiteCd() { return siteCd; }
    public void setSiteCd(String siteCd) { this.siteCd = siteCd; }
}
