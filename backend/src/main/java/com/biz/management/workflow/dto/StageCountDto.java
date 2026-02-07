package com.biz.management.workflow.dto;

/**
 * 워크플로우 단계별 건수 DTO
 */
public class StageCountDto {

    private String stageCode;
    private int total;
    private int pending;
    private int inProgress;
    private int completed;

    public StageCountDto() {}

    public StageCountDto(String stageCode, int total, int pending, int inProgress, int completed) {
        this.stageCode = stageCode;
        this.total = total;
        this.pending = pending;
        this.inProgress = inProgress;
        this.completed = completed;
    }

    // Getters & Setters
    public String getStageCode() { return stageCode; }
    public void setStageCode(String stageCode) { this.stageCode = stageCode; }

    public int getTotal() { return total; }
    public void setTotal(int total) { this.total = total; }

    public int getPending() { return pending; }
    public void setPending(int pending) { this.pending = pending; }

    public int getInProgress() { return inProgress; }
    public void setInProgress(int inProgress) { this.inProgress = inProgress; }

    public int getCompleted() { return completed; }
    public void setCompleted(int completed) { this.completed = completed; }
}
