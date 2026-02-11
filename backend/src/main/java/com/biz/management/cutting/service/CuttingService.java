package com.biz.management.cutting.service;

import com.biz.management.cutting.dto.CuttingDailyLayoutDto;
import com.biz.management.cutting.dto.CuttingDailyLayoutDto.PartDto;
import com.biz.management.cutting.dto.CuttingDailyLayoutDto.SheetDto;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * 재단 배치도 서비스
 *
 * 현재는 샘플 데이터 생성. 실제 cutting_daily_report 테이블 연동 시
 * Mapper를 통해 조회하도록 전환.
 */
@Service
public class CuttingService {

    private static final String[] PART_COLORS = {
            "#1e3a5f", "#0a84ff", "#30d158", "#ff9f0a",
            "#bf5af2", "#ff453a", "#5ac8fa", "#ffd60a"
    };

    private static final String[] CUSTOMERS = {
            "대림건설", "삼성물산", "현대건설", "포스코건설", "GS건설"
    };

    public CuttingDailyLayoutDto getDailyLayout(String date) {
        if (date == null || date.isEmpty()) {
            date = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
        }

        // TODO: 실제 DB에서 cutting_daily_report + work_request 조인 데이터 조회
        // 현재는 시각화 검증을 위한 샘플 데이터
        return generateSampleLayout(date);
    }

    private CuttingDailyLayoutDto generateSampleLayout(String date) {
        Random rand = new Random(date.hashCode());
        CuttingDailyLayoutDto dto = new CuttingDailyLayoutDto();
        dto.setDate(date);

        List<SheetDto> sheets = new ArrayList<>();
        int sheetCount = 3 + rand.nextInt(3); // 3~5장

        double totalUsed = 0;
        double totalLoss = 0;

        for (int s = 0; s < sheetCount; s++) {
            SheetDto sheet = new SheetDto();
            sheet.setSheetId("S-" + (s + 1));
            sheet.setRawMaterialCd("FL-" + (5 + rand.nextInt(3)) + "T");
            sheet.setRawWidth(3210);
            sheet.setRawHeight(2440);

            List<PartDto> parts = generateParts(sheet.getRawWidth(), sheet.getRawHeight(), rand, s);
            sheet.setParts(parts);

            double usedArea = parts.stream()
                    .mapToDouble(p -> p.getWidth() * p.getHeight())
                    .sum();
            double totalArea = sheet.getRawWidth() * sheet.getRawHeight();
            double lossArea = totalArea - usedArea;

            sheet.setUsedArea(Math.round(usedArea));
            sheet.setLossArea(Math.round(lossArea));
            sheet.setLossRate(Math.round(lossArea / totalArea * 1000.0) / 10.0);

            totalUsed += usedArea;
            totalLoss += lossArea;

            sheets.add(sheet);
        }

        dto.setSheets(sheets);
        dto.setTotalSheetCount(sheetCount);
        dto.setTotalLossRate(Math.round(totalLoss / (totalUsed + totalLoss) * 1000.0) / 10.0);

        return dto;
    }

    /** 원판 내에 겹치지 않는 파트들을 생성 (간단한 Strip Packing) */
    private List<PartDto> generateParts(double sheetW, double sheetH, Random rand, int sheetIdx) {
        List<PartDto> parts = new ArrayList<>();
        double curX = 0;
        double curY = 0;
        double rowMaxH = 0;
        int seq = 1;

        int maxParts = 6 + rand.nextInt(6); // 6~11개 파트

        for (int i = 0; i < maxParts; i++) {
            double pw = 300 + rand.nextInt(800);  // 300~1100mm
            double ph = 200 + rand.nextInt(600);  // 200~800mm

            // 현재 행에 들어가는지 확인
            if (curX + pw > sheetW) {
                curX = 0;
                curY += rowMaxH + 10; // 10mm 간격
                rowMaxH = 0;
            }

            // 시트 높이 초과 체크
            if (curY + ph > sheetH) break;

            PartDto part = new PartDto();
            part.setId("P-" + sheetIdx + "-" + seq);
            part.setX(curX);
            part.setY(curY);
            part.setWidth(pw);
            part.setHeight(ph);
            part.setOrderId("SO-2026-" + (100 + rand.nextInt(50)));
            part.setCustomerNm(CUSTOMERS[rand.nextInt(CUSTOMERS.length)]);
            part.setSequence(seq);
            part.setColor(PART_COLORS[(sheetIdx * 3 + i) % PART_COLORS.length]);

            parts.add(part);

            curX += pw + 10; // 10mm 간격
            rowMaxH = Math.max(rowMaxH, ph);
            seq++;
        }

        return parts;
    }
}
