package com.biz.management.site.service;

import com.biz.management.site.dto.SitePriceDto;
import com.biz.management.site.mapper.SitePriceMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SitePriceService {

    private final SitePriceMapper sitePriceMapper;

    public SitePriceService(SitePriceMapper sitePriceMapper) {
        this.sitePriceMapper = sitePriceMapper;
    }

    public List<SitePriceDto> findBySiteCd(String siteCd) {
        return sitePriceMapper.findBySiteCd(siteCd);
    }

    public void create(SitePriceDto dto) {
        sitePriceMapper.insert(dto);
    }

    public void update(Long id, SitePriceDto dto) {
        sitePriceMapper.update(id, dto);
    }

    public void delete(Long id) {
        sitePriceMapper.delete(id);
    }
}
