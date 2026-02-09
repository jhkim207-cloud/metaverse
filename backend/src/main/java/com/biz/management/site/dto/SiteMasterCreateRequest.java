package com.biz.management.site.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 현장 마스터 생성 요청 DTO
 */
public class SiteMasterCreateRequest {

    @NotBlank(message = "현장코드는 필수입니다")
    @Size(max = 30, message = "현장코드는 30자 이하여야 합니다")
    private String siteCd;

    @NotBlank(message = "현장명은 필수입니다")
    @Size(max = 200, message = "현장명은 200자 이하여야 합니다")
    private String siteNm;

    @Size(max = 100, message = "건설사명은 100자 이하여야 합니다")
    private String constructorNm;

    @Size(max = 30, message = "거래처코드는 30자 이하여야 합니다")
    private String bpCd;

    @Size(max = 300, message = "주소는 300자 이하여야 합니다")
    private String address;

    @Size(max = 500, message = "비고는 500자 이하여야 합니다")
    private String remark;

    public SiteMasterCreateRequest() {}

    // Getters & Setters
    public String getSiteCd() { return siteCd; }
    public void setSiteCd(String siteCd) { this.siteCd = siteCd; }

    public String getSiteNm() { return siteNm; }
    public void setSiteNm(String siteNm) { this.siteNm = siteNm; }

    public String getConstructorNm() { return constructorNm; }
    public void setConstructorNm(String constructorNm) { this.constructorNm = constructorNm; }

    public String getBpCd() { return bpCd; }
    public void setBpCd(String bpCd) { this.bpCd = bpCd; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }
}
