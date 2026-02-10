package com.biz.management.site.service;

import com.biz.management.site.dto.SalesOrderDetailDto;
import com.biz.management.site.mapper.SalesOrderDetailMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SalesOrderDetailService {

    private final SalesOrderDetailMapper salesOrderDetailMapper;

    public SalesOrderDetailService(SalesOrderDetailMapper salesOrderDetailMapper) {
        this.salesOrderDetailMapper = salesOrderDetailMapper;
    }

    public List<SalesOrderDetailDto> findByHeaderId(Long headerId) {
        return salesOrderDetailMapper.findByHeaderId(headerId);
    }
}
