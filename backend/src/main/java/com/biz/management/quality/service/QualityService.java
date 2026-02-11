package com.biz.management.quality.service;

import com.biz.management.quality.dto.QualityDashboardDto;
import com.biz.management.quality.dto.QualityDashboardDto.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * 품질 SPC 서비스
 *
 * 현재는 샘플 데이터 생성. 실제 production_result, cutting_daily_report 테이블 연동 시
 * Mapper를 통해 조회하도록 전환.
 */
@Service
public class QualityService {

    public QualityDashboardDto getDashboard(String period) {
        int days = parsePeriod(period);
        // TODO: 실제 DB에서 production_result + cutting_daily_report 조회
        return generateSampleData(days);
    }

    private int parsePeriod(String period) {
        if (period == null || period.isEmpty()) return 30;
        if (period.endsWith("d")) {
            try {
                return Integer.parseInt(period.replace("d", ""));
            } catch (NumberFormatException e) {
                return 30;
            }
        }
        return 30;
    }

    private QualityDashboardDto generateSampleData(int days) {
        QualityDashboardDto dto = new QualityDashboardDto();
        Random rand = new Random(42);

        // SPC 차트 - 재단 로스율 추이
        SpcChartDto spc = new SpcChartDto();
        spc.setMetric("재단 로스율 (%)");

        double cl = 8.0;   // 중심선 8%
        double ucl = 12.0;  // 상한 12%
        double lcl = 4.0;   // 하한 4%
        spc.setControlLimits(new ControlLimits(ucl, cl, lcl));

        List<SpcPoint> measurements = new ArrayList<>();
        int outOfControl = 0;
        LocalDate baseDate = LocalDate.now().minusDays(days);

        for (int i = 0; i < days; i++) {
            SpcPoint pt = new SpcPoint();
            pt.setDate(baseDate.plusDays(i).format(DateTimeFormatter.ISO_LOCAL_DATE));

            // 정규분포에 가까운 데이터 + 간헐적 이상치
            double val = cl + rand.nextGaussian() * 1.8;
            if (rand.nextInt(15) == 0) {
                val = ucl + rand.nextDouble() * 3; // 이상치
            }
            val = Math.round(val * 10.0) / 10.0;
            pt.setValue(val);

            boolean ooc = val > ucl || val < lcl;
            pt.setOutOfControl(ooc);
            if (ooc) outOfControl++;

            measurements.add(pt);
        }

        spc.setMeasurements(measurements);
        spc.setOutOfControlCount(outOfControl);
        dto.setSpcChart(spc);

        // 불량 유형별 분석
        List<DefectItem> byReason = new ArrayList<>();
        byReason.add(createDefect("깨짐", 12, "#ff453a"));
        byReason.add(createDefect("스크래치", 8, "#ff9f0a"));
        byReason.add(createDefect("치수불량", 5, "#ffd60a"));
        byReason.add(createDefect("실란트불량", 3, "#bf5af2"));
        byReason.add(createDefect("기포", 2, "#5ac8fa"));
        dto.setDefectByReason(byReason);

        // 공정별 불량 분석
        List<DefectItem> byProcess = new ArrayList<>();
        byProcess.add(createDefect("재단", 15, "#0a84ff"));
        byProcess.add(createDefect("강화", 6, "#30d158"));
        byProcess.add(createDefect("복층조립", 4, "#bf5af2"));
        byProcess.add(createDefect("포장", 2, "#ff9f0a"));
        dto.setDefectByProcess(byProcess);

        // 일별 불량률 (최근 7일)
        List<DailyDefectRate> dailyRates = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            DailyDefectRate dr = new DailyDefectRate();
            dr.setDate(LocalDate.now().minusDays(i).format(DateTimeFormatter.ISO_LOCAL_DATE));
            dr.setRate(Math.round((1.5 + rand.nextDouble() * 3) * 10.0) / 10.0);
            dailyRates.add(dr);
        }
        dto.setDailyDefectRate(dailyRates);

        return dto;
    }

    private DefectItem createDefect(String reason, int count, String color) {
        DefectItem item = new DefectItem();
        item.setReason(reason);
        item.setCount(count);
        item.setColor(color);
        return item;
    }
}
