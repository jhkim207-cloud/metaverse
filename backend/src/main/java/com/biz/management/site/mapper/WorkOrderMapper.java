package com.biz.management.site.mapper;

import com.biz.management.site.dto.WorkOrderDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface WorkOrderMapper {

    List<WorkOrderDto> findAll();

    List<WorkOrderDto> findByRequestDate(@Param("requestDate") String requestDate);

    WorkOrderDto findById(@Param("id") Long id);

    void insert(WorkOrderDto workOrder);

    List<WorkOrderDto> findByPlanId(@Param("planId") Long planId);

    void updateApprovalStatus(@Param("id") Long id, @Param("approvalStatus") String approvalStatus);

    void batchUpdateApprovalStatus(@Param("ids") List<Long> ids, @Param("approvalStatus") String approvalStatus);

    WorkOrderDto findByRequestNo(@Param("requestNo") String requestNo);
}
