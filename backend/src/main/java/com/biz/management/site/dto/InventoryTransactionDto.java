package com.biz.management.site.dto;

import java.math.BigDecimal;

public class InventoryTransactionDto {

    private Long id;
    private String transactionNo;
    private String transactionDate;
    private String transactionType;
    private String materialCd;
    private String materialNm;
    private BigDecimal widthMm;
    private BigDecimal heightMm;
    private BigDecimal quantity;
    private String unit;
    private BigDecimal areaPyeong;
    private BigDecimal beforeQty;
    private BigDecimal afterQty;
    private String fromLocation;
    private String toLocation;
    private String siteCd;
    private String siteNm;
    private String vehicleNo;
    private String refDocType;
    private String refDocNo;
    private String remarks;

    public InventoryTransactionDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTransactionNo() { return transactionNo; }
    public void setTransactionNo(String transactionNo) { this.transactionNo = transactionNo; }
    public String getTransactionDate() { return transactionDate; }
    public void setTransactionDate(String transactionDate) { this.transactionDate = transactionDate; }
    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }
    public String getMaterialCd() { return materialCd; }
    public void setMaterialCd(String materialCd) { this.materialCd = materialCd; }
    public String getMaterialNm() { return materialNm; }
    public void setMaterialNm(String materialNm) { this.materialNm = materialNm; }
    public BigDecimal getWidthMm() { return widthMm; }
    public void setWidthMm(BigDecimal widthMm) { this.widthMm = widthMm; }
    public BigDecimal getHeightMm() { return heightMm; }
    public void setHeightMm(BigDecimal heightMm) { this.heightMm = heightMm; }
    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    public BigDecimal getAreaPyeong() { return areaPyeong; }
    public void setAreaPyeong(BigDecimal areaPyeong) { this.areaPyeong = areaPyeong; }
    public BigDecimal getBeforeQty() { return beforeQty; }
    public void setBeforeQty(BigDecimal beforeQty) { this.beforeQty = beforeQty; }
    public BigDecimal getAfterQty() { return afterQty; }
    public void setAfterQty(BigDecimal afterQty) { this.afterQty = afterQty; }
    public String getFromLocation() { return fromLocation; }
    public void setFromLocation(String fromLocation) { this.fromLocation = fromLocation; }
    public String getToLocation() { return toLocation; }
    public void setToLocation(String toLocation) { this.toLocation = toLocation; }
    public String getSiteCd() { return siteCd; }
    public void setSiteCd(String siteCd) { this.siteCd = siteCd; }
    public String getSiteNm() { return siteNm; }
    public void setSiteNm(String siteNm) { this.siteNm = siteNm; }
    public String getVehicleNo() { return vehicleNo; }
    public void setVehicleNo(String vehicleNo) { this.vehicleNo = vehicleNo; }
    public String getRefDocType() { return refDocType; }
    public void setRefDocType(String refDocType) { this.refDocType = refDocType; }
    public String getRefDocNo() { return refDocNo; }
    public void setRefDocNo(String refDocNo) { this.refDocNo = refDocNo; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
