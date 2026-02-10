package com.biz.management.site.dto;

public class WorkerDailyAssignmentDto {

    private Long id;
    private String workDate;
    private String assignmentTypeCd;
    private String assignmentTypeNm;
    private String workArea;
    private String position;
    private String workerNm;
    private String workerCd;
    private String planNo;
    private String workRequestNo;
    private String assignmentRemarks;

    // worker 테이블 join 필드
    private String dept;
    private String prodLine;

    public WorkerDailyAssignmentDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getWorkDate() { return workDate; }
    public void setWorkDate(String workDate) { this.workDate = workDate; }

    public String getAssignmentTypeCd() { return assignmentTypeCd; }
    public void setAssignmentTypeCd(String assignmentTypeCd) { this.assignmentTypeCd = assignmentTypeCd; }

    public String getAssignmentTypeNm() { return assignmentTypeNm; }
    public void setAssignmentTypeNm(String assignmentTypeNm) { this.assignmentTypeNm = assignmentTypeNm; }

    public String getWorkArea() { return workArea; }
    public void setWorkArea(String workArea) { this.workArea = workArea; }

    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }

    public String getWorkerNm() { return workerNm; }
    public void setWorkerNm(String workerNm) { this.workerNm = workerNm; }

    public String getWorkerCd() { return workerCd; }
    public void setWorkerCd(String workerCd) { this.workerCd = workerCd; }

    public String getPlanNo() { return planNo; }
    public void setPlanNo(String planNo) { this.planNo = planNo; }

    public String getWorkRequestNo() { return workRequestNo; }
    public void setWorkRequestNo(String workRequestNo) { this.workRequestNo = workRequestNo; }

    public String getAssignmentRemarks() { return assignmentRemarks; }
    public void setAssignmentRemarks(String assignmentRemarks) { this.assignmentRemarks = assignmentRemarks; }

    public String getDept() { return dept; }
    public void setDept(String dept) { this.dept = dept; }

    public String getProdLine() { return prodLine; }
    public void setProdLine(String prodLine) { this.prodLine = prodLine; }
}
