package com.biz.management.meeting.controller;

import com.biz.management.common.dto.ApiResponse;
import com.biz.management.meeting.dto.DailyMeetingDto;
import com.biz.management.meeting.dto.MeetingActionItemCreateRequest;
import com.biz.management.meeting.dto.MeetingActionItemDto;
import com.biz.management.meeting.dto.MeetingActionItemUpdateRequest;
import com.biz.management.meeting.dto.MeetingDashboardDto;
import com.biz.management.meeting.dto.MeetingNoteCreateRequest;
import com.biz.management.meeting.dto.MeetingNoteDto;
import com.biz.management.meeting.service.DailyMeetingService;
import com.biz.management.meeting.service.MeetingActionItemService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/meetings")
public class DailyMeetingController {

    private final DailyMeetingService meetingService;
    private final MeetingActionItemService actionItemService;

    public DailyMeetingController(DailyMeetingService meetingService,
                                  MeetingActionItemService actionItemService) {
        this.meetingService = meetingService;
        this.actionItemService = actionItemService;
    }

    @GetMapping("/today")
    public ApiResponse<MeetingDashboardDto> getTodayDashboard() {
        return ApiResponse.success(meetingService.getOrCreateTodayDashboard());
    }

    @GetMapping
    public ApiResponse<MeetingDashboardDto> getByDate(@RequestParam String date) {
        return ApiResponse.success(meetingService.getDashboardForDate(date, false));
    }

    @GetMapping("/recent")
    public ApiResponse<List<DailyMeetingDto>> getRecent(
            @RequestParam(defaultValue = "5") int limit) {
        return ApiResponse.success(meetingService.findRecent(limit));
    }

    @PutMapping("/{id}")
    public ApiResponse<DailyMeetingDto> updateMeeting(
            @PathVariable Long id, @RequestBody DailyMeetingDto request) {
        return ApiResponse.success(meetingService.updateMeeting(id, request));
    }

    @PutMapping("/{id}/start")
    public ApiResponse<DailyMeetingDto> startMeeting(@PathVariable Long id) {
        return ApiResponse.success(meetingService.startMeeting(id));
    }

    @PutMapping("/{id}/complete")
    public ApiResponse<DailyMeetingDto> completeMeeting(@PathVariable Long id) {
        return ApiResponse.success(meetingService.completeMeeting(id));
    }

    // --- Work Order Confirmation ---

    @PutMapping("/work-orders/confirm")
    public ApiResponse<Integer> confirmWorkOrders(@RequestBody List<Long> ids) {
        return ApiResponse.success(meetingService.confirmWorkOrders(ids));
    }

    // --- Notes ---

    @GetMapping("/{id}/notes")
    public ApiResponse<List<MeetingNoteDto>> getNotes(@PathVariable Long id) {
        return ApiResponse.success(meetingService.findNotes(id));
    }

    @PostMapping("/{id}/notes")
    public ApiResponse<MeetingNoteDto> createNote(
            @PathVariable Long id, @RequestBody MeetingNoteCreateRequest request) {
        return ApiResponse.success(meetingService.createNote(id, request));
    }

    @PutMapping("/notes/{noteId}")
    public ApiResponse<MeetingNoteDto> updateNote(
            @PathVariable Long noteId, @RequestBody MeetingNoteDto request) {
        return ApiResponse.success(meetingService.updateNote(noteId, request));
    }

    @DeleteMapping("/notes/{noteId}")
    public ApiResponse<Void> deleteNote(@PathVariable Long noteId) {
        meetingService.deleteNote(noteId);
        return ApiResponse.success(null);
    }

    // --- Action Items ---

    @GetMapping("/{id}/actions")
    public ApiResponse<List<MeetingActionItemDto>> getActions(@PathVariable Long id) {
        return ApiResponse.success(actionItemService.findByMeetingId(id));
    }

    @GetMapping("/actions/unresolved")
    public ApiResponse<List<MeetingActionItemDto>> getUnresolvedActions() {
        return ApiResponse.success(actionItemService.findAllUnresolved());
    }

    @PostMapping("/{id}/actions")
    public ApiResponse<MeetingActionItemDto> createAction(
            @PathVariable Long id, @RequestBody MeetingActionItemCreateRequest request) {
        return ApiResponse.success(actionItemService.createActionItem(id, request));
    }

    @PutMapping("/actions/{actionId}")
    public ApiResponse<MeetingActionItemDto> updateAction(
            @PathVariable Long actionId, @RequestBody MeetingActionItemUpdateRequest request) {
        return ApiResponse.success(actionItemService.updateActionItem(actionId, request));
    }

    @DeleteMapping("/actions/{actionId}")
    public ApiResponse<Void> deleteAction(@PathVariable Long actionId) {
        actionItemService.deleteActionItem(actionId);
        return ApiResponse.success(null);
    }
}
