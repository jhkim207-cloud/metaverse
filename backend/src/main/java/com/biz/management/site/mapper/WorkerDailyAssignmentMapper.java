package com.biz.management.site.mapper;

import com.biz.management.site.dto.WorkerDailyAssignmentDto;
import com.biz.management.site.dto.WorkerAssignmentTypeDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface WorkerDailyAssignmentMapper {

    List<WorkerDailyAssignmentDto> findByWorkDate(@Param("workDate") String workDate);

    List<WorkerAssignmentTypeDto> findAllAssignmentTypes();

    List<String> findAvailableDates();
}
