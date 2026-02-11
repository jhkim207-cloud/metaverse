package com.biz.management.production.mapper;

import com.biz.management.production.dto.ContainerStatsDto;
import com.biz.management.production.dto.CuttingStatsDto;
import com.biz.management.production.dto.ProductionStatsDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 생산 대시보드 KPI 조회 Mapper
 */
@Mapper
public interface ProductionDashboardMapper {

    /** 오늘의 호기별 생산 실적 */
    List<ProductionStatsDto> findDailyProductionByMachine(@Param("date") String date);

    /** 오늘의 양품/불량 집계 */
    ProductionStatsDto findDailyDefectSummary(@Param("date") String date);

    /** 오늘의 재단 로스율 */
    CuttingStatsDto findDailyCuttingLoss(@Param("date") String date);

    /** 주간 생산 추이 (최근 7일) */
    List<ProductionStatsDto> findWeeklyTrend(@Param("startDate") String startDate, @Param("endDate") String endDate);

    /** 용기 현황 (위치유형별 집계) */
    List<ContainerStatsDto> findContainerStatus();
}
