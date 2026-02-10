package com.biz.management.meeting.mapper;

import com.biz.management.meeting.dto.MeetingNoteDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface DailyMeetingNoteMapper {

    List<MeetingNoteDto> findByMeetingId(@Param("meetingId") Long meetingId);

    MeetingNoteDto findById(@Param("id") Long id);

    void insert(MeetingNoteDto note);

    void update(MeetingNoteDto note);

    void delete(@Param("id") Long id);

    int getMaxSortOrder(@Param("meetingId") Long meetingId);
}
