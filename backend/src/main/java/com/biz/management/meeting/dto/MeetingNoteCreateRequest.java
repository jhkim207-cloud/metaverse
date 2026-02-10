package com.biz.management.meeting.dto;

public class MeetingNoteCreateRequest {

    private String sectionType;
    private String content;
    private String workRequestNo;

    public MeetingNoteCreateRequest() {}

    public String getSectionType() { return sectionType; }
    public void setSectionType(String sectionType) { this.sectionType = sectionType; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getWorkRequestNo() { return workRequestNo; }
    public void setWorkRequestNo(String workRequestNo) { this.workRequestNo = workRequestNo; }
}
