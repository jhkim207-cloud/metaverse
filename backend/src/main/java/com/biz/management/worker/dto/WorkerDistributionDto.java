package com.biz.management.worker.dto;

import java.util.List;

/**
 * 작업자 일일 분포 응답 DTO
 */
public class WorkerDistributionDto {

    private String date;
    private List<ZoneDistribution> zones;
    private int totalWorkers;

    public WorkerDistributionDto() {}

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public List<ZoneDistribution> getZones() { return zones; }
    public void setZones(List<ZoneDistribution> zones) { this.zones = zones; }
    public int getTotalWorkers() { return totalWorkers; }
    public void setTotalWorkers(int totalWorkers) { this.totalWorkers = totalWorkers; }

    /** 구역별 작업자 분포 */
    public static class ZoneDistribution {
        private String zoneId;
        private String zoneName;
        private int workerCount;
        private List<WorkerInfo> workers;
        private double heatLevel;

        public ZoneDistribution() {}

        public String getZoneId() { return zoneId; }
        public void setZoneId(String zoneId) { this.zoneId = zoneId; }
        public String getZoneName() { return zoneName; }
        public void setZoneName(String zoneName) { this.zoneName = zoneName; }
        public int getWorkerCount() { return workerCount; }
        public void setWorkerCount(int workerCount) { this.workerCount = workerCount; }
        public List<WorkerInfo> getWorkers() { return workers; }
        public void setWorkers(List<WorkerInfo> workers) { this.workers = workers; }
        public double getHeatLevel() { return heatLevel; }
        public void setHeatLevel(double heatLevel) { this.heatLevel = heatLevel; }
    }

    /** 작업자 정보 */
    public static class WorkerInfo {
        private String name;
        private String role;
        private String dept;

        public WorkerInfo() {}

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getDept() { return dept; }
        public void setDept(String dept) { this.dept = dept; }
    }
}
