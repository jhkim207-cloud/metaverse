package com.biz.management.yard.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
public class YardVehicleDto {
    private Long id;
    private String yardCd;
    private String vehicleNm;
    private String vehicleType;
    private BigDecimal currentX;
    private BigDecimal currentZ;
    private BigDecimal heading;
    private BigDecimal speed;
    private String status;
    private Long assignedRouteId;
    private Boolean isOffRoute;
    private OffsetDateTime lastUpdated;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
