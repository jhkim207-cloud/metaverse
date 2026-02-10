package com.biz.management.site.dto;

import java.math.BigDecimal;

/**
 * 현장 견적단가 DTO
 */
public class SitePriceDto {

    private Long id;
    private String siteCd;
    private String siteNm;
    private String customerNm;
    private String spec;
    private String remark;
    private BigDecimal bidPrice;
    private BigDecimal procPrice;
    private BigDecimal processingCost;
    private BigDecimal argonCost;
    private BigDecimal insulCost;
    private BigDecimal structCost;
    private BigDecimal edgeCost;
    private BigDecimal etchingCost;
    private BigDecimal stepCost;
    private BigDecimal deformCost;
    private BigDecimal temper1Cost;
    private BigDecimal temper2Cost;
    private BigDecimal temper3Cost;
    private BigDecimal totalProcessingCost;

    public SitePriceDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSiteCd() { return siteCd; }
    public void setSiteCd(String siteCd) { this.siteCd = siteCd; }

    public String getSiteNm() { return siteNm; }
    public void setSiteNm(String siteNm) { this.siteNm = siteNm; }

    public String getCustomerNm() { return customerNm; }
    public void setCustomerNm(String customerNm) { this.customerNm = customerNm; }

    public String getSpec() { return spec; }
    public void setSpec(String spec) { this.spec = spec; }

    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }

    public BigDecimal getBidPrice() { return bidPrice; }
    public void setBidPrice(BigDecimal bidPrice) { this.bidPrice = bidPrice; }

    public BigDecimal getProcPrice() { return procPrice; }
    public void setProcPrice(BigDecimal procPrice) { this.procPrice = procPrice; }

    public BigDecimal getProcessingCost() { return processingCost; }
    public void setProcessingCost(BigDecimal processingCost) { this.processingCost = processingCost; }

    public BigDecimal getArgonCost() { return argonCost; }
    public void setArgonCost(BigDecimal argonCost) { this.argonCost = argonCost; }

    public BigDecimal getInsulCost() { return insulCost; }
    public void setInsulCost(BigDecimal insulCost) { this.insulCost = insulCost; }

    public BigDecimal getStructCost() { return structCost; }
    public void setStructCost(BigDecimal structCost) { this.structCost = structCost; }

    public BigDecimal getEdgeCost() { return edgeCost; }
    public void setEdgeCost(BigDecimal edgeCost) { this.edgeCost = edgeCost; }

    public BigDecimal getEtchingCost() { return etchingCost; }
    public void setEtchingCost(BigDecimal etchingCost) { this.etchingCost = etchingCost; }

    public BigDecimal getStepCost() { return stepCost; }
    public void setStepCost(BigDecimal stepCost) { this.stepCost = stepCost; }

    public BigDecimal getDeformCost() { return deformCost; }
    public void setDeformCost(BigDecimal deformCost) { this.deformCost = deformCost; }

    public BigDecimal getTemper1Cost() { return temper1Cost; }
    public void setTemper1Cost(BigDecimal temper1Cost) { this.temper1Cost = temper1Cost; }

    public BigDecimal getTemper2Cost() { return temper2Cost; }
    public void setTemper2Cost(BigDecimal temper2Cost) { this.temper2Cost = temper2Cost; }

    public BigDecimal getTemper3Cost() { return temper3Cost; }
    public void setTemper3Cost(BigDecimal temper3Cost) { this.temper3Cost = temper3Cost; }

    public BigDecimal getTotalProcessingCost() { return totalProcessingCost; }
    public void setTotalProcessingCost(BigDecimal totalProcessingCost) { this.totalProcessingCost = totalProcessingCost; }
}
