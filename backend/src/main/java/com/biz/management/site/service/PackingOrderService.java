package com.biz.management.site.service;

import com.biz.management.site.dto.PackingOrderDto;
import com.biz.management.site.mapper.PackingOrderMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PackingOrderService {

    private final PackingOrderMapper packingOrderMapper;

    public PackingOrderService(PackingOrderMapper packingOrderMapper) {
        this.packingOrderMapper = packingOrderMapper;
    }

    public List<PackingOrderDto> findAll() {
        return packingOrderMapper.findAll();
    }
}
