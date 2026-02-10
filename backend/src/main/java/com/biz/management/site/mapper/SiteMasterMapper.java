package com.biz.management.site.mapper;

import com.biz.management.site.dto.SiteMasterDto;
import com.biz.management.site.dto.SiteMasterCreateRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SiteMasterMapper {

    List<SiteMasterDto> findAll();

    SiteMasterDto findById(@Param("id") Long id);

    boolean existsBySiteCd(@Param("siteCd") String siteCd);

    void insert(SiteMasterCreateRequest request);

    boolean existsBySiteCdExcludeId(@Param("siteCd") String siteCd, @Param("id") Long id);

    void update(@Param("id") Long id, @Param("req") SiteMasterCreateRequest request);

    void softDelete(@Param("id") Long id);
}
