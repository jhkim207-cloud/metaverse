package com.biz.management.yard.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
public class YardItemDto {
    private Long id;
    private String yardCd;
    private String itemNm;
    private String itemType;
    private BigDecimal widthVal;
    private BigDecimal lengthVal;
    private BigDecimal positionX;
    private BigDecimal positionZ;
    private BigDecimal rotationY;
    private String color;
    private String status;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
