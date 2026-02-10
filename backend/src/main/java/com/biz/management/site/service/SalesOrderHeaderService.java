package com.biz.management.site.service;

import com.biz.management.site.dto.SalesOrderCreateRequest;
import com.biz.management.site.dto.SalesOrderHeaderDto;
import com.biz.management.site.mapper.SalesOrderDetailMapper;
import com.biz.management.site.mapper.SalesOrderHeaderMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SalesOrderHeaderService {

    private final SalesOrderHeaderMapper salesOrderHeaderMapper;
    private final SalesOrderDetailMapper salesOrderDetailMapper;

    public SalesOrderHeaderService(SalesOrderHeaderMapper salesOrderHeaderMapper,
                                    SalesOrderDetailMapper salesOrderDetailMapper) {
        this.salesOrderHeaderMapper = salesOrderHeaderMapper;
        this.salesOrderDetailMapper = salesOrderDetailMapper;
    }

    public List<SalesOrderHeaderDto> findAll() {
        return salesOrderHeaderMapper.findAll();
    }

    public List<SalesOrderHeaderDto> findBySiteNm(String siteNm) {
        return salesOrderHeaderMapper.findBySiteNm(siteNm);
    }

    public String nextOrderNo() {
        return salesOrderHeaderMapper.nextOrderNo();
    }

    @Transactional
    public SalesOrderHeaderDto create(SalesOrderCreateRequest request) {
        String orderNo = salesOrderHeaderMapper.nextOrderNo();
        salesOrderHeaderMapper.insert(request, orderNo);
        // useGeneratedKeys로 request.id에 자동 세팅됨
        Long headerId = request.getId();

        if (request.getDetails() != null && !request.getDetails().isEmpty()) {
            salesOrderDetailMapper.insertBatch(headerId, orderNo, request.getDetails());
            salesOrderHeaderMapper.updateTotalAmount(headerId);
        }

        return salesOrderHeaderMapper.findById(headerId);
    }

    @Transactional
    public SalesOrderHeaderDto update(Long id, SalesOrderCreateRequest request) {
        SalesOrderHeaderDto existing = salesOrderHeaderMapper.findById(id);
        if (existing == null) {
            throw new IllegalArgumentException("주문을 찾을 수 없습니다: " + id);
        }

        salesOrderHeaderMapper.update(id, request);

        // 디테일: 전체 삭제 후 재등록
        salesOrderDetailMapper.deleteByHeaderId(id);
        if (request.getDetails() != null && !request.getDetails().isEmpty()) {
            salesOrderDetailMapper.insertBatch(id, existing.getOrderNo(), request.getDetails());
        }
        salesOrderHeaderMapper.updateTotalAmount(id);

        return salesOrderHeaderMapper.findById(id);
    }

    @Transactional
    public void delete(Long id) {
        salesOrderDetailMapper.deleteByHeaderId(id);
        salesOrderHeaderMapper.delete(id);
    }
}
