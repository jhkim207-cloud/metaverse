package com.biz.management.site.service;

import com.biz.management.site.dto.SiteMasterDto;
import com.biz.management.site.dto.SiteMasterCreateRequest;
import com.biz.management.site.mapper.SiteMasterMapper;
import com.biz.management.site.mapper.SitePriceMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SiteMasterService {

    private final SiteMasterMapper siteMasterMapper;
    private final SitePriceMapper sitePriceMapper;

    public SiteMasterService(SiteMasterMapper siteMasterMapper, SitePriceMapper sitePriceMapper) {
        this.siteMasterMapper = siteMasterMapper;
        this.sitePriceMapper = sitePriceMapper;
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

    public void update(Long id, SiteMasterCreateRequest request) {
        SiteMasterDto existing = siteMasterMapper.findById(id);
        if (existing == null) {
            throw new IllegalArgumentException("현장을 찾을 수 없습니다: " + id);
        }
        if (siteMasterMapper.existsBySiteCdExcludeId(request.getSiteCd(), id)) {
            throw new IllegalArgumentException("이미 존재하는 현장코드입니다: " + request.getSiteCd());
        }
        siteMasterMapper.update(id, request);

        // site_price 의 customer_cd, customer_nm 도 함께 갱신
        sitePriceMapper.updateCustomerBySiteCd(
                request.getSiteCd(),
                request.getBpCd(),
                request.getConstructorNm()
        );
    }

    public void delete(Long id) {
        SiteMasterDto existing = siteMasterMapper.findById(id);
        if (existing == null) {
            throw new IllegalArgumentException("현장을 찾을 수 없습니다: " + id);
        }
        siteMasterMapper.softDelete(id);
    }
}
