package com.biz.management.site.service;

import com.biz.management.site.dto.DeliveryDetailDto;
import com.biz.management.site.dto.DeliveryHeaderDto;
import com.biz.management.site.mapper.DeliveryDetailMapper;
import com.biz.management.site.mapper.DeliveryHeaderMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeliveryService {

    private final DeliveryHeaderMapper headerMapper;
    private final DeliveryDetailMapper detailMapper;

    public DeliveryService(DeliveryHeaderMapper headerMapper, DeliveryDetailMapper detailMapper) {
        this.headerMapper = headerMapper;
        this.detailMapper = detailMapper;
    }

    public List<DeliveryHeaderDto> findAll() {
        return headerMapper.findAll();
    }

    public List<DeliveryHeaderDto> search(String status, String keyword, String dateFrom, String dateTo) {
        return headerMapper.search(status, keyword, dateFrom, dateTo);
    }

    public List<DeliveryDetailDto> findDetailsByDeliveryNo(String deliveryNo) {
        return detailMapper.findByDeliveryNo(deliveryNo);
    }
}
