package com.biz.management.cutting.dto;

import java.util.List;

/**
 * 재단 일별 배치도 응답 DTO
 */
public class CuttingDailyLayoutDto {

    private String date;
    private List<SheetDto> sheets;
    private double totalLossRate;
    private int totalSheetCount;

    public CuttingDailyLayoutDto() {}

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public List<SheetDto> getSheets() { return sheets; }
    public void setSheets(List<SheetDto> sheets) { this.sheets = sheets; }
    public double getTotalLossRate() { return totalLossRate; }
    public void setTotalLossRate(double totalLossRate) { this.totalLossRate = totalLossRate; }
    public int getTotalSheetCount() { return totalSheetCount; }
    public void setTotalSheetCount(int totalSheetCount) { this.totalSheetCount = totalSheetCount; }

    /** 원판 1장 */
    public static class SheetDto {
        private String sheetId;
        private String rawMaterialCd;
        private double rawWidth;
        private double rawHeight;
        private List<PartDto> parts;
        private double usedArea;
        private double lossArea;
        private double lossRate;

        public SheetDto() {}

        public String getSheetId() { return sheetId; }
        public void setSheetId(String sheetId) { this.sheetId = sheetId; }
        public String getRawMaterialCd() { return rawMaterialCd; }
        public void setRawMaterialCd(String rawMaterialCd) { this.rawMaterialCd = rawMaterialCd; }
        public double getRawWidth() { return rawWidth; }
        public void setRawWidth(double rawWidth) { this.rawWidth = rawWidth; }
        public double getRawHeight() { return rawHeight; }
        public void setRawHeight(double rawHeight) { this.rawHeight = rawHeight; }
        public List<PartDto> getParts() { return parts; }
        public void setParts(List<PartDto> parts) { this.parts = parts; }
        public double getUsedArea() { return usedArea; }
        public void setUsedArea(double usedArea) { this.usedArea = usedArea; }
        public double getLossArea() { return lossArea; }
        public void setLossArea(double lossArea) { this.lossArea = lossArea; }
        public double getLossRate() { return lossRate; }
        public void setLossRate(double lossRate) { this.lossRate = lossRate; }
    }

    /** 절단 파트 1개 */
    public static class PartDto {
        private String id;
        private double x;
        private double y;
        private double width;
        private double height;
        private String orderId;
        private String customerNm;
        private int sequence;
        private String color;

        public PartDto() {}

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public double getX() { return x; }
        public void setX(double x) { this.x = x; }
        public double getY() { return y; }
        public void setY(double y) { this.y = y; }
        public double getWidth() { return width; }
        public void setWidth(double width) { this.width = width; }
        public double getHeight() { return height; }
        public void setHeight(double height) { this.height = height; }
        public String getOrderId() { return orderId; }
        public void setOrderId(String orderId) { this.orderId = orderId; }
        public String getCustomerNm() { return customerNm; }
        public void setCustomerNm(String customerNm) { this.customerNm = customerNm; }
        public int getSequence() { return sequence; }
        public void setSequence(int sequence) { this.sequence = sequence; }
        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
    }
}
