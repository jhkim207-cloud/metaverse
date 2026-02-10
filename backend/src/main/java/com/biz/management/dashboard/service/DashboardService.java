package com.biz.management.dashboard.service;

import com.biz.management.dashboard.dto.DashboardDto.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * 대시보드 서비스 (MVP: Mock 데이터)
 */
@Service
public class DashboardService {

    // ── 생산 업무흐름 ──

    public WorkflowResponse getProductionFlow(Period period) {
        List<WorkflowStep> steps = new ArrayList<>();
        switch (period) {
            case DAILY:
                steps.add(new WorkflowStep("수주", 5, "5", "건", "2,400만원", ""));
                steps.add(new WorkflowStep("작업지시", 3, "3", "건", "480장", ""));
                steps.add(new WorkflowStep("생산계획", 8, "8", "건", "320장", ""));
                steps.add(new WorkflowStep("생산실적", 267, "267", "장", "98.5%", "양품률"));
                steps.add(new WorkflowStep("출고실적", 2, "2", "건", "출고중 1", ""));
                steps.add(new WorkflowStep("재고현황", 89, "89", "건", "120평", ""));
                break;
            case WEEKLY:
                steps.add(new WorkflowStep("수주", 25, "25", "건", "1.2억원", ""));
                steps.add(new WorkflowStep("작업지시", 18, "18", "건", "1,920장", ""));
                steps.add(new WorkflowStep("생산계획", 48, "48", "건", "1,920장", ""));
                steps.add(new WorkflowStep("생산실적", 1680, "1,680", "장", "97.8%", "양품률"));
                steps.add(new WorkflowStep("출고실적", 15, "15", "건", "출고중 3", ""));
                steps.add(new WorkflowStep("재고현황", 89, "89", "건", "120평", ""));
                break;
            case MONTHLY:
                steps.add(new WorkflowStep("수주", 82, "82", "건", "4.8억원", ""));
                steps.add(new WorkflowStep("작업지시", 65, "65", "건", "6,400장", ""));
                steps.add(new WorkflowStep("생산계획", 155, "155", "건", "6,400장", ""));
                steps.add(new WorkflowStep("생산실적", 5280, "5,280", "장", "98.2%", "양품률"));
                steps.add(new WorkflowStep("출고실적", 48, "48", "건", "출고중 5", ""));
                steps.add(new WorkflowStep("재고현황", 89, "89", "건", "120평", ""));
                break;
        }
        return new WorkflowResponse(period.name().toLowerCase(), steps);
    }

    // ── 원자재 업무흐름 ──

    public WorkflowResponse getMaterialFlow(Period period) {
        List<WorkflowStep> steps = new ArrayList<>();
        switch (period) {
            case DAILY:
                steps.add(new WorkflowStep("원자재 발주", 2, "2", "건", "850만원", ""));
                steps.add(new WorkflowStep("입고확인", 1, "1", "건", "합격 100%", ""));
                steps.add(new WorkflowStep("재고현황", 45, "45", "종", "320평", ""));
                break;
            case WEEKLY:
                steps.add(new WorkflowStep("원자재 발주", 12, "12", "건", "2,500만원", ""));
                steps.add(new WorkflowStep("입고확인", 8, "8", "건", "합격 95%", ""));
                steps.add(new WorkflowStep("재고현황", 45, "45", "종", "320평", ""));
                break;
            case MONTHLY:
                steps.add(new WorkflowStep("원자재 발주", 38, "38", "건", "8,200만원", ""));
                steps.add(new WorkflowStep("입고확인", 30, "30", "건", "합격 96%", ""));
                steps.add(new WorkflowStep("재고현황", 45, "45", "종", "320평", ""));
                break;
        }
        return new WorkflowResponse(period.name().toLowerCase(), steps);
    }

    // ── 운영 현황 ──

    public OperationsResponse getOperations(Period period) {
        List<OperationCard> cards = new ArrayList<>();
        switch (period) {
            case DAILY:
                cards.add(new OperationCard("외주발주현황", "3", "건", "1,200만원", ""));
                cards.add(new OperationCard("미출고현황", "89", "건", "120평", ""));
                cards.add(new OperationCard("인원현황", "24", "명", "4개 영역", ""));
                cards.add(new OperationCard("재단일보", "3.2", "%", "15평 로스", ""));
                cards.add(new OperationCard("호기별현황", "80%", "", "1호기 80% / 2호기 65%", ""));
                break;
            case WEEKLY:
                cards.add(new OperationCard("외주발주현황", "8", "건", "3,200만원", ""));
                cards.add(new OperationCard("미출고현황", "89", "건", "120평", ""));
                cards.add(new OperationCard("인원현황", "23", "명", "평균 인원", ""));
                cards.add(new OperationCard("재단일보", "2.8", "%", "평균 로스율", ""));
                cards.add(new OperationCard("호기별현황", "75%", "", "1호기 78% / 2호기 62%", ""));
                break;
            case MONTHLY:
                cards.add(new OperationCard("외주발주현황", "15", "건", "8,200만원", ""));
                cards.add(new OperationCard("미출고현황", "89", "건", "120평", ""));
                cards.add(new OperationCard("인원현황", "22", "명", "평균 인원", ""));
                cards.add(new OperationCard("재단일보", "3.0", "%", "평균 로스율", ""));
                cards.add(new OperationCard("호기별현황", "72%", "", "1호기 75% / 2호기 60%", ""));
                break;
        }
        return new OperationsResponse(period.name().toLowerCase(), cards);
    }

    // ── 현장별 현황 ──

    public SiteSummaryResponse getSiteSummary(Period period) {
        List<SiteSummaryRow> rows = new ArrayList<>();

        SiteSummaryRow r1 = new SiteSummaryRow();
        r1.setSiteNm("힐스테이트 위버필드");
        SiteSummaryRow r2 = new SiteSummaryRow();
        r2.setSiteNm("래미안 원베일리");
        SiteSummaryRow r3 = new SiteSummaryRow();
        r3.setSiteNm("디에이치 라클라스");
        SiteSummaryRow r4 = new SiteSummaryRow();
        r4.setSiteNm("자이 르네시떼");
        SiteSummaryRow r5 = new SiteSummaryRow();
        r5.setSiteNm("아크로 리버파크");

        switch (period) {
            case DAILY:
                fillSite(r1, 1, bd("1200"), 3, 80, 75, bd("93.8"), 1, 40, 0, bd("0"), bd("980"), 1);
                fillSite(r2, 2, bd("2400"), 4, 120, 110, bd("91.7"), 1, 50, 1, bd("3.5"), bd("1500"), 1);
                fillSite(r3, 0, bd("0"), 2, 60, 55, bd("91.7"), 0, 0, 1, bd("2.8"), bd("0"), 0);
                fillSite(r4, 1, bd("800"), 1, 30, 28, bd("93.3"), 0, 0, 0, bd("0"), bd("650"), 1);
                fillSite(r5, 1, bd("1500"), 2, 50, 48, bd("96.0"), 1, 30, 0, bd("0"), bd("1200"), 1);
                break;
            case WEEKLY:
                fillSite(r1, 5, bd("6000"), 12, 280, 265, bd("94.6"), 3, 180, 2, bd("8.5"), bd("4800"), 4);
                fillSite(r2, 8, bd("9600"), 18, 420, 395, bd("94.0"), 5, 250, 4, bd("15.2"), bd("8200"), 7);
                fillSite(r3, 3, bd("3600"), 8, 150, 140, bd("93.3"), 2, 90, 1, bd("5.0"), bd("3200"), 3);
                fillSite(r4, 4, bd("4800"), 6, 140, 130, bd("92.9"), 2, 80, 2, bd("7.5"), bd("3800"), 3);
                fillSite(r5, 5, bd("7500"), 10, 200, 190, bd("95.0"), 3, 120, 1, bd("4.0"), bd("6500"), 5);
                break;
            case MONTHLY:
                fillSite(r1, 18, bd("22000"), 42, 980, 920, bd("93.9"), 12, 650, 5, bd("25.0"), bd("18500"), 15);
                fillSite(r2, 25, bd("35000"), 58, 1350, 1280, bd("94.8"), 18, 850, 8, bd("42.0"), bd("28000"), 22);
                fillSite(r3, 12, bd("14400"), 28, 520, 490, bd("94.2"), 8, 320, 3, bd("15.5"), bd("12800"), 10);
                fillSite(r4, 15, bd("18000"), 22, 480, 450, bd("93.8"), 6, 280, 4, bd("20.0"), bd("15200"), 12);
                fillSite(r5, 12, bd("18000"), 35, 650, 620, bd("95.4"), 10, 400, 2, bd("12.0"), bd("16000"), 10);
                break;
        }

        rows.add(r1); rows.add(r2); rows.add(r3); rows.add(r4); rows.add(r5);
        return new SiteSummaryResponse(period.name().toLowerCase(), rows);
    }

    private void fillSite(SiteSummaryRow row, int oc, BigDecimal oa, int pc, int pq,
                           int rgq, BigDecimal rgr, int dc, int dq, int penC, BigDecimal penA,
                           BigDecimal sa, int sc) {
        row.setOrderCount(oc); row.setOrderAmount(oa);
        row.setPlanCount(pc); row.setPlanQty(pq);
        row.setResultGoodQty(rgq); row.setResultGoodRate(rgr);
        row.setDeliveryCount(dc); row.setDeliveryQty(dq);
        row.setPendingCount(penC); row.setPendingArea(penA);
        row.setSalesAmount(sa); row.setSalesCount(sc);
    }

    private BigDecimal bd(String val) {
        return new BigDecimal(val);
    }
}
