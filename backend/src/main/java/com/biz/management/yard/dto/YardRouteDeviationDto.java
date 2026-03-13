package com.biz.management.yard.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
public class YardRouteDeviationDto {
    private Long id;
    private String yardCd;
    private Long vehicleId;
    private Long routeId;
    private BigDecimal deviationDist;
    private Long detectedByCctvId;
    private BigDecimal positionX;
    private BigDecimal positionZ;
    private Boolean acknowledged;
    private OffsetDateTime createdAt;
}
