package com.biz.management.site.service;

import com.biz.management.site.dto.SiteMasterDto;
import com.biz.management.site.dto.SiteMasterCreateRequest;
import com.biz.management.site.mapper.SiteMasterMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SiteMasterService {

    private final SiteMasterMapper siteMasterMapper;

    public SiteMasterService(SiteMasterMapper siteMasterMapper) {
        this.siteMasterMapper = siteMasterMapper;
    }

    public List<SiteMasterDto> findAll() {
        return siteMasterMapper.findAll();
    }

    public SiteMasterDto findById(Long id) {
        return siteMasterMapper.findById(id);
    }

    public void create(SiteMasterCreateRequest request) {
        if (siteMasterMapper.existsBySiteCd(request.getSiteCd())) {
            throw new IllegalArgumentException("이미 존재하는 현장코드입니다: " + request.getSiteCd());
        }
        siteMasterMapper.insert(request);
    }
}
