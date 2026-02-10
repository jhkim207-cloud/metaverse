package com.biz.management.meeting.dto;

import com.biz.management.site.dto.ProductionSummaryDto;
import com.biz.management.site.dto.WorkOrderDto;
import com.biz.management.site.dto.WorkerDailyAssignmentDto;

import java.util.List;

public class MeetingDashboardDto {

    private DailyMeetingDto meeting;
    private List<WorkOrderDto> todayWorkOrders;
    private List<WorkerDailyAssignmentDto> todayAssignments;
    private ProductionSummaryDto yesterdaySummary;
    private List<MeetingActionItemDto> unresolvedActions;
    private int totalSites;
    private int totalCustomers;

    public MeetingDashboardDto() {}

    public DailyMeetingDto getMeeting() { return meeting; }
    public void setMeeting(DailyMeetingDto meeting) { this.meeting = meeting; }

    public List<WorkOrderDto> getTodayWorkOrders() { return todayWorkOrders; }
    public void setTodayWorkOrders(List<WorkOrderDto> todayWorkOrders) { this.todayWorkOrders = todayWorkOrders; }

    public List<WorkerDailyAssignmentDto> getTodayAssignments() { return todayAssignments; }
    public void setTodayAssignments(List<WorkerDailyAssignmentDto> todayAssignments) { this.todayAssignments = todayAssignments; }

    public ProductionSummaryDto getYesterdaySummary() { return yesterdaySummary; }
    public void setYesterdaySummary(ProductionSummaryDto yesterdaySummary) { this.yesterdaySummary = yesterdaySummary; }

    public List<MeetingActionItemDto> getUnresolvedActions() { return unresolvedActions; }
    public void setUnresolvedActions(List<MeetingActionItemDto> unresolvedActions) { this.unresolvedActions = unresolvedActions; }

    public int getTotalSites() { return totalSites; }
    public void setTotalSites(int totalSites) { this.totalSites = totalSites; }

    public int getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(int totalCustomers) { this.totalCustomers = totalCustomers; }
}
