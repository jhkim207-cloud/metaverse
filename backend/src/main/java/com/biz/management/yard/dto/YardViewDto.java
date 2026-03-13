package com.biz.management.yard.dto;

import lombok.Data;
import java.util.List;

/**
 * 야적장 전체 뷰 응답 DTO
 */
@Data
public class YardViewDto {
    private YardMasterDto master;
    private List<YardItemDto> items;
    private List<YardCctvDto> cctvs;
    private List<YardVehicleDto> vehicles;
    private List<YardRouteDto> routes;
}
