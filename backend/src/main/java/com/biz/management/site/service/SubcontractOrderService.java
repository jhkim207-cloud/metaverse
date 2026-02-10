package com.biz.management.site.service;

import com.biz.management.site.dto.SubcontractOrderDto;
import com.biz.management.site.mapper.SubcontractOrderMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubcontractOrderService {

    private final SubcontractOrderMapper subcontractOrderMapper;

    public SubcontractOrderService(SubcontractOrderMapper subcontractOrderMapper) {
        this.subcontractOrderMapper = subcontractOrderMapper;
    }

    public List<SubcontractOrderDto> findAll() {
        return subcontractOrderMapper.findAll();
    }
}
