package com.biz.management.yard.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
public class YardCctvDto {
    private Long id;
    private String yardCd;
    private String cctvNm;
    private BigDecimal positionX;
    private BigDecimal positionZ;
    private String direction;
    private Boolean alarmStatus;
    private BigDecimal coverageRadius;
    private BigDecimal coverageAngle;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
