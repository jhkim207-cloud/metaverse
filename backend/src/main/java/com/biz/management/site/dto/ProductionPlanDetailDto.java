package com.biz.management.site.dto;

import java.math.BigDecimal;

public class ProductionPlanDetailDto {

    private Long id;
    private Long planId;
    private Long orderDetailId;
    private String processStatus;
    private String orderNo;
    private Integer lineSeq;
    private String materialCd;
    private String materialNm;
    private String productCategory;
    private BigDecimal width;
    private BigDecimal height;
    private BigDecimal thickness;
    private String unitType;
    private Integer quantity;
    private BigDecimal area;
    private String unit;
    private BigDecimal unitPrice;
    private BigDecimal amount;
    private String dong;
    private String ho;
    private String floor;
    private String windowType;
    private String locationDetail;
    private String deliveryDate;
    private String remarks;

    public ProductionPlanDetailDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPlanId() { return planId; }
    public void setPlanId(Long planId) { this.planId = planId; }

    public Long getOrderDetailId() { return orderDetailId; }
    public void setOrderDetailId(Long orderDetailId) { this.orderDetailId = orderDetailId; }

    public String getProcessStatus() { return processStatus; }
    public void setProcessStatus(String processStatus) { this.processStatus = processStatus; }

    public String getOrderNo() { return orderNo; }
    public void setOrderNo(String orderNo) { this.orderNo = orderNo; }

    public Integer getLineSeq() { return lineSeq; }
    public void setLineSeq(Integer lineSeq) { this.lineSeq = lineSeq; }

    public String getMaterialCd() { return materialCd; }
    public void setMaterialCd(String materialCd) { this.materialCd = materialCd; }

    public String getMaterialNm() { return materialNm; }
    public void setMaterialNm(String materialNm) { this.materialNm = materialNm; }

    public String getProductCategory() { return productCategory; }
    public void setProductCategory(String productCategory) { this.productCategory = productCategory; }

    public BigDecimal getWidth() { return width; }
    public void setWidth(BigDecimal width) { this.width = width; }

    public BigDecimal getHeight() { return height; }
    public void setHeight(BigDecimal height) { this.height = height; }

    public BigDecimal getThickness() { return thickness; }
    public void setThickness(BigDecimal thickness) { this.thickness = thickness; }

    public String getUnitType() { return unitType; }
    public void setUnitType(String unitType) { this.unitType = unitType; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getArea() { return area; }
    public void setArea(BigDecimal area) { this.area = area; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getDong() { return dong; }
    public void setDong(String dong) { this.dong = dong; }

    public String getHo() { return ho; }
    public void setHo(String ho) { this.ho = ho; }

    public String getFloor() { return floor; }
    public void setFloor(String floor) { this.floor = floor; }

    public String getWindowType() { return windowType; }
    public void setWindowType(String windowType) { this.windowType = windowType; }

    public String getLocationDetail() { return locationDetail; }
    public void setLocationDetail(String locationDetail) { this.locationDetail = locationDetail; }

    public String getDeliveryDate() { return deliveryDate; }
    public void setDeliveryDate(String deliveryDate) { this.deliveryDate = deliveryDate; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
