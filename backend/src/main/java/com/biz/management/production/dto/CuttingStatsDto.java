package com.biz.management.production.dto;

/**
 * 재단 통계 집계 결과 DTO (Mapper 결과 매핑용)
 */
public class CuttingStatsDto {

    private double usedArea;
    private double lossArea;
    private double totalArea;
    private double lossRate;

    public CuttingStatsDto() {}

    public double getUsedArea() { return usedArea; }
    public void setUsedArea(double usedArea) { this.usedArea = usedArea; }
    public double getLossArea() { return lossArea; }
    public void setLossArea(double lossArea) { this.lossArea = lossArea; }
    public double getTotalArea() { return totalArea; }
    public void setTotalArea(double totalArea) { this.totalArea = totalArea; }
    public double getLossRate() { return lossRate; }
    public void setLossRate(double lossRate) { this.lossRate = lossRate; }
}
