package com.biz.management.site.dto;

import java.math.BigDecimal;

public class ProductionResultUpdateRequest {

    private BigDecimal goodQty;
    private BigDecimal defectQty;
    private String defectReason;
    private String remarks;

    public ProductionResultUpdateRequest() {}

    public BigDecimal getGoodQty() { return goodQty; }
    public void setGoodQty(BigDecimal goodQty) { this.goodQty = goodQty; }

    public BigDecimal getDefectQty() { return defectQty; }
    public void setDefectQty(BigDecimal defectQty) { this.defectQty = defectQty; }

    public String getDefectReason() { return defectReason; }
    public void setDefectReason(String defectReason) { this.defectReason = defectReason; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
