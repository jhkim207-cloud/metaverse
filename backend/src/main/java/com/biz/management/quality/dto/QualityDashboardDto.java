package com.biz.management.quality.dto;

import java.util.List;

/**
 * 품질 대시보드 응답 DTO
 */
public class QualityDashboardDto {

    private SpcChartDto spcChart;
    private List<DefectItem> defectByReason;
    private List<DefectItem> defectByProcess;
    private List<DailyDefectRate> dailyDefectRate;

    public QualityDashboardDto() {}

    public SpcChartDto getSpcChart() { return spcChart; }
    public void setSpcChart(SpcChartDto spcChart) { this.spcChart = spcChart; }
    public List<DefectItem> getDefectByReason() { return defectByReason; }
    public void setDefectByReason(List<DefectItem> defectByReason) { this.defectByReason = defectByReason; }
    public List<DefectItem> getDefectByProcess() { return defectByProcess; }
    public void setDefectByProcess(List<DefectItem> defectByProcess) { this.defectByProcess = defectByProcess; }
    public List<DailyDefectRate> getDailyDefectRate() { return dailyDefectRate; }
    public void setDailyDefectRate(List<DailyDefectRate> dailyDefectRate) { this.dailyDefectRate = dailyDefectRate; }

    /** SPC 차트 데이터 */
    public static class SpcChartDto {
        private List<SpcPoint> measurements;
        private ControlLimits controlLimits;
        private int outOfControlCount;
        private String metric;

        public SpcChartDto() {}

        public List<SpcPoint> getMeasurements() { return measurements; }
        public void setMeasurements(List<SpcPoint> measurements) { this.measurements = measurements; }
        public ControlLimits getControlLimits() { return controlLimits; }
        public void setControlLimits(ControlLimits controlLimits) { this.controlLimits = controlLimits; }
        public int getOutOfControlCount() { return outOfControlCount; }
        public void setOutOfControlCount(int outOfControlCount) { this.outOfControlCount = outOfControlCount; }
        public String getMetric() { return metric; }
        public void setMetric(String metric) { this.metric = metric; }
    }

    /** SPC 측정 포인트 */
    public static class SpcPoint {
        private String date;
        private double value;
        private boolean outOfControl;

        public SpcPoint() {}

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public double getValue() { return value; }
        public void setValue(double value) { this.value = value; }
        public boolean isOutOfControl() { return outOfControl; }
        public void setOutOfControl(boolean outOfControl) { this.outOfControl = outOfControl; }
    }

    /** SPC 관리 한계 */
    public static class ControlLimits {
        private double ucl;
        private double cl;
        private double lcl;

        public ControlLimits() {}
        public ControlLimits(double ucl, double cl, double lcl) {
            this.ucl = ucl;
            this.cl = cl;
            this.lcl = lcl;
        }

        public double getUcl() { return ucl; }
        public void setUcl(double ucl) { this.ucl = ucl; }
        public double getCl() { return cl; }
        public void setCl(double cl) { this.cl = cl; }
        public double getLcl() { return lcl; }
        public void setLcl(double lcl) { this.lcl = lcl; }
    }

    /** 불량 유형 항목 */
    public static class DefectItem {
        private String reason;
        private int count;
        private String color;

        public DefectItem() {}

        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
        public int getCount() { return count; }
        public void setCount(int count) { this.count = count; }
        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
    }

    /** 일별 불량률 */
    public static class DailyDefectRate {
        private String date;
        private double rate;

        public DailyDefectRate() {}

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public double getRate() { return rate; }
        public void setRate(double rate) { this.rate = rate; }
    }
}
