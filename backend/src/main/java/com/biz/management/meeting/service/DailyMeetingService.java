package com.biz.management.meeting.service;

import com.biz.management.meeting.dto.DailyMeetingDto;
import com.biz.management.meeting.dto.MeetingActionItemDto;
import com.biz.management.meeting.dto.MeetingDashboardDto;
import com.biz.management.meeting.dto.MeetingNoteCreateRequest;
import com.biz.management.meeting.dto.MeetingNoteDto;
import com.biz.management.meeting.mapper.DailyMeetingActionItemMapper;
import com.biz.management.meeting.mapper.DailyMeetingMapper;
import com.biz.management.meeting.mapper.DailyMeetingNoteMapper;
import com.biz.management.site.dto.ProductionSummaryDto;
import com.biz.management.site.dto.WorkOrderDto;
import com.biz.management.site.dto.WorkerDailyAssignmentDto;
import com.biz.management.site.mapper.ProductionResultMapper;
import com.biz.management.site.mapper.WorkOrderMapper;
import com.biz.management.site.mapper.WorkerDailyAssignmentMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class DailyMeetingService {

    private final DailyMeetingMapper meetingMapper;
    private final DailyMeetingNoteMapper noteMapper;
    private final DailyMeetingActionItemMapper actionItemMapper;
    private final WorkOrderMapper workOrderMapper;
    private final WorkerDailyAssignmentMapper workerAssignmentMapper;
    private final ProductionResultMapper productionResultMapper;

    public DailyMeetingService(DailyMeetingMapper meetingMapper,
                               DailyMeetingNoteMapper noteMapper,
                               DailyMeetingActionItemMapper actionItemMapper,
                               WorkOrderMapper workOrderMapper,
                               WorkerDailyAssignmentMapper workerAssignmentMapper,
                               ProductionResultMapper productionResultMapper) {
        this.meetingMapper = meetingMapper;
        this.noteMapper = noteMapper;
        this.actionItemMapper = actionItemMapper;
        this.workOrderMapper = workOrderMapper;
        this.workerAssignmentMapper = workerAssignmentMapper;
        this.productionResultMapper = productionResultMapper;
    }

    @Transactional
    public MeetingDashboardDto getOrCreateTodayDashboard() {
        String today = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
        return getDashboardForDate(today, true);
    }

    public MeetingDashboardDto getDashboardForDate(String date, boolean autoCreate) {
        DailyMeetingDto meeting = meetingMapper.findByMeetingDate(date);

        if (meeting == null && autoCreate) {
            meeting = new DailyMeetingDto();
            meeting.setMeetingDate(date);
            meeting.setMeetingNo("DPM-" + date.replace("-", ""));
            meeting.setStatus("DRAFT");
            meeting.setTitle(date + " 일일생산회의");
            meeting.setTotalWorkOrders(0);
            meeting.setTotalQuantity(0);
            meeting.setTotalArea(BigDecimal.ZERO);
            meeting.setAssignedCount(0);
            meetingMapper.insert(meeting);
            meeting = meetingMapper.findById(meeting.getId());
        }

        if (meeting == null) {
            return null;
        }

        MeetingDashboardDto dashboard = new MeetingDashboardDto();
        dashboard.setMeeting(meeting);

        List<WorkOrderDto> workOrders = workOrderMapper.findByRequestDate(date);
        dashboard.setTodayWorkOrders(workOrders != null ? workOrders : Collections.emptyList());

        List<WorkerDailyAssignmentDto> assignments = workerAssignmentMapper.findByWorkDate(date);
        dashboard.setTodayAssignments(assignments != null ? assignments : Collections.emptyList());

        String yesterday = LocalDate.parse(date).minusDays(1).format(DateTimeFormatter.ISO_LOCAL_DATE);
        ProductionSummaryDto yesterdaySummary = productionResultMapper.getDailySummary(yesterday);
        dashboard.setYesterdaySummary(yesterdaySummary);

        List<MeetingActionItemDto> unresolvedActions = actionItemMapper.findAllUnresolved();
        dashboard.setUnresolvedActions(unresolvedActions != null ? unresolvedActions : Collections.emptyList());

        List<WorkOrderDto> wo = dashboard.getTodayWorkOrders();
        Set<String> sites = wo.stream()
                .map(WorkOrderDto::getSiteNm)
                .filter(s -> s != null && !s.isEmpty())
                .collect(Collectors.toSet());
        Set<String> customers = wo.stream()
                .map(WorkOrderDto::getCustomerNm)
                .filter(c -> c != null && !c.isEmpty())
                .collect(Collectors.toSet());
        dashboard.setTotalSites(sites.size());
        dashboard.setTotalCustomers(customers.size());

        return dashboard;
    }

    public DailyMeetingDto findByDate(String date) {
        return meetingMapper.findByMeetingDate(date);
    }

    public List<DailyMeetingDto> findRecent(int limit) {
        return meetingMapper.findRecent(limit);
    }

    @Transactional
    public DailyMeetingDto updateMeeting(Long id, DailyMeetingDto request) {
        DailyMeetingDto existing = meetingMapper.findById(id);
        if (existing == null) {
            throw new IllegalArgumentException("Meeting not found: " + id);
        }
        if (request.getTitle() != null) existing.setTitle(request.getTitle());
        if (request.getAttendees() != null) existing.setAttendees(request.getAttendees());
        if (request.getCarryforwardNotes() != null) existing.setCarryforwardNotes(request.getCarryforwardNotes());
        if (request.getGeneralNotes() != null) existing.setGeneralNotes(request.getGeneralNotes());
        meetingMapper.update(existing);
        return meetingMapper.findById(id);
    }

    @Transactional
    public DailyMeetingDto startMeeting(Long id) {
        DailyMeetingDto existing = meetingMapper.findById(id);
        if (existing == null) {
            throw new IllegalArgumentException("Meeting not found: " + id);
        }
        String now = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm"));
        meetingMapper.updateStatus(id, "IN_PROGRESS", now, null);
        return meetingMapper.findById(id);
    }

    @Transactional
    public DailyMeetingDto completeMeeting(Long id) {
        DailyMeetingDto existing = meetingMapper.findById(id);
        if (existing == null) {
            throw new IllegalArgumentException("Meeting not found: " + id);
        }
        String now = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm"));
        meetingMapper.updateStatus(id, "COMPLETED", null, now);

        // Snapshot metrics
        String date = existing.getMeetingDate();
        List<WorkOrderDto> workOrders = workOrderMapper.findByRequestDate(date);
        List<WorkerDailyAssignmentDto> assignments = workerAssignmentMapper.findByWorkDate(date);

        int totalWo = workOrders != null ? workOrders.size() : 0;
        int totalQty = workOrders != null ? workOrders.stream()
                .mapToInt(w -> w.getQuantity() != null ? w.getQuantity() : 0).sum() : 0;
        BigDecimal totalArea = workOrders != null ? workOrders.stream()
                .map(w -> w.getArea() != null ? w.getArea() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add) : BigDecimal.ZERO;
        int assignedCount = assignments != null ? assignments.size() : 0;

        meetingMapper.updateMetrics(id, totalWo, totalQty, totalArea, assignedCount);
        return meetingMapper.findById(id);
    }

    // --- Work Order Confirmation ---

    @Transactional
    public int confirmWorkOrders(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new IllegalArgumentException("확정할 작업지시를 선택해주세요.");
        }
        workOrderMapper.batchUpdateApprovalStatus(ids, "CONFIRMED");
        return ids.size();
    }

    // --- Notes ---
    public List<MeetingNoteDto> findNotes(Long meetingId) {
        return noteMapper.findByMeetingId(meetingId);
    }

    @Transactional
    public MeetingNoteDto createNote(Long meetingId, MeetingNoteCreateRequest request) {
        MeetingNoteDto note = new MeetingNoteDto();
        note.setMeetingId(meetingId);
        note.setSectionType(request.getSectionType());
        note.setSortOrder(noteMapper.getMaxSortOrder(meetingId) + 1);
        note.setContent(request.getContent());
        note.setWorkRequestNo(request.getWorkRequestNo());
        noteMapper.insert(note);
        return noteMapper.findById(note.getId());
    }

    @Transactional
    public MeetingNoteDto updateNote(Long noteId, MeetingNoteDto request) {
        MeetingNoteDto existing = noteMapper.findById(noteId);
        if (existing == null) {
            throw new IllegalArgumentException("Note not found: " + noteId);
        }
        if (request.getContent() != null) existing.setContent(request.getContent());
        if (request.getSectionType() != null) existing.setSectionType(request.getSectionType());
        if (request.getWorkRequestNo() != null) existing.setWorkRequestNo(request.getWorkRequestNo());
        noteMapper.update(existing);
        return noteMapper.findById(noteId);
    }

    @Transactional
    public void deleteNote(Long noteId) {
        noteMapper.delete(noteId);
    }
}
