package com.biz.management.yard.dto;

import lombok.Data;
import java.time.OffsetDateTime;

@Data
public class YardMasterDto {
    private Long id;
    private String yardCd;
    private String yardNm;
    private Integer rowsCount;
    private Integer columnsCount;
    private Integer sectorCount;
    private Integer spaceWidth;
    private Integer spaceLength;
    private Integer spacing;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
