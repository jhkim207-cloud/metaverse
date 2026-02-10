package com.biz.management.site.dto;

import java.math.BigDecimal;

/**
 * 임가공(외주발주) DTO
 */
public class SubcontractOrderDto {

    private Long id;
    private String subcontractNo;
    private Integer lineSeq;
    private String subcontractDate;
    private String subcontractType;
    private String subcontractorCd;
    private String subcontractorNm;
    private String orderNo;
    private String siteNm;
    private String location;
    private String materialCd;
    private String materialNm;
    private String productType;
    private BigDecimal thickness;
    private BigDecimal orderQty;
    private String unit;
    private BigDecimal areaM2;
    private BigDecimal areaPyeong;
    private BigDecimal unitPrice;
    private BigDecimal totalAmount;
    private String requestedReceiptDate;
    private String actualReceiptDate;
    private String receiptChangedDate;
    private String receiptLocation;
    private BigDecimal completedQty;
    private String subcontractStatus;
    private String remarks;

    public SubcontractOrderDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSubcontractNo() { return subcontractNo; }
    public void setSubcontractNo(String subcontractNo) { this.subcontractNo = subcontractNo; }

    public Integer getLineSeq() { return lineSeq; }
    public void setLineSeq(Integer lineSeq) { this.lineSeq = lineSeq; }

    public String getSubcontractDate() { return subcontractDate; }
    public void setSubcontractDate(String subcontractDate) { this.subcontractDate = subcontractDate; }

    public String getSubcontractType() { return subcontractType; }
    public void setSubcontractType(String subcontractType) { this.subcontractType = subcontractType; }

    public String getSubcontractorCd() { return subcontractorCd; }
    public void setSubcontractorCd(String subcontractorCd) { this.subcontractorCd = subcontractorCd; }

    public String getSubcontractorNm() { return subcontractorNm; }
    public void setSubcontractorNm(String subcontractorNm) { this.subcontractorNm = subcontractorNm; }

    public String getOrderNo() { return orderNo; }
    public void setOrderNo(String orderNo) { this.orderNo = orderNo; }

    public String getSiteNm() { return siteNm; }
    public void setSiteNm(String siteNm) { this.siteNm = siteNm; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getMaterialCd() { return materialCd; }
    public void setMaterialCd(String materialCd) { this.materialCd = materialCd; }

    public String getMaterialNm() { return materialNm; }
    public void setMaterialNm(String materialNm) { this.materialNm = materialNm; }

    public String getProductType() { return productType; }
    public void setProductType(String productType) { this.productType = productType; }

    public BigDecimal getThickness() { return thickness; }
    public void setThickness(BigDecimal thickness) { this.thickness = thickness; }

    public BigDecimal getOrderQty() { return orderQty; }
    public void setOrderQty(BigDecimal orderQty) { this.orderQty = orderQty; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public BigDecimal getAreaM2() { return areaM2; }
    public void setAreaM2(BigDecimal areaM2) { this.areaM2 = areaM2; }

    public BigDecimal getAreaPyeong() { return areaPyeong; }
    public void setAreaPyeong(BigDecimal areaPyeong) { this.areaPyeong = areaPyeong; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getRequestedReceiptDate() { return requestedReceiptDate; }
    public void setRequestedReceiptDate(String requestedReceiptDate) { this.requestedReceiptDate = requestedReceiptDate; }

    public String getActualReceiptDate() { return actualReceiptDate; }
    public void setActualReceiptDate(String actualReceiptDate) { this.actualReceiptDate = actualReceiptDate; }

    public String getReceiptChangedDate() { return receiptChangedDate; }
    public void setReceiptChangedDate(String receiptChangedDate) { this.receiptChangedDate = receiptChangedDate; }

    public String getReceiptLocation() { return receiptLocation; }
    public void setReceiptLocation(String receiptLocation) { this.receiptLocation = receiptLocation; }

    public BigDecimal getCompletedQty() { return completedQty; }
    public void setCompletedQty(BigDecimal completedQty) { this.completedQty = completedQty; }

    public String getSubcontractStatus() { return subcontractStatus; }
    public void setSubcontractStatus(String subcontractStatus) { this.subcontractStatus = subcontractStatus; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
