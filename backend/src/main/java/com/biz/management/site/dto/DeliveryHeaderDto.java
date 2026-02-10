package com.biz.management.site.dto;

import java.math.BigDecimal;

/**
 * 출고 헤더 DTO
 */
public class DeliveryHeaderDto {

    private Long id;
    private String deliveryNo;
    private String deliveryDate;
    private String actualDate;
    private String orderNo;
    private String customerCd;
    private String siteCd;
    private String transactionType;
    private String specialNotes;
    private String deliveryAddress;
    private String vehicleNo;
    private String driverNm;
    private String driverPhone;
    private String shippingCompany;
    private BigDecimal shippingCost;
    private BigDecimal shippingTax;
    private String deliveryStatus;
    private String remarks;
    private int detailCount;
    private BigDecimal totalAmount;

    public DeliveryHeaderDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDeliveryNo() { return deliveryNo; }
    public void setDeliveryNo(String deliveryNo) { this.deliveryNo = deliveryNo; }

    public String getDeliveryDate() { return deliveryDate; }
    public void setDeliveryDate(String deliveryDate) { this.deliveryDate = deliveryDate; }

    public String getActualDate() { return actualDate; }
    public void setActualDate(String actualDate) { this.actualDate = actualDate; }

    public String getOrderNo() { return orderNo; }
    public void setOrderNo(String orderNo) { this.orderNo = orderNo; }

    public String getCustomerCd() { return customerCd; }
    public void setCustomerCd(String customerCd) { this.customerCd = customerCd; }

    public String getSiteCd() { return siteCd; }
    public void setSiteCd(String siteCd) { this.siteCd = siteCd; }

    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }

    public String getSpecialNotes() { return specialNotes; }
    public void setSpecialNotes(String specialNotes) { this.specialNotes = specialNotes; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public String getVehicleNo() { return vehicleNo; }
    public void setVehicleNo(String vehicleNo) { this.vehicleNo = vehicleNo; }

    public String getDriverNm() { return driverNm; }
    public void setDriverNm(String driverNm) { this.driverNm = driverNm; }

    public String getDriverPhone() { return driverPhone; }
    public void setDriverPhone(String driverPhone) { this.driverPhone = driverPhone; }

    public String getShippingCompany() { return shippingCompany; }
    public void setShippingCompany(String shippingCompany) { this.shippingCompany = shippingCompany; }

    public BigDecimal getShippingCost() { return shippingCost; }
    public void setShippingCost(BigDecimal shippingCost) { this.shippingCost = shippingCost; }

    public BigDecimal getShippingTax() { return shippingTax; }
    public void setShippingTax(BigDecimal shippingTax) { this.shippingTax = shippingTax; }

    public String getDeliveryStatus() { return deliveryStatus; }
    public void setDeliveryStatus(String deliveryStatus) { this.deliveryStatus = deliveryStatus; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public int getDetailCount() { return detailCount; }
    public void setDetailCount(int detailCount) { this.detailCount = detailCount; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
}
