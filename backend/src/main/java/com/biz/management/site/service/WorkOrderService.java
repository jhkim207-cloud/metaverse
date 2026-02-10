package com.biz.management.site.service;

import com.biz.management.site.dto.ProductionPlanDetailDto;
import com.biz.management.site.dto.ProductionPlanDto;
import com.biz.management.site.dto.WorkOrderCreateRequest;
import com.biz.management.site.dto.WorkOrderDto;
import com.biz.management.site.mapper.ProductionPlanDetailMapper;
import com.biz.management.site.mapper.ProductionPlanMapper;
import com.biz.management.site.mapper.WorkOrderMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class WorkOrderService {

    private final ProductionPlanMapper productionPlanMapper;
    private final ProductionPlanDetailMapper productionPlanDetailMapper;
    private final WorkOrderMapper workOrderMapper;

    public WorkOrderService(ProductionPlanMapper productionPlanMapper,
                            ProductionPlanDetailMapper productionPlanDetailMapper,
                            WorkOrderMapper workOrderMapper) {
        this.productionPlanMapper = productionPlanMapper;
        this.productionPlanDetailMapper = productionPlanDetailMapper;
        this.workOrderMapper = workOrderMapper;
    }

    public List<ProductionPlanDto> findUncompletedPlans(String targetDate) {
        return productionPlanMapper.findUncompletedByTargetDate(targetDate);
    }

    public List<ProductionPlanDetailDto> findPlanDetails(Long planId) {
        return productionPlanDetailMapper.findByPlanId(planId);
    }

    public List<WorkOrderDto> findAllWorkOrders() {
        return workOrderMapper.findAll();
    }

    public List<WorkOrderDto> findWorkOrders(String requestDate) {
        return workOrderMapper.findByRequestDate(requestDate);
    }

    public List<WorkOrderDto> findWorkOrdersByPlanId(Long planId) {
        return workOrderMapper.findByPlanId(planId);
    }

    @Transactional
    public List<WorkOrderDto> createWorkOrders(WorkOrderCreateRequest request) {
        List<ProductionPlanDetailDto> details = productionPlanDetailMapper.findByIds(request.getPlanDetailIds());
        if (details.isEmpty()) {
            throw new IllegalArgumentException("No plan details found for the given IDs");
        }

        String baseNo = "WR-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));
        int seq = 0;

        for (ProductionPlanDetailDto detail : details) {
            ProductionPlanDto plan = productionPlanMapper.findById(detail.getPlanId());

            WorkOrderDto wo = new WorkOrderDto();
            wo.setRequestNo(baseNo + "-" + String.format("%03d", ++seq));
            wo.setRequestDate(request.getRequestDate());
            wo.setPlanId(detail.getPlanId());
            wo.setOrderNo(detail.getOrderNo());
            wo.setCustomerNm(plan != null ? plan.getCustomerNm() : null);
            wo.setSiteNm(plan != null ? plan.getSiteNm() : null);
            wo.setWorkCategory(plan != null ? plan.getCategory() : null);
            wo.setApprovalStatus("PENDING");
            wo.setMaterialNm(detail.getMaterialNm());
            wo.setThickness(detail.getThickness() != null ? detail.getThickness().intValue() : null);
            wo.setUnitType(detail.getUnitType());
            wo.setWidth(detail.getWidth());
            wo.setHeight(detail.getHeight());
            wo.setQuantity(detail.getQuantity());
            wo.setRequestedQuantity(detail.getQuantity());
            wo.setUnrequestedQuantity(0);
            wo.setArea(detail.getArea());
            wo.setProductCategory(detail.getProductCategory());
            wo.setRemarks(detail.getRemarks());

            workOrderMapper.insert(wo);
        }

        return workOrderMapper.findByRequestDate(request.getRequestDate());
    }
}
