package com.biz.management.worker.service;

import com.biz.management.worker.dto.WorkerDistributionDto;
import com.biz.management.worker.dto.WorkerDistributionDto.WorkerInfo;
import com.biz.management.worker.dto.WorkerDistributionDto.ZoneDistribution;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * 작업자 일일 배치 분포 서비스
 *
 * 현재는 샘플 데이터 생성. 실제 worker_daily_assignment, worker 테이블 연동 시
 * Mapper를 통해 조회하도록 전환.
 */
@Service
public class WorkerDistributionService {

    public WorkerDistributionDto getDailyDistribution(String date) {
        if (date == null || date.isEmpty()) {
            date = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
        }
        // TODO: 실제 DB에서 worker_daily_assignment + worker 조인 데이터 조회
        return generateSampleData(date);
    }

    private WorkerDistributionDto generateSampleData(String date) {
        WorkerDistributionDto dto = new WorkerDistributionDto();
        dto.setDate(date);

        List<ZoneDistribution> zones = new ArrayList<>();

        zones.add(createZone("MULTI_LINE1", "복층 1호기", 8,
                new String[][]{
                        {"김진수", "라인장", "생산1팀"},
                        {"박영호", "조장", "생산1팀"},
                        {"이성민", "작업자", "생산1팀"},
                        {"최동준", "작업자", "생산1팀"},
                        {"정우진", "작업자", "생산1팀"},
                        {"한승우", "작업자", "생산1팀"},
                        {"오재현", "작업자", "생산1팀"},
                        {"장세영", "보조", "생산1팀"},
                }));

        zones.add(createZone("MULTI_LINE2", "복층 2호기", 7,
                new String[][]{
                        {"임태호", "라인장", "생산2팀"},
                        {"윤대혁", "조장", "생산2팀"},
                        {"서민재", "작업자", "생산2팀"},
                        {"강현우", "작업자", "생산2팀"},
                        {"조민서", "작업자", "생산2팀"},
                        {"백승한", "작업자", "생산2팀"},
                        {"신동현", "보조", "생산2팀"},
                }));

        zones.add(createZone("CUTTING_TEMPER", "재단/강화 라인", 5,
                new String[][]{
                        {"류재혁", "라인장", "재단팀"},
                        {"문성호", "작업자", "재단팀"},
                        {"양준혁", "작업자", "재단팀"},
                        {"권태민", "작업자", "강화팀"},
                        {"송지훈", "작업자", "강화팀"},
                }));

        zones.add(createZone("RAW_WAREHOUSE", "원판유리 창고", 2,
                new String[][]{
                        {"황석진", "창고담당", "물류팀"},
                        {"노민혁", "보조", "물류팀"},
                }));

        zones.add(createZone("PACKING_AREA", "포장 구역", 4,
                new String[][]{
                        {"배진우", "포장장", "물류팀"},
                        {"전성훈", "작업자", "물류팀"},
                        {"유태건", "작업자", "물류팀"},
                        {"안정민", "보조", "물류팀"},
                }));

        zones.add(createZone("SHIPPING_AREA", "출고 구역", 1,
                new String[][]{
                        {"고승범", "출고담당", "물류팀"},
                }));

        dto.setZones(zones);
        dto.setTotalWorkers(zones.stream().mapToInt(ZoneDistribution::getWorkerCount).sum());

        return dto;
    }

    private ZoneDistribution createZone(String zoneId, String zoneName, int count, String[][] workerData) {
        ZoneDistribution zone = new ZoneDistribution();
        zone.setZoneId(zoneId);
        zone.setZoneName(zoneName);
        zone.setWorkerCount(count);

        // 최대 인원 기준으로 히트 레벨 계산 (0~1)
        int maxWorkers = 10;
        zone.setHeatLevel(Math.min(1.0, (double) count / maxWorkers));

        List<WorkerInfo> workers = new ArrayList<>();
        for (String[] wd : workerData) {
            WorkerInfo wi = new WorkerInfo();
            wi.setName(wd[0]);
            wi.setRole(wd[1]);
            wi.setDept(wd[2]);
            workers.add(wi);
        }
        zone.setWorkers(workers);

        return zone;
    }
}
