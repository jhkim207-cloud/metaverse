package com.biz.management.site.dto;

/**
 * 현장 마스터 DTO
 */
public class SiteMasterDto {

    private Long id;
    private String siteCd;
    private String siteNm;
    private String constructorNm;
    private String bpCd;
    private String address;
    private String remark;
    private Boolean isActive;

    public SiteMasterDto() {}

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
