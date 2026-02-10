package com.biz.management.meeting.service;

import com.biz.management.meeting.dto.MeetingActionItemCreateRequest;
import com.biz.management.meeting.dto.MeetingActionItemDto;
import com.biz.management.meeting.dto.MeetingActionItemUpdateRequest;
import com.biz.management.meeting.mapper.DailyMeetingActionItemMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MeetingActionItemService {

    private final DailyMeetingActionItemMapper actionItemMapper;

    public MeetingActionItemService(DailyMeetingActionItemMapper actionItemMapper) {
        this.actionItemMapper = actionItemMapper;
    }

    public List<MeetingActionItemDto> findByMeetingId(Long meetingId) {
        return actionItemMapper.findByMeetingId(meetingId);
    }

    public List<MeetingActionItemDto> findAllUnresolved() {
        return actionItemMapper.findAllUnresolved();
    }

    @Transactional
    public MeetingActionItemDto createActionItem(Long meetingId, MeetingActionItemCreateRequest request) {
        MeetingActionItemDto dto = new MeetingActionItemDto();
        dto.setMeetingId(meetingId);
        dto.setTitle(request.getTitle());
        dto.setDescription(request.getDescription());
        dto.setAssignee(request.getAssignee());
        dto.setDueDate(request.getDueDate());
        dto.setPriority(request.getPriority() != null ? request.getPriority() : "MEDIUM");
        dto.setStatus("OPEN");
        dto.setWorkRequestNo(request.getWorkRequestNo());
        actionItemMapper.insert(dto);
        return actionItemMapper.findById(dto.getId());
    }

    @Transactional
    public MeetingActionItemDto updateActionItem(Long id, MeetingActionItemUpdateRequest request) {
        MeetingActionItemDto existing = actionItemMapper.findById(id);
        if (existing == null) {
            throw new IllegalArgumentException("Action item not found: " + id);
        }
        if (request.getTitle() != null) existing.setTitle(request.getTitle());
        if (request.getDescription() != null) existing.setDescription(request.getDescription());
        if (request.getAssignee() != null) existing.setAssignee(request.getAssignee());
        if (request.getDueDate() != null) existing.setDueDate(request.getDueDate());
        if (request.getPriority() != null) existing.setPriority(request.getPriority());
        if (request.getStatus() != null) existing.setStatus(request.getStatus());
        if (request.getWorkRequestNo() != null) existing.setWorkRequestNo(request.getWorkRequestNo());
        if (request.getResolutionNote() != null) existing.setResolutionNote(request.getResolutionNote());
        actionItemMapper.update(existing);
        return actionItemMapper.findById(id);
    }

    @Transactional
    public void deleteActionItem(Long id) {
        MeetingActionItemDto existing = actionItemMapper.findById(id);
        if (existing == null) {
            throw new IllegalArgumentException("Action item not found: " + id);
        }
        actionItemMapper.delete(id);
    }
}
