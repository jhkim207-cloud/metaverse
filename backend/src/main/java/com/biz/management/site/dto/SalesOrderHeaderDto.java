package com.biz.management.site.dto;

import java.math.BigDecimal;

/**
 * 주문 헤더 DTO
 */
public class SalesOrderHeaderDto {

    private Long id;
    private String orderNo;
    private String orderDate;
    private String deliveryDate;
    private String customerCd;
    private String orderType;
    private String siteCd;
    private String siteNm;
    private String siteAddress;
    private BigDecimal totalAmount;
    private BigDecimal taxAmount;
    private Boolean taxSeparate;
    private String duoLight;
    private String remarks;
    private String orderStatus;
    private Boolean isUrgent;

    // 조인 필드: 거래처명
    private String customerNm;

    // 서브쿼리: 디테일 건수
    private Integer detailCount;

    public SalesOrderHeaderDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrderNo() { return orderNo; }
    public void setOrderNo(String orderNo) { this.orderNo = orderNo; }

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

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }

    public Boolean getTaxSeparate() { return taxSeparate; }
    public void setTaxSeparate(Boolean taxSeparate) { this.taxSeparate = taxSeparate; }

    public String getDuoLight() { return duoLight; }
    public void setDuoLight(String duoLight) { this.duoLight = duoLight; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public String getOrderStatus() { return orderStatus; }
    public void setOrderStatus(String orderStatus) { this.orderStatus = orderStatus; }

    public Boolean getIsUrgent() { return isUrgent; }
    public void setIsUrgent(Boolean isUrgent) { this.isUrgent = isUrgent; }

    public String getCustomerNm() { return customerNm; }
    public void setCustomerNm(String customerNm) { this.customerNm = customerNm; }

    public Integer getDetailCount() { return detailCount; }
    public void setDetailCount(Integer detailCount) { this.detailCount = detailCount; }
}
