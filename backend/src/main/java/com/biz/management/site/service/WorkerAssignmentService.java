package com.biz.management.site.service;

import com.biz.management.site.dto.WorkerDailyAssignmentDto;
import com.biz.management.site.dto.WorkerAssignmentTypeDto;
import com.biz.management.site.mapper.WorkerDailyAssignmentMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkerAssignmentService {

    private final WorkerDailyAssignmentMapper workerDailyAssignmentMapper;

    public WorkerAssignmentService(WorkerDailyAssignmentMapper workerDailyAssignmentMapper) {
        this.workerDailyAssignmentMapper = workerDailyAssignmentMapper;
    }

    public List<WorkerDailyAssignmentDto> findByWorkDate(String workDate) {
        return workerDailyAssignmentMapper.findByWorkDate(workDate);
    }

    public List<WorkerAssignmentTypeDto> findAllAssignmentTypes() {
        return workerDailyAssignmentMapper.findAllAssignmentTypes();
    }

    public List<String> findAvailableDates() {
        return workerDailyAssignmentMapper.findAvailableDates();
    }
}
