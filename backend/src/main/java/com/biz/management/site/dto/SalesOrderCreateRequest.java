package com.biz.management.site.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * 주문 등록/수정 요청 DTO (헤더 + 디테일 일괄)
 */
public class SalesOrderCreateRequest {

    // useGeneratedKeys로 INSERT 후 자동 세팅
    private Long id;

    // 헤더 정보
    private String orderDate;
    private String deliveryDate;
    private String customerCd;
    private String orderType;
    private String siteCd;
    private String siteNm;
    private String siteAddress;
    private Boolean taxSeparate;
    private String duoLight;
    private String remarks;
    private Boolean isUrgent;

    // 디테일 목록
    private List<DetailItem> details;

    public SalesOrderCreateRequest() {}

    // Getters / Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrderDate() { return orderDate; }
    public void setOrderDate(String orderDate) { this.orderDate = orderDate; }

    public String getDeliveryDate() { return deliveryDate; }
    public void setDeliveryDate(String deliveryDate) { this.deliveryDate = deliveryDate; }

    public String getCustomerCd() { return customerCd; }
    public void setCustomerCd(String customerCd) { this.customerCd = customerCd; }

    public String getOrderType() { return orderType; }
    public void setOrderType(String orderType) { this.orderType = orderType; }

    public String getSiteCd() { return siteCd; }
    public void setSiteCd(String siteCd) { this.siteCd = siteCd; }

    public String getSiteNm() { return siteNm; }
    public void setSiteNm(String siteNm) { this.siteNm = siteNm; }

    public String getSiteAddress() { return siteAddress; }
    public void setSiteAddress(String siteAddress) { this.siteAddress = siteAddress; }

    public Boolean getTaxSeparate() { return taxSeparate; }
    public void setTaxSeparate(Boolean taxSeparate) { this.taxSeparate = taxSeparate; }

    public String getDuoLight() { return duoLight; }
    public void setDuoLight(String duoLight) { this.duoLight = duoLight; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public Boolean getIsUrgent() { return isUrgent; }
    public void setIsUrgent(Boolean isUrgent) { this.isUrgent = isUrgent; }

    public List<DetailItem> getDetails() { return details; }
    public void setDetails(List<DetailItem> details) { this.details = details; }

    /**
     * 디테일 행 항목
     */
    public static class DetailItem {
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

        public DetailItem() {}

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
}
