package com.biz.management.workflow.service;

import com.biz.management.workflow.dto.StageCountDto;
import com.biz.management.workflow.dto.WorkflowItemDto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 워크플로우 서비스 (MVP: Mock 데이터)
 */
@Service
public class WorkflowService {

    private static final String[] STAGE_CODES = {
        "PROD_PROJECT", "PROD_SUBCONTRACT", "PROD_ORDER",
        "PROD_PLAN", "PROD_WORK_ORDER", "PROD_RESULT", "PROD_PACKAGING",
        "PROD_SHIPPING", "PROD_PURCHASE", "PROD_WORKER", "PROD_DEFECT", "PROD_INVENTORY"
    };

    private final List<WorkflowItemDto> mockItems;

    public WorkflowService() {
        this.mockItems = generateMockItems();
    }

    /**
     * 단계별 건수 조회
     */
    public List<StageCountDto> getStageCounts() {
        List<StageCountDto> counts = new ArrayList<>();
        for (String code : STAGE_CODES) {
            List<WorkflowItemDto> stageItems = mockItems.stream()
                    .filter(item -> code.equals(item.getStageCode()))
                    .collect(Collectors.toList());

            int total = stageItems.size();
            int pending = (int) stageItems.stream().filter(i -> "PENDING".equals(i.getStatus())).count();
            int inProgress = (int) stageItems.stream().filter(i -> "IN_PROGRESS".equals(i.getStatus())).count();
            int completed = (int) stageItems.stream().filter(i -> "COMPLETED".equals(i.getStatus())).count();

            counts.add(new StageCountDto(code, total, pending, inProgress, completed));
        }
        return counts;
    }

    /**
     * 단계별 업무 항목 목록
     */
    public List<WorkflowItemDto> getStageItems(String stageCode) {
        return mockItems.stream()
                .filter(item -> stageCode.equals(item.getStageCode()))
                .collect(Collectors.toList());
    }

    /**
     * 업무 항목 상세
     */
    public WorkflowItemDto getItem(Long itemId) {
        return mockItems.stream()
                .filter(item -> itemId.equals(item.getId()))
                .findFirst()
                .orElse(null);
    }

    private List<WorkflowItemDto> generateMockItems() {
        List<WorkflowItemDto> items = new ArrayList<>();
        long id = 1;

        // 프로젝트 항목
        items.add(createItem(id++, "힐스테이트 위버필드", "현대건설", "구조용 H빔", "COMPLETED", "HIGH", "2026-03-15", "PROJECT", "PROD_PROJECT", "힐스테이트 위버필드", "CONSTRUCT", null));
        items.add(createItem(id++, "래미안 원베일리 2차", "삼성물산", "철근 가공품", "IN_PROGRESS", "HIGH", "2026-04-20", "PROJECT", "PROD_PROJECT", "래미안 원베일리 2차", "DESIGN", null));
        items.add(createItem(id++, "디에이치 라클라스", "현대건설", "데크플레이트", "PENDING", "MEDIUM", "2026-06-01", "PROJECT", "PROD_PROJECT", "디에이치 라클라스", "CONTRACT", null));

        // 임가공 항목
        items.add(createItem(id++, "STS304 절단 가공", "대한철강", "스테인리스 판재", "IN_PROGRESS", "MEDIUM", "2026-02-28", "SUBCONTRACT", "PROD_SUBCONTRACT", null, null, null));
        items.add(createItem(id++, "AL6061 CNC 가공", "한국알루미늄", "알루미늄 프레임", "PENDING", "LOW", "2026-03-10", "SUBCONTRACT", "PROD_SUBCONTRACT", null, null, null));

        // 주문 항목 (siteCd로 현장 연결)
        items.add(createItem(id++, "ORD-2026-0001", "현대건설", "H빔 200x200", "COMPLETED", "HIGH", "2026-03-01", "PROJECT", "PROD_ORDER", "여의도 금융타워", null, "SITE004"));
        items.add(createItem(id++, "ORD-2026-0002", "삼성물산", "SD400 D25", "IN_PROGRESS", "HIGH", "2026-04-05", "PROJECT", "PROD_ORDER", "판교 알파돔시티", null, "SITE002"));
        items.add(createItem(id++, "ORD-2026-0003", "대한철강", "STS304 3T", "PENDING", "MEDIUM", "2026-02-20", "SUBCONTRACT", "PROD_ORDER", null, null, null));
        items.add(createItem(id++, "ORD-2026-0004", "대한건설", "철골 구조물", "IN_PROGRESS", "HIGH", "2026-03-20", "PROJECT", "PROD_ORDER", "강남 테헤란 오피스텔", null, "SITE001"));
        items.add(createItem(id++, "ORD-2026-0005", "한화건설산업", "PC빔 12M", "PENDING", "MEDIUM", "2026-04-10", "PROJECT", "PROD_ORDER", "송도 센트럴파크 A동", null, "SITE003"));

        // 생산계획
        items.add(createItem(id++, "PP-2026-0001 H빔 생산", "현대건설", "H빔 200x200 x 50본", "COMPLETED", "HIGH", "2026-02-25", "PROJECT", "PROD_PLAN", null, null, null));
        items.add(createItem(id++, "PP-2026-0002 철근 절단", "삼성물산", "SD400 D25 x 200본", "IN_PROGRESS", "HIGH", "2026-03-20", "PROJECT", "PROD_PLAN", null, null, null));
        items.add(createItem(id++, "PP-2026-0003 STS 판재", "대한철강", "STS304 3T x 30장", "PENDING", "MEDIUM", "2026-02-18", "SUBCONTRACT", "PROD_PLAN", null, null, null));

        // 작업지시
        items.add(createItem(id++, "WO-2026-0001 H빔 용접", "현대건설", "H빔 200x200", "COMPLETED", "HIGH", "2026-02-20", "PROJECT", "PROD_WORK_ORDER", null, null, null));
        items.add(createItem(id++, "WO-2026-0002 철근 절단", "삼성물산", "SD400 D25", "IN_PROGRESS", "HIGH", "2026-03-15", "PROJECT", "PROD_WORK_ORDER", null, null, null));
        items.add(createItem(id++, "WO-2026-0003 STS CNC", "대한철강", "STS304", "BLOCKED", "MEDIUM", "2026-02-15", "SUBCONTRACT", "PROD_WORK_ORDER", null, null, null));

        // 생산실적
        items.add(createItem(id++, "PR-2026-0001 H빔 50본", "현대건설", "H빔 200x200", "COMPLETED", "HIGH", "2026-02-22", "PROJECT", "PROD_RESULT", null, null, null));
        items.add(createItem(id++, "PR-2026-0002 철근 80본", "삼성물산", "SD400 D25", "IN_PROGRESS", "HIGH", "2026-03-18", "PROJECT", "PROD_RESULT", null, null, null));

        // 포장
        items.add(createItem(id++, "PK-2026-0001 H빔 포장", "현대건설", "H빔 200x200", "COMPLETED", "HIGH", "2026-02-23", "PROJECT", "PROD_PACKAGING", null, null, null));
        items.add(createItem(id++, "PK-2026-0002 철근 포장", "삼성물산", "SD400 D25", "PENDING", "HIGH", "2026-03-20", "PROJECT", "PROD_PACKAGING", null, null, null));

        // 출고
        items.add(createItem(id++, "SH-2026-0001 힐스테이트 출고", "현대건설", "H빔 200x200", "COMPLETED", "HIGH", "2026-02-25", "PROJECT", "PROD_SHIPPING", null, null, null));

        // 발주(원부자재)
        items.add(createItem(id++, "PO-2026-0001 원자재 발주", "포스코", "열연코일 SS400", "IN_PROGRESS", "HIGH", "2026-02-10", "PROJECT", "PROD_PURCHASE", null, null, null));
        items.add(createItem(id++, "PO-2026-0002 부자재 발주", "동국제강", "용접봉 E7016", "COMPLETED", "MEDIUM", "2026-02-05", "PROJECT", "PROD_PURCHASE", null, null, null));

        // 작업자 배치
        items.add(createItem(id++, "WK-2026-0001 A라인 배치", null, null, "IN_PROGRESS", "HIGH", "2026-02-20", null, "PROD_WORKER", null, null, null));
        items.add(createItem(id++, "WK-2026-0002 B라인 배치", null, null, "PENDING", "MEDIUM", "2026-03-01", null, "PROD_WORKER", null, null, null));

        // 불량
        items.add(createItem(id++, "DF-2026-0001 용접 불량", "현대건설", "H빔 200x200", "IN_PROGRESS", "HIGH", "2026-02-21", "PROJECT", "PROD_DEFECT", null, null, null));

        // 제품재고
        items.add(createItem(id++, "IV-H빔200 잔여재고", null, "H빔 200x200", "COMPLETED", "LOW", null, null, "PROD_INVENTORY", null, null, null));
        items.add(createItem(id++, "IV-SD400-D25 잔여재고", null, "SD400 D25", "COMPLETED", "LOW", null, null, "PROD_INVENTORY", null, null, null));

        return items;
    }

    private WorkflowItemDto createItem(Long id, String title, String customer, String product,
                                        String status, String priority, String dueDate,
                                        String orderType, String stageCode,
                                        String projectName, String projectPhase,
                                        String siteCd) {
        WorkflowItemDto item = new WorkflowItemDto();
        item.setId(id);
        item.setTitle(title);
        item.setCustomer(customer);
        item.setProduct(product);
        item.setStatus(status);
        item.setPriority(priority);
        item.setDueDate(dueDate);
        item.setOrderType(orderType);
        item.setStageCode(stageCode);
        item.setProjectName(projectName);
        item.setProjectPhase(projectPhase);
        item.setSiteCd(siteCd);
        return item;
    }
}
