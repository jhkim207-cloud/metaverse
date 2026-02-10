package com.biz.management.meeting.dto;

import java.math.BigDecimal;

public class DailyMeetingDto {

    private Long id;
    private String meetingDate;
    private String meetingNo;
    private String status;
    private String title;
    private String startTime;
    private String endTime;
    private String attendees;
    private String carryforwardNotes;
    private String generalNotes;
    private Integer totalWorkOrders;
    private Integer totalQuantity;
    private BigDecimal totalArea;
    private Integer assignedCount;

    public DailyMeetingDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMeetingDate() { return meetingDate; }
    public void setMeetingDate(String meetingDate) { this.meetingDate = meetingDate; }

    public String getMeetingNo() { return meetingNo; }
    public void setMeetingNo(String meetingNo) { this.meetingNo = meetingNo; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public String getAttendees() { return attendees; }
    public void setAttendees(String attendees) { this.attendees = attendees; }

    public String getCarryforwardNotes() { return carryforwardNotes; }
    public void setCarryforwardNotes(String carryforwardNotes) { this.carryforwardNotes = carryforwardNotes; }

    public String getGeneralNotes() { return generalNotes; }
    public void setGeneralNotes(String generalNotes) { this.generalNotes = generalNotes; }

    public Integer getTotalWorkOrders() { return totalWorkOrders; }
    public void setTotalWorkOrders(Integer totalWorkOrders) { this.totalWorkOrders = totalWorkOrders; }

    public Integer getTotalQuantity() { return totalQuantity; }
    public void setTotalQuantity(Integer totalQuantity) { this.totalQuantity = totalQuantity; }

    public BigDecimal getTotalArea() { return totalArea; }
    public void setTotalArea(BigDecimal totalArea) { this.totalArea = totalArea; }

    public Integer getAssignedCount() { return assignedCount; }
    public void setAssignedCount(Integer assignedCount) { this.assignedCount = assignedCount; }
}
