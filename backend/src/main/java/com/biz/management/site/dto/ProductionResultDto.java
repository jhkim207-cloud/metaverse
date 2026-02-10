package com.biz.management.site.dto;

import java.math.BigDecimal;

public class ProductionResultDto {

    private Long id;
    private String productionNo;
    private String productionDate;
    private String planNo;
    private Integer planLineNo;
    private String orderNo;
    private Long workRequestId;
    private String workRequestNo;
    private String materialCd;
    private String materialNm;
    private BigDecimal goodQty;
    private BigDecimal defectQty;
    private BigDecimal totalQty;
    private String unit;
    private BigDecimal goodArea;
    private BigDecimal defectArea;
    private BigDecimal totalArea;
    private String workerCd;
    private String defectReason;
    private String remarks;

    public ProductionResultDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProductionNo() { return productionNo; }
    public void setProductionNo(String productionNo) { this.productionNo = productionNo; }

    public String getProductionDate() { return productionDate; }
    public void setProductionDate(String productionDate) { this.productionDate = productionDate; }

    public String getPlanNo() { return planNo; }
    public void setPlanNo(String planNo) { this.planNo = planNo; }

    public Integer getPlanLineNo() { return planLineNo; }
    public void setPlanLineNo(Integer planLineNo) { this.planLineNo = planLineNo; }

    public String getOrderNo() { return orderNo; }
    public void setOrderNo(String orderNo) { this.orderNo = orderNo; }

    public Long getWorkRequestId() { return workRequestId; }
    public void setWorkRequestId(Long workRequestId) { this.workRequestId = workRequestId; }

    public String getWorkRequestNo() { return workRequestNo; }
    public void setWorkRequestNo(String workRequestNo) { this.workRequestNo = workRequestNo; }

    public String getMaterialCd() { return materialCd; }
    public void setMaterialCd(String materialCd) { this.materialCd = materialCd; }

    public String getMaterialNm() { return materialNm; }
    public void setMaterialNm(String materialNm) { this.materialNm = materialNm; }

    public BigDecimal getGoodQty() { return goodQty; }
    public void setGoodQty(BigDecimal goodQty) { this.goodQty = goodQty; }

    public BigDecimal getDefectQty() { return defectQty; }
    public void setDefectQty(BigDecimal defectQty) { this.defectQty = defectQty; }

    public BigDecimal getTotalQty() { return totalQty; }
    public void setTotalQty(BigDecimal totalQty) { this.totalQty = totalQty; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public BigDecimal getGoodArea() { return goodArea; }
    public void setGoodArea(BigDecimal goodArea) { this.goodArea = goodArea; }

    public BigDecimal getDefectArea() { return defectArea; }
    public void setDefectArea(BigDecimal defectArea) { this.defectArea = defectArea; }

    public BigDecimal getTotalArea() { return totalArea; }
    public void setTotalArea(BigDecimal totalArea) { this.totalArea = totalArea; }

    public String getWorkerCd() { return workerCd; }
    public void setWorkerCd(String workerCd) { this.workerCd = workerCd; }

    public String getDefectReason() { return defectReason; }
    public void setDefectReason(String defectReason) { this.defectReason = defectReason; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
