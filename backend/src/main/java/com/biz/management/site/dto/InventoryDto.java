package com.biz.management.site.dto;

import java.math.BigDecimal;

public class InventoryDto {

    private Long id;
    private String inventoryType;
    private String materialCd;
    private String materialNm;
    private BigDecimal widthMm;
    private BigDecimal heightMm;
    private BigDecimal currentQty;
    private BigDecimal availableQty;
    private BigDecimal reservedQty;
    private String unit;
    private BigDecimal areaPyeong;
    private BigDecimal minQty;
    private BigDecimal maxQty;
    private String supplierCd;
    private String supplierNm;
    private String warehouseCd;
    private String location;
    private String snapshotDate;

    public InventoryDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getInventoryType() { return inventoryType; }
    public void setInventoryType(String inventoryType) { this.inventoryType = inventoryType; }
    public String getMaterialCd() { return materialCd; }
    public void setMaterialCd(String materialCd) { this.materialCd = materialCd; }
    public String getMaterialNm() { return materialNm; }
    public void setMaterialNm(String materialNm) { this.materialNm = materialNm; }
    public BigDecimal getWidthMm() { return widthMm; }
    public void setWidthMm(BigDecimal widthMm) { this.widthMm = widthMm; }
    public BigDecimal getHeightMm() { return heightMm; }
    public void setHeightMm(BigDecimal heightMm) { this.heightMm = heightMm; }
    public BigDecimal getCurrentQty() { return currentQty; }
    public void setCurrentQty(BigDecimal currentQty) { this.currentQty = currentQty; }
    public BigDecimal getAvailableQty() { return availableQty; }
    public void setAvailableQty(BigDecimal availableQty) { this.availableQty = availableQty; }
    public BigDecimal getReservedQty() { return reservedQty; }
    public void setReservedQty(BigDecimal reservedQty) { this.reservedQty = reservedQty; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    public BigDecimal getAreaPyeong() { return areaPyeong; }
    public void setAreaPyeong(BigDecimal areaPyeong) { this.areaPyeong = areaPyeong; }
    public BigDecimal getMinQty() { return minQty; }
    public void setMinQty(BigDecimal minQty) { this.minQty = minQty; }
    public BigDecimal getMaxQty() { return maxQty; }
    public void setMaxQty(BigDecimal maxQty) { this.maxQty = maxQty; }
    public String getSupplierCd() { return supplierCd; }
    public void setSupplierCd(String supplierCd) { this.supplierCd = supplierCd; }
    public String getSupplierNm() { return supplierNm; }
    public void setSupplierNm(String supplierNm) { this.supplierNm = supplierNm; }
    public String getWarehouseCd() { return warehouseCd; }
    public void setWarehouseCd(String warehouseCd) { this.warehouseCd = warehouseCd; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getSnapshotDate() { return snapshotDate; }
    public void setSnapshotDate(String snapshotDate) { this.snapshotDate = snapshotDate; }
}
