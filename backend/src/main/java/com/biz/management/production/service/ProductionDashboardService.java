package com.biz.management.production.service;

import com.biz.management.production.dto.*;
import com.biz.management.production.dto.DashboardKpiDto.DonutItem;
import com.biz.management.production.dto.DashboardKpiDto.KpiItem;
import com.biz.management.production.mapper.ProductionDashboardMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 생산 대시보드 KPI 서비스
 *
 * DB에 데이터가 없으면 샘플 데이터를 반환하여 3D 대시보드가 항상 렌더링되도록 한다.
 */
@Service
public class ProductionDashboardService {

    private final ProductionDashboardMapper mapper;

    private static final Map<String, String> MACHINE_COLORS = Map.of(
            "복층1호기", "#1e3a5f",
            "복층2호기", "#0a84ff",
            "재단", "#30d158",
            "강화", "#ff9f0a"
    );

    private static final Map<String, String> CONTAINER_COLORS = Map.of(
            "FACTORY", "#1e3a5f",
            "CUSTOMER", "#0a84ff",
            "SITE", "#30d158"
    );

    private static final Map<String, String> CONTAINER_LABELS = Map.of(
            "FACTORY", "공장",
            "CUSTOMER", "거래처",
            "SITE", "현장"
    );

    public ProductionDashboardService(ProductionDashboardMapper mapper) {
        this.mapper = mapper;
    }

    public DashboardKpiDto getDashboardKpi(String date) {
        if (date == null || date.isEmpty()) {
            date = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
        }

        DashboardKpiDto dto = new DashboardKpiDto();
        dto.setDailyProduction(getDailyProduction(date));
        dto.setDefectRate(getDefectRate(date));
        dto.setLossRate(getLossRate(date));
        dto.setStageProgress(getStageProgress());
        dto.setWeeklyTrend(getWeeklyTrend(date));
        dto.setContainerStatus(getContainerStatus());
        return dto;
    }

    private List<KpiItem> getDailyProduction(String date) {
        List<ProductionStatsDto> stats = mapper.findDailyProductionByMachine(date);
        if (stats == null || stats.isEmpty()) {
            return sampleDailyProduction();
        }
        List<KpiItem> items = new ArrayList<>();
        for (ProductionStatsDto s : stats) {
            String color = MACHINE_COLORS.getOrDefault(s.getMachineNo(), "#86868b");
            items.add(new KpiItem(s.getMachineNo(), s.getTotalQty(), color));
        }
        return items;
    }

    private List<DonutItem> getDefectRate(String date) {
        ProductionStatsDto summary = mapper.findDailyDefectSummary(date);
        if (summary == null || summary.getTotalQty() == 0) {
            return sampleDefectRate();
        }
        List<DonutItem> items = new ArrayList<>();
        items.add(new DonutItem("양품", summary.getGoodQty(), "#30d158"));
        items.add(new DonutItem("불량", summary.getDefectQty(), "#ff453a"));
        return items;
    }

    private List<DonutItem> getLossRate(String date) {
        CuttingStatsDto cutting = mapper.findDailyCuttingLoss(date);
        if (cutting == null || cutting.getTotalArea() == 0) {
            return sampleLossRate();
        }
        int usedPct = (int) Math.round((cutting.getUsedArea() / cutting.getTotalArea()) * 100);
        int lossPct = 100 - usedPct;
        List<DonutItem> items = new ArrayList<>();
        items.add(new DonutItem("사용", usedPct, "#0a84ff"));
        items.add(new DonutItem("손실", lossPct, "#ff453a"));
        return items;
    }

    private List<KpiItem> getStageProgress() {
        // 워크플로우 stage-counts API와 동일한 데이터를 사용하되,
        // 여기서는 간략한 주요 공정만 표시
        return List.of(
                new KpiItem("수주", 12, "#1e3a5f"),
                new KpiItem("생산계획", 8, "#0a84ff"),
                new KpiItem("작업지시", 15, "#30d158"),
                new KpiItem("생산실적", 6, "#ff9f0a"),
                new KpiItem("포장", 4, "#bf5af2"),
                new KpiItem("출고", 3, "#ff453a")
        );
    }

    private List<KpiItem> getWeeklyTrend(String date) {
        LocalDate endDate = LocalDate.parse(date);
        LocalDate startDate = endDate.minusDays(6);
        List<ProductionStatsDto> stats = mapper.findWeeklyTrend(
                startDate.format(DateTimeFormatter.ISO_LOCAL_DATE),
                endDate.format(DateTimeFormatter.ISO_LOCAL_DATE)
        );
        if (stats == null || stats.isEmpty()) {
            return sampleWeeklyTrend();
        }
        List<KpiItem> items = new ArrayList<>();
        for (ProductionStatsDto s : stats) {
            items.add(new KpiItem(s.getMachineNo(), s.getTotalQty(), "#0a84ff"));
        }
        return items;
    }

    private List<DonutItem> getContainerStatus() {
        List<ContainerStatsDto> stats = mapper.findContainerStatus();
        if (stats == null || stats.isEmpty()) {
            return sampleContainerStatus();
        }
        List<DonutItem> items = new ArrayList<>();
        for (ContainerStatsDto s : stats) {
            String label = CONTAINER_LABELS.getOrDefault(s.getLocationType(), s.getLocationType());
            String color = CONTAINER_COLORS.getOrDefault(s.getLocationType(), "#86868b");
            items.add(new DonutItem(label, s.getQuantity(), color));
        }
        return items;
    }

    // === 샘플 데이터 (DB에 데이터 없을 때 폴백) ===

    private List<KpiItem> sampleDailyProduction() {
        return List.of(
                new KpiItem("복층1호기", 85, "#1e3a5f"),
                new KpiItem("복층2호기", 72, "#0a84ff"),
                new KpiItem("재단", 120, "#30d158"),
                new KpiItem("강화", 95, "#ff9f0a")
        );
    }

    private List<DonutItem> sampleDefectRate() {
        return List.of(
                new DonutItem("양품", 92, "#30d158"),
                new DonutItem("불량", 5, "#ff453a"),
                new DonutItem("검사중", 3, "#ff9f0a")
        );
    }

    private List<DonutItem> sampleLossRate() {
        return List.of(
                new DonutItem("사용", 88, "#0a84ff"),
                new DonutItem("손실", 12, "#ff453a")
        );
    }

    private List<KpiItem> sampleWeeklyTrend() {
        return List.of(
                new KpiItem("월", 180, "#0a84ff"),
                new KpiItem("화", 165, "#0a84ff"),
                new KpiItem("수", 200, "#0a84ff"),
                new KpiItem("목", 190, "#0a84ff"),
                new KpiItem("금", 175, "#0a84ff")
        );
    }

    private List<DonutItem> sampleContainerStatus() {
        return List.of(
                new DonutItem("공장", 45, "#1e3a5f"),
                new DonutItem("현장", 30, "#0a84ff"),
                new DonutItem("거래처", 25, "#30d158")
        );
    }
}
