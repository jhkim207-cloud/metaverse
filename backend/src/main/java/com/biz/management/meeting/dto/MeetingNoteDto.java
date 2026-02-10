package com.biz.management.meeting.dto;

public class MeetingNoteDto {

    private Long id;
    private Long meetingId;
    private String sectionType;
    private Integer sortOrder;
    private String content;
    private String workRequestNo;

    public MeetingNoteDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMeetingId() { return meetingId; }
    public void setMeetingId(Long meetingId) { this.meetingId = meetingId; }

    public String getSectionType() { return sectionType; }
    public void setSectionType(String sectionType) { this.sectionType = sectionType; }

    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getWorkRequestNo() { return workRequestNo; }
    public void setWorkRequestNo(String workRequestNo) { this.workRequestNo = workRequestNo; }
}
