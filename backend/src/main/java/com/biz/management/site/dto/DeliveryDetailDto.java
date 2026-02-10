package com.biz.management.site.dto;

import java.math.BigDecimal;

/**
 * 출고 상세 DTO
 */
public class DeliveryDetailDto {

    private Long id;
    private String deliveryNo;
    private int lineNo;
    private String orderNo;
    private Integer orderLineNo;
    private String materialCd;
    private String materialNm;
    private String category;
    private BigDecimal thickness;
    private BigDecimal width;
    private BigDecimal height;
    private BigDecimal orderQuantity;
    private BigDecimal unshippedQuantity;
    private BigDecimal deliveryQty;
    private String unit;
    private BigDecimal area;
    private BigDecimal unitPrice;
    private BigDecimal amount;
    private BigDecimal tax;
    private BigDecimal totalAmount;
    private String remarks;

    public DeliveryDetailDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDeliveryNo() { return deliveryNo; }
    public void setDeliveryNo(String deliveryNo) { this.deliveryNo = deliveryNo; }

    public int getLineNo() { return lineNo; }
    public void setLineNo(int lineNo) { this.lineNo = lineNo; }

    public String getOrderNo() { return orderNo; }
    public void setOrderNo(String orderNo) { this.orderNo = orderNo; }

    public Integer getOrderLineNo() { return orderLineNo; }
    public void setOrderLineNo(Integer orderLineNo) { this.orderLineNo = orderLineNo; }

    public String getMaterialCd() { return materialCd; }
    public void setMaterialCd(String materialCd) { this.materialCd = materialCd; }

    public String getMaterialNm() { return materialNm; }
    public void setMaterialNm(String materialNm) { this.materialNm = materialNm; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public BigDecimal getThickness() { return thickness; }
    public void setThickness(BigDecimal thickness) { this.thickness = thickness; }

    public BigDecimal getWidth() { return width; }
    public void setWidth(BigDecimal width) { this.width = width; }

    public BigDecimal getHeight() { return height; }
    public void setHeight(BigDecimal height) { this.height = height; }

    public BigDecimal getOrderQuantity() { return orderQuantity; }
    public void setOrderQuantity(BigDecimal orderQuantity) { this.orderQuantity = orderQuantity; }

    public BigDecimal getUnshippedQuantity() { return unshippedQuantity; }
    public void setUnshippedQuantity(BigDecimal unshippedQuantity) { this.unshippedQuantity = unshippedQuantity; }

    public BigDecimal getDeliveryQty() { return deliveryQty; }
    public void setDeliveryQty(BigDecimal deliveryQty) { this.deliveryQty = deliveryQty; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public BigDecimal getArea() { return area; }
    public void setArea(BigDecimal area) { this.area = area; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public BigDecimal getTax() { return tax; }
    public void setTax(BigDecimal tax) { this.tax = tax; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
