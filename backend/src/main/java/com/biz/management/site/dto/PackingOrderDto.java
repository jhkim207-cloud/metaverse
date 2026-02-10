package com.biz.management.site.dto;

import java.math.BigDecimal;

/**
 * 포장지시 DTO
 */
public class PackingOrderDto {

    private Long id;
    private String packingNo;
    private String packingDate;
    private String orderNo;
    private String materialCd;
    private String materialNm;
    private BigDecimal packingQty;
    private String unit;
    private String containerCd;
    private Integer containerQty;
    private String workerCd;
    private String packingStatus;
    private String remarks;

    public PackingOrderDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPackingNo() { return packingNo; }
    public void setPackingNo(String packingNo) { this.packingNo = packingNo; }

    public String getPackingDate() { return packingDate; }
    public void setPackingDate(String packingDate) { this.packingDate = packingDate; }

    public String getOrderNo() { return orderNo; }
    public void setOrderNo(String orderNo) { this.orderNo = orderNo; }

    public String getMaterialCd() { return materialCd; }
    public void setMaterialCd(String materialCd) { this.materialCd = materialCd; }

    public String getMaterialNm() { return materialNm; }
    public void setMaterialNm(String materialNm) { this.materialNm = materialNm; }

    public BigDecimal getPackingQty() { return packingQty; }
    public void setPackingQty(BigDecimal packingQty) { this.packingQty = packingQty; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public String getContainerCd() { return containerCd; }
    public void setContainerCd(String containerCd) { this.containerCd = containerCd; }

    public Integer getContainerQty() { return containerQty; }
    public void setContainerQty(Integer containerQty) { this.containerQty = containerQty; }

    public String getWorkerCd() { return workerCd; }
    public void setWorkerCd(String workerCd) { this.workerCd = workerCd; }

    public String getPackingStatus() { return packingStatus; }
    public void setPackingStatus(String packingStatus) { this.packingStatus = packingStatus; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
