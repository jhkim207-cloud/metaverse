package com.biz.management.site.service;

import com.biz.management.site.dto.PlanCreateRequest;
import com.biz.management.site.dto.ProductionPlanDto;
import com.biz.management.site.dto.SalesOrderDetailDto;
import com.biz.management.site.mapper.ProductionPlanMapper;
import com.biz.management.site.mapper.SalesOrderDetailMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductionPlanService {

    private final ProductionPlanMapper productionPlanMapper;
    private final SalesOrderDetailMapper salesOrderDetailMapper;
    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public ProductionPlanService(ProductionPlanMapper productionPlanMapper,
                                 SalesOrderDetailMapper salesOrderDetailMapper) {
        this.productionPlanMapper = productionPlanMapper;
        this.salesOrderDetailMapper = salesOrderDetailMapper;
    }

    public List<ProductionPlanDto> findByWeek(String weekStartDate) {
        LocalDate start = LocalDate.parse(weekStartDate, FMT);
        LocalDate monday = start.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        // 4-week range: previous Monday ~ next-next Saturday
        LocalDate prevMonday = monday.minusWeeks(1);
        LocalDate nextSaturday = monday.plusWeeks(2).plusDays(5);
        return productionPlanMapper.findByDateRange(prevMonday.format(FMT), nextSaturday.format(FMT));
    }

    public List<ProductionPlanDto> findBySiteNm(String siteNm) {
        return productionPlanMapper.findBySiteNm(siteNm);
    }

    public void assignSchedule(Long id, String startDate, String endDate, String machineNo) {
        productionPlanMapper.updateSchedule(id, startDate, endDate, machineNo);
    }

    public ProductionPlanDto createPlan(ProductionPlanDto plan) {
        productionPlanMapper.insert(plan);
        return plan;
    }

    @Transactional
    public ProductionPlanDto createPlanWithDetails(PlanCreateRequest request) {
        // 1. Retrieve selected detail rows and compute totals
        List<Long> detailIds = request.getDetails().stream()
                .map(PlanCreateRequest.DetailAssignment::getDetailId)
                .collect(Collectors.toList());

        List<SalesOrderDetailDto> details = salesOrderDetailMapper.findByIds(detailIds);

        int totalQty = 0;
        BigDecimal totalArea = BigDecimal.ZERO;
        for (SalesOrderDetailDto d : details) {
            if (d.getQuantity() != null) totalQty += d.getQuantity();
            if (d.getArea() != null) totalArea = totalArea.add(d.getArea());
        }

        // 2. Build and insert production_plan
        ProductionPlanDto plan = new ProductionPlanDto();
        String planNo = "PP-" + java.time.LocalDateTime.now()
                .format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));
        plan.setPlanNo(planNo);
        plan.setStartDate(request.getStartDate());
        plan.setEndDate(request.getEndDate());
        plan.setPlannedStartDate(request.getStartDate());
        plan.setPlannedEndDate(request.getEndDate());
        plan.setMachineNo(request.getMachineNo());
        plan.setCategory(request.getCategory());
        plan.setCustomerNm(request.getCustomerNm());
        plan.setSiteNm(request.getSiteNm());
        plan.setSiteCd(request.getSiteCd());
        plan.setRemarks(request.getRemarks());
        plan.setWorkRequestNo(request.getWorkRequestNo());
        plan.setQuantity(totalQty);
        plan.setArea(totalArea);
        plan.setPlanStatus("REGISTERED");

        productionPlanMapper.insert(plan);

        // 3. Insert junction records (production_plan_order_detail)
        for (PlanCreateRequest.DetailAssignment da : request.getDetails()) {
            int assignedQty = da.getAssignedQuantity() != null ? da.getAssignedQuantity() : 0;
            if (assignedQty == 0) {
                // Default: use full quantity from detail
                for (SalesOrderDetailDto d : details) {
                    if (d.getId().equals(da.getDetailId())) {
                        assignedQty = d.getQuantity() != null ? d.getQuantity() : 0;
                        break;
                    }
                }
            }
            productionPlanMapper.insertPlanOrderDetail(plan.getId(), da.getDetailId(), assignedQty);
        }

        // 4. Insert production_plan_detail (copy from sales_order_detail)
        for (SalesOrderDetailDto d : details) {
            productionPlanMapper.insertPlanDetail(
                    plan.getId(), d.getId(), d.getOrderNo(), d.getLineSeq(),
                    d.getMaterialCd(), d.getMaterialNm(), d.getProductCategory(),
                    d.getWidth(), d.getHeight(), d.getThickness(), d.getUnitType(),
                    d.getQuantity(), d.getArea(), d.getUnit(), d.getUnitPrice(), d.getAmount(),
                    d.getDong(), d.getHo(), d.getFloor(), d.getWindowType(), d.getLocationDetail(),
                    d.getDeliveryDate(), d.getRemarks()
            );
        }

        // 5. Update sales_order_detail production_status → 'SCHEDULED'
        for (Long detailId : detailIds) {
            salesOrderDetailMapper.updateProductionStatus(detailId, "SCHEDULED");
        }

        return plan;
    }
}
