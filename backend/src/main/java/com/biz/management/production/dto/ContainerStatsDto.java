package com.biz.management.production.dto;

/**
 * 용기 현황 집계 결과 DTO (Mapper 결과 매핑용)
 */
public class ContainerStatsDto {

    private String locationType;
    private int quantity;

    public ContainerStatsDto() {}

    public String getLocationType() { return locationType; }
    public void setLocationType(String locationType) { this.locationType = locationType; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}
