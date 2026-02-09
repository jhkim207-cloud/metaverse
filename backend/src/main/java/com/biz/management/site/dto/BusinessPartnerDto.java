package com.biz.management.site.dto;

/**
 * 거래처 마스터 DTO
 */
public class BusinessPartnerDto {

    private Long id;
    private String bpCd;
    private String bpType;
    private String salesCategory;
    private String purchaseCategory;
    private String bpNm;
    private String ceoNm;
    private String bizRegNo;
    private String phone;
    private String mobile;
    private String fax;
    private String contactPerson;
    private String email;
    private String address1;
    private String address2;
    private String bizType;
    private String bizItem;
    private String bankHolder;
    private String bankAccount;
    private String bankNm;
    private Boolean isActive;

    public BusinessPartnerDto() {}

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBpCd() { return bpCd; }
    public void setBpCd(String bpCd) { this.bpCd = bpCd; }

    public String getBpType() { return bpType; }
    public void setBpType(String bpType) { this.bpType = bpType; }

    public String getSalesCategory() { return salesCategory; }
    public void setSalesCategory(String salesCategory) { this.salesCategory = salesCategory; }

    public String getPurchaseCategory() { return purchaseCategory; }
    public void setPurchaseCategory(String purchaseCategory) { this.purchaseCategory = purchaseCategory; }

    public String getBpNm() { return bpNm; }
    public void setBpNm(String bpNm) { this.bpNm = bpNm; }

    public String getCeoNm() { return ceoNm; }
    public void setCeoNm(String ceoNm) { this.ceoNm = ceoNm; }

    public String getBizRegNo() { return bizRegNo; }
    public void setBizRegNo(String bizRegNo) { this.bizRegNo = bizRegNo; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getFax() { return fax; }
    public void setFax(String fax) { this.fax = fax; }

    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress1() { return address1; }
    public void setAddress1(String address1) { this.address1 = address1; }

    public String getAddress2() { return address2; }
    public void setAddress2(String address2) { this.address2 = address2; }

    public String getBizType() { return bizType; }
    public void setBizType(String bizType) { this.bizType = bizType; }

    public String getBizItem() { return bizItem; }
    public void setBizItem(String bizItem) { this.bizItem = bizItem; }

    public String getBankHolder() { return bankHolder; }
    public void setBankHolder(String bankHolder) { this.bankHolder = bankHolder; }

    public String getBankAccount() { return bankAccount; }
    public void setBankAccount(String bankAccount) { this.bankAccount = bankAccount; }

    public String getBankNm() { return bankNm; }
    public void setBankNm(String bankNm) { this.bankNm = bankNm; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
