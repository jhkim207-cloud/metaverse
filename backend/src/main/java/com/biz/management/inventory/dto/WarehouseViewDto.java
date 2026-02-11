package com.biz.management.inventory.dto;

import java.util.List;

/**
 * 창고 3D 뷰 응답 DTO
 */
public class WarehouseViewDto {

    private List<ZoneDto> zones;
    private int totalItems;
    private int alertCount;

    public WarehouseViewDto() {}

    public List<ZoneDto> getZones() { return zones; }
    public void setZones(List<ZoneDto> zones) { this.zones = zones; }
    public int getTotalItems() { return totalItems; }
    public void setTotalItems(int totalItems) { this.totalItems = totalItems; }
    public int getAlertCount() { return alertCount; }
    public void setAlertCount(int alertCount) { this.alertCount = alertCount; }

    /** 창고 구역 */
    public static class ZoneDto {
        private String id;
        private String name;
        private double[] position;
        private double[] size;
        private List<ItemDto> items;
        private double occupancyRate;

        public ZoneDto() {}

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public double[] getPosition() { return position; }
        public void setPosition(double[] position) { this.position = position; }
        public double[] getSize() { return size; }
        public void setSize(double[] size) { this.size = size; }
        public List<ItemDto> getItems() { return items; }
        public void setItems(List<ItemDto> items) { this.items = items; }
        public double getOccupancyRate() { return occupancyRate; }
        public void setOccupancyRate(double occupancyRate) { this.occupancyRate = occupancyRate; }
    }

    /** 재고 아이템 */
    public static class ItemDto {
        private String materialCd;
        private String materialNm;
        private String materialType;
        private int currentQty;
        private int maxQty;
        private int minQty;
        private String unit;
        private String color;

        public ItemDto() {}

        public String getMaterialCd() { return materialCd; }
        public void setMaterialCd(String materialCd) { this.materialCd = materialCd; }
        public String getMaterialNm() { return materialNm; }
        public void setMaterialNm(String materialNm) { this.materialNm = materialNm; }
        public String getMaterialType() { return materialType; }
        public void setMaterialType(String materialType) { this.materialType = materialType; }
        public int getCurrentQty() { return currentQty; }
        public void setCurrentQty(int currentQty) { this.currentQty = currentQty; }
        public int getMaxQty() { return maxQty; }
        public void setMaxQty(int maxQty) { this.maxQty = maxQty; }
        public int getMinQty() { return minQty; }
        public void setMinQty(int minQty) { this.minQty = minQty; }
        public String getUnit() { return unit; }
        public void setUnit(String unit) { this.unit = unit; }
        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
    }
}
