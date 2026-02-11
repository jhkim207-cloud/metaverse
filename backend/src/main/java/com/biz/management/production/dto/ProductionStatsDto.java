package com.biz.management.production.dto;

/**
 * 생산 통계 집계 결과 DTO (Mapper 결과 매핑용)
 */
public class ProductionStatsDto {

    private String machineNo;
    private int goodQty;
    private int defectQty;
    private int totalQty;
    private double goodArea;
    private double defectArea;
    private double totalArea;

    public ProductionStatsDto() {}

    public String getMachineNo() { return machineNo; }
    public void setMachineNo(String machineNo) { this.machineNo = machineNo; }
    public int getGoodQty() { return goodQty; }
    public void setGoodQty(int goodQty) { this.goodQty = goodQty; }
    public int getDefectQty() { return defectQty; }
    public void setDefectQty(int defectQty) { this.defectQty = defectQty; }
    public int getTotalQty() { return totalQty; }
    public void setTotalQty(int totalQty) { this.totalQty = totalQty; }
    public double getGoodArea() { return goodArea; }
    public void setGoodArea(double goodArea) { this.goodArea = goodArea; }
    public double getDefectArea() { return defectArea; }
    public void setDefectArea(double defectArea) { this.defectArea = defectArea; }
    public double getTotalArea() { return totalArea; }
    public void setTotalArea(double totalArea) { this.totalArea = totalArea; }
}
