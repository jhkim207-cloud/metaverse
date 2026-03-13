package com.biz.management.yard.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Data
public class YardRouteDto {
    private Long id;
    private String yardCd;
    private String routeNm;
    private Long vehicleId;
    private String status;
    private List<Waypoint> waypoints;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    @Data
    public static class Waypoint {
        private Long id;
        private Long routeId;
        private Integer seq;
        private BigDecimal positionX;
        private BigDecimal positionZ;
        private String actionType;
    }
}
