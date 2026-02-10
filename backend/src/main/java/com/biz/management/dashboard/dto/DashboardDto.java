package com.biz.management.dashboard.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardDto {

    /** 기간 구분 */
    public enum Period {
        DAILY, WEEKLY, MONTHLY;

        public static Period from(String value) {
            if (value == null) return DAILY;
            try { return Period.valueOf(value.toUpperCase()); }
            catch (IllegalArgumentException e) { return DAILY; }
        }
    }

    /** 업무흐름 단계 하나 */
    public static class WorkflowStep {
        private String label;
        private int count;
        private String mainValue;
        private String mainUnit;
        private String subValue;
        private String subUnit;

        public WorkflowStep() {}
        public WorkflowStep(String label, int count, String mainValue, String mainUnit,
                            String subValue, String subUnit) {
            this.label = label; this.count = count;
            this.mainValue = mainValue; this.mainUnit = mainUnit;
            this.subValue = subValue; this.subUnit = subUnit;
        }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        public int getCount() { return count; }
        public void setCount(int count) { this.count = count; }
        public String getMainValue() { return mainValue; }
        public void setMainValue(String mainValue) { this.mainValue = mainValue; }
        public String getMainUnit() { return mainUnit; }
        public void setMainUnit(String mainUnit) { this.mainUnit = mainUnit; }
        public String getSubValue() { return subValue; }
        public void setSubValue(String subValue) { this.subValue = subValue; }
        public String getSubUnit() { return subUnit; }
        public void setSubUnit(String subUnit) { this.subUnit = subUnit; }
    }

    /** 업무흐름 응답 (생산/원자재 공통) */
    public static class WorkflowResponse {
        private String period;
        private List<WorkflowStep> steps;

        public WorkflowResponse() {}
        public WorkflowResponse(String period, List<WorkflowStep> steps) {
            this.period = period; this.steps = steps;
        }

        public String getPeriod() { return period; }
        public void setPeriod(String period) { this.period = period; }
        public List<WorkflowStep> getSteps() { return steps; }
        public void setSteps(List<WorkflowStep> steps) { this.steps = steps; }
    }

    /** 운영 현황 카드 하나 */
    public static class OperationCard {
        private String label;
        private String mainValue;
        private String mainUnit;
        private String subValue;
        private String subUnit;

        public OperationCard() {}
        public OperationCard(String label, String mainValue, String mainUnit,
                             String subValue, String subUnit) {
            this.label = label;
            this.mainValue = mainValue; this.mainUnit = mainUnit;
            this.subValue = subValue; this.subUnit = subUnit;
        }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        public String getMainValue() { return mainValue; }
        public void setMainValue(String mainValue) { this.mainValue = mainValue; }
        public String getMainUnit() { return mainUnit; }
        public void setMainUnit(String mainUnit) { this.mainUnit = mainUnit; }
        public String getSubValue() { return subValue; }
        public void setSubValue(String subValue) { this.subValue = subValue; }
        public String getSubUnit() { return subUnit; }
        public void setSubUnit(String subUnit) { this.subUnit = subUnit; }
    }

    /** 운영 현황 응답 */
    public static class OperationsResponse {
        private String period;
        private List<OperationCard> cards;

        public OperationsResponse() {}
        public OperationsResponse(String period, List<OperationCard> cards) {
            this.period = period; this.cards = cards;
        }

        public String getPeriod() { return period; }
        public void setPeriod(String period) { this.period = period; }
        public List<OperationCard> getCards() { return cards; }
        public void setCards(List<OperationCard> cards) { this.cards = cards; }
    }

    /** 현장별 현황 행 */
    public static class SiteSummaryRow {
        private String siteNm;
        private int orderCount;
        private BigDecimal orderAmount;
        private int planCount;
        private int planQty;
        private int resultGoodQty;
        private BigDecimal resultGoodRate;
        private int deliveryCount;
        private int deliveryQty;
        private int pendingCount;
        private BigDecimal pendingArea;
        private BigDecimal salesAmount;
        private int salesCount;

        public SiteSummaryRow() {}

        public String getSiteNm() { return siteNm; }
        public void setSiteNm(String siteNm) { this.siteNm = siteNm; }
        public int getOrderCount() { return orderCount; }
        public void setOrderCount(int orderCount) { this.orderCount = orderCount; }
        public BigDecimal getOrderAmount() { return orderAmount; }
        public void setOrderAmount(BigDecimal orderAmount) { this.orderAmount = orderAmount; }
        public int getPlanCount() { return planCount; }
        public void setPlanCount(int planCount) { this.planCount = planCount; }
        public int getPlanQty() { return planQty; }
        public void setPlanQty(int planQty) { this.planQty = planQty; }
        public int getResultGoodQty() { return resultGoodQty; }
        public void setResultGoodQty(int resultGoodQty) { this.resultGoodQty = resultGoodQty; }
        public BigDecimal getResultGoodRate() { return resultGoodRate; }
        public void setResultGoodRate(BigDecimal resultGoodRate) { this.resultGoodRate = resultGoodRate; }
        public int getDeliveryCount() { return deliveryCount; }
        public void setDeliveryCount(int deliveryCount) { this.deliveryCount = deliveryCount; }
        public int getDeliveryQty() { return deliveryQty; }
        public void setDeliveryQty(int deliveryQty) { this.deliveryQty = deliveryQty; }
        public int getPendingCount() { return pendingCount; }
        public void setPendingCount(int pendingCount) { this.pendingCount = pendingCount; }
        public BigDecimal getPendingArea() { return pendingArea; }
        public void setPendingArea(BigDecimal pendingArea) { this.pendingArea = pendingArea; }
        public BigDecimal getSalesAmount() { return salesAmount; }
        public void setSalesAmount(BigDecimal salesAmount) { this.salesAmount = salesAmount; }
        public int getSalesCount() { return salesCount; }
        public void setSalesCount(int salesCount) { this.salesCount = salesCount; }
    }

    /** 현장별 현황 응답 */
    public static class SiteSummaryResponse {
        private String period;
        private List<SiteSummaryRow> rows;

        public SiteSummaryResponse() {}
        public SiteSummaryResponse(String period, List<SiteSummaryRow> rows) {
            this.period = period; this.rows = rows;
        }

        public String getPeriod() { return period; }
        public void setPeriod(String period) { this.period = period; }
        public List<SiteSummaryRow> getRows() { return rows; }
        public void setRows(List<SiteSummaryRow> rows) { this.rows = rows; }
    }
}
