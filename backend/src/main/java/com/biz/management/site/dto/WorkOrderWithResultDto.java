package com.biz.management.site.dto;

import java.math.BigDecimal;

public class WorkOrderWithResultDto {

    // work_request fields
    private Long id;
    private String requestNo;
    private String requestDate;
    private String orderNo;
    private String customerNm;
    private String supplierNm;
    private String siteNm;
    private String workCategory;
    private String approvalStatus;
    private String memo;
    private String remarks;
    private String productCategory;
    private String materialNm;
    private Integer thickness;
    private String unitType;
    private BigDecimal width;
    private BigDecimal height;
    private Integer quantity;
    private Integer unrequestedQuantity;
    private Integer requestedQuantity;
    private BigDecimal area;

    // production_result aggregation
    private BigDecimal goodQtySum;
    private BigDecimal defectQtySum;
    private String resultStatus;
    private Integer resultCount;

    public WorkOrderWithResultDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRequestNo() { return requestNo; }
    public void setRequestNo(String requestNo) { this.requestNo = requestNo; }

    public String getRequestDate() { return requestDate; }
    public void setRequestDate(String requestDate) { this.requestDate = requestDate; }

    public String getOrderNo() { return orderNo; }
    public void setOrderNo(String orderNo) { this.orderNo = orderNo; }

    public String getCustomerNm() { return customerNm; }
    public void setCustomerNm(String customerNm) { this.customerNm = customerNm; }

    public String getSupplierNm() { return supplierNm; }
    public void setSupplierNm(String supplierNm) { this.supplierNm = supplierNm; }

    public String getSiteNm() { return siteNm; }
    public void setSiteNm(String siteNm) { this.siteNm = siteNm; }

    public String getWorkCategory() { return workCategory; }
    public void setWorkCategory(String workCategory) { this.workCategory = workCategory; }

    public String getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(String approvalStatus) { this.approvalStatus = approvalStatus; }

    public String getMemo() { return memo; }
    public void setMemo(String memo) { this.memo = memo; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public String getProductCategory() { return productCategory; }
    public void setProductCategory(String productCategory) { this.productCategory = productCategory; }

    public String getMaterialNm() { return materialNm; }
    public void setMaterialNm(String materialNm) { this.materialNm = materialNm; }

    public Integer getThickness() { return thickness; }
    public void setThickness(Integer thickness) { this.thickness = thickness; }

    public String getUnitType() { return unitType; }
    public void setUnitType(String unitType) { this.unitType = unitType; }

    public BigDecimal getWidth() { return width; }
    public void setWidth(BigDecimal width) { this.width = width; }

    public BigDecimal getHeight() { return height; }
    public void setHeight(BigDecimal height) { this.height = height; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Integer getUnrequestedQuantity() { return unrequestedQuantity; }
    public void setUnrequestedQuantity(Integer unrequestedQuantity) { this.unrequestedQuantity = unrequestedQuantity; }

    public Integer getRequestedQuantity() { return requestedQuantity; }
    public void setRequestedQuantity(Integer requestedQuantity) { this.requestedQuantity = requestedQuantity; }

    public BigDecimal getArea() { return area; }
    public void setArea(BigDecimal area) { this.area = area; }

    public BigDecimal getGoodQtySum() { return goodQtySum; }
    public void setGoodQtySum(BigDecimal goodQtySum) { this.goodQtySum = goodQtySum; }

    public BigDecimal getDefectQtySum() { return defectQtySum; }
    public void setDefectQtySum(BigDecimal defectQtySum) { this.defectQtySum = defectQtySum; }

    public String getResultStatus() { return resultStatus; }
    public void setResultStatus(String resultStatus) { this.resultStatus = resultStatus; }

    public Integer getResultCount() { return resultCount; }
    public void setResultCount(Integer resultCount) { this.resultCount = resultCount; }
}
