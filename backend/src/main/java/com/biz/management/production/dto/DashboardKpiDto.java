package com.biz.management.production.dto;

import java.util.List;

/**
 * 생산 대시보드 KPI 통합 응답 DTO
 */
public class DashboardKpiDto {

    private List<KpiItem> dailyProduction;
    private List<DonutItem> defectRate;
    private List<DonutItem> lossRate;
    private List<KpiItem> stageProgress;
    private List<KpiItem> weeklyTrend;
    private List<DonutItem> containerStatus;

    public DashboardKpiDto() {}

    public List<KpiItem> getDailyProduction() { return dailyProduction; }
    public void setDailyProduction(List<KpiItem> dailyProduction) { this.dailyProduction = dailyProduction; }

    public List<DonutItem> getDefectRate() { return defectRate; }
    public void setDefectRate(List<DonutItem> defectRate) { this.defectRate = defectRate; }

    public List<DonutItem> getLossRate() { return lossRate; }
    public void setLossRate(List<DonutItem> lossRate) { this.lossRate = lossRate; }

    public List<KpiItem> getStageProgress() { return stageProgress; }
    public void setStageProgress(List<KpiItem> stageProgress) { this.stageProgress = stageProgress; }

    public List<KpiItem> getWeeklyTrend() { return weeklyTrend; }
    public void setWeeklyTrend(List<KpiItem> weeklyTrend) { this.weeklyTrend = weeklyTrend; }

    public List<DonutItem> getContainerStatus() { return containerStatus; }
    public void setContainerStatus(List<DonutItem> containerStatus) { this.containerStatus = containerStatus; }

    /** 막대 차트용 KPI 항목 */
    public static class KpiItem {
        private String label;
        private int value;
        private Integer maxValue;
        private String color;

        public KpiItem() {}

        public KpiItem(String label, int value, String color) {
            this.label = label;
            this.value = value;
            this.color = color;
        }

        public KpiItem(String label, int value, Integer maxValue, String color) {
            this.label = label;
            this.value = value;
            this.maxValue = maxValue;
            this.color = color;
        }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        public int getValue() { return value; }
        public void setValue(int value) { this.value = value; }
        public Integer getMaxValue() { return maxValue; }
        public void setMaxValue(Integer maxValue) { this.maxValue = maxValue; }
        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
    }

    /** 도넛 차트용 세그먼트 항목 */
    public static class DonutItem {
        private String label;
        private int value;
        private String color;

        public DonutItem() {}

        public DonutItem(String label, int value, String color) {
            this.label = label;
            this.value = value;
            this.color = color;
        }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        public int getValue() { return value; }
        public void setValue(int value) { this.value = value; }
        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
    }
}
