package com.biz.management.site.service;

import com.biz.management.site.dto.ProductionResultCreateRequest;
import com.biz.management.site.dto.ProductionResultDto;
import com.biz.management.site.dto.ProductionResultUpdateRequest;
import com.biz.management.site.dto.ProductionSummaryDto;
import com.biz.management.site.dto.WorkOrderDto;
import com.biz.management.site.dto.WorkOrderWithResultDto;
import com.biz.management.site.mapper.ProductionResultMapper;
import com.biz.management.site.mapper.WorkOrderMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class ProductionResultService {

    private final ProductionResultMapper productionResultMapper;
    private final WorkOrderMapper workOrderMapper;

    public ProductionResultService(ProductionResultMapper productionResultMapper,
                                   WorkOrderMapper workOrderMapper) {
        this.productionResultMapper = productionResultMapper;
        this.workOrderMapper = workOrderMapper;
    }

    public List<WorkOrderWithResultDto> findWorkOrdersWithResults(String requestDate) {
        return productionResultMapper.findWorkOrdersWithResults(requestDate);
    }

    public List<ProductionResultDto> findByWorkRequestId(Long workRequestId) {
        return productionResultMapper.findByWorkRequestId(workRequestId);
    }

    public ProductionSummaryDto getDailySummary(String requestDate) {
        return productionResultMapper.getDailySummary(requestDate);
    }

    @Transactional
    public ProductionResultDto createResult(ProductionResultCreateRequest request) {
        WorkOrderDto wr = workOrderMapper.findById(request.getWorkRequestId());
        if (wr == null) {
            throw new IllegalArgumentException("Work request not found: " + request.getWorkRequestId());
        }

        ProductionResultDto dto = new ProductionResultDto();
        String baseNo = "PR-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss-SSS"));
        dto.setProductionNo(baseNo);
        dto.setProductionDate(request.getProductionDate());
        dto.setWorkRequestId(request.getWorkRequestId());
        dto.setWorkRequestNo(wr.getRequestNo());
        dto.setOrderNo(wr.getOrderNo());
        dto.setMaterialCd(wr.getMaterialNm() != null ? wr.getMaterialNm() : "UNKNOWN");
        dto.setMaterialNm(wr.getMaterialNm());
        dto.setUnit("EA");

        BigDecimal goodQty = request.getGoodQty() != null ? request.getGoodQty() : BigDecimal.ZERO;
        BigDecimal defectQty = request.getDefectQty() != null ? request.getDefectQty() : BigDecimal.ZERO;
        dto.setGoodQty(goodQty);
        dto.setDefectQty(defectQty);
        dto.setTotalQty(goodQty.add(defectQty));

        // Auto-calculate area proportionally
        if (wr.getArea() != null && wr.getQuantity() != null && wr.getQuantity() > 0) {
            BigDecimal areaPerUnit = wr.getArea().divide(BigDecimal.valueOf(wr.getQuantity()), 6, RoundingMode.HALF_UP);
            dto.setGoodArea(areaPerUnit.multiply(goodQty).setScale(3, RoundingMode.HALF_UP));
            dto.setDefectArea(areaPerUnit.multiply(defectQty).setScale(3, RoundingMode.HALF_UP));
            dto.setTotalArea(dto.getGoodArea().add(dto.getDefectArea()));
        } else {
            dto.setGoodArea(BigDecimal.ZERO);
            dto.setDefectArea(BigDecimal.ZERO);
            dto.setTotalArea(BigDecimal.ZERO);
        }

        dto.setDefectReason(request.getDefectReason());
        dto.setRemarks(request.getRemarks());

        productionResultMapper.insert(dto);
        recalculateWorkOrderStatus(request.getWorkRequestId());

        return productionResultMapper.findById(dto.getId());
    }

    @Transactional
    public ProductionResultDto fullComplete(Long workRequestId, String productionDate) {
        WorkOrderDto wr = workOrderMapper.findById(workRequestId);
        if (wr == null) {
            throw new IllegalArgumentException("Work request not found: " + workRequestId);
        }

        // Calculate remaining quantity
        Map<String, BigDecimal> sums = productionResultMapper.sumByWorkRequestId(workRequestId);
        BigDecimal existingGood = sums.get("good_qty_sum") != null ? (BigDecimal) sums.get("good_qty_sum") : BigDecimal.ZERO;
        int remaining = (wr.getQuantity() != null ? wr.getQuantity() : 0) - existingGood.intValue();
        if (remaining <= 0) {
            throw new IllegalStateException("Work request already fully completed");
        }

        ProductionResultCreateRequest req = new ProductionResultCreateRequest();
        req.setWorkRequestId(workRequestId);
        req.setProductionDate(productionDate);
        req.setGoodQty(BigDecimal.valueOf(remaining));
        req.setDefectQty(BigDecimal.ZERO);

        return createResult(req);
    }

    @Transactional
    public ProductionResultDto updateResult(Long id, ProductionResultUpdateRequest request) {
        ProductionResultDto existing = productionResultMapper.findById(id);
        if (existing == null) {
            throw new IllegalArgumentException("Production result not found: " + id);
        }

        BigDecimal goodQty = request.getGoodQty() != null ? request.getGoodQty() : existing.getGoodQty();
        BigDecimal defectQty = request.getDefectQty() != null ? request.getDefectQty() : existing.getDefectQty();

        existing.setGoodQty(goodQty);
        existing.setDefectQty(defectQty);
        existing.setTotalQty(goodQty.add(defectQty));

        // Recalculate area - find work_request by request_no
        WorkOrderDto wr = findWorkOrderByRequestNo(existing.getWorkRequestNo());
        if (wr != null && wr.getArea() != null && wr.getQuantity() != null && wr.getQuantity() > 0) {
            BigDecimal areaPerUnit = wr.getArea().divide(BigDecimal.valueOf(wr.getQuantity()), 6, RoundingMode.HALF_UP);
            existing.setGoodArea(areaPerUnit.multiply(goodQty).setScale(3, RoundingMode.HALF_UP));
            existing.setDefectArea(areaPerUnit.multiply(defectQty).setScale(3, RoundingMode.HALF_UP));
            existing.setTotalArea(existing.getGoodArea().add(existing.getDefectArea()));
        }

        existing.setDefectReason(request.getDefectReason());
        existing.setRemarks(request.getRemarks());

        productionResultMapper.update(existing);
        if (wr != null) {
            recalculateWorkOrderStatus(wr.getId());
        }

        return productionResultMapper.findById(id);
    }

    @Transactional
    public void deleteResult(Long id) {
        ProductionResultDto existing = productionResultMapper.findById(id);
        if (existing == null) {
            throw new IllegalArgumentException("Production result not found: " + id);
        }

        WorkOrderDto wr = findWorkOrderByRequestNo(existing.getWorkRequestNo());
        productionResultMapper.delete(id);
        if (wr != null) {
            recalculateWorkOrderStatus(wr.getId());
        }
    }

    private WorkOrderDto findWorkOrderByRequestNo(String workRequestNo) {
        if (workRequestNo == null) return null;
        return workOrderMapper.findByRequestNo(workRequestNo);
    }

    private void recalculateWorkOrderStatus(Long workRequestId) {
        WorkOrderDto wr = workOrderMapper.findById(workRequestId);
        if (wr == null) return;

        Map<String, BigDecimal> sums = productionResultMapper.sumByWorkRequestId(workRequestId);
        BigDecimal goodTotal = sums.get("good_qty_sum") != null ? (BigDecimal) sums.get("good_qty_sum") : BigDecimal.ZERO;
        long resultCount = sums.get("result_count") != null ? ((Number) sums.get("result_count")).longValue() : 0;

        String newStatus;
        if (resultCount == 0) {
            newStatus = "PENDING";
        } else if (wr.getQuantity() != null && goodTotal.compareTo(BigDecimal.valueOf(wr.getQuantity())) >= 0) {
            newStatus = "COMPLETED";
        } else {
            newStatus = "IN_PROGRESS";
        }

        workOrderMapper.updateApprovalStatus(workRequestId, newStatus);
    }
}
