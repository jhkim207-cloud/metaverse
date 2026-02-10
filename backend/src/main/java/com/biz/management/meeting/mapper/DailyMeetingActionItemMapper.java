package com.biz.management.meeting.mapper;

import com.biz.management.meeting.dto.MeetingActionItemDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface DailyMeetingActionItemMapper {

    List<MeetingActionItemDto> findByMeetingId(@Param("meetingId") Long meetingId);

    List<MeetingActionItemDto> findAllUnresolved();

    MeetingActionItemDto findById(@Param("id") Long id);

    void insert(MeetingActionItemDto actionItem);

    void update(MeetingActionItemDto actionItem);

    void delete(@Param("id") Long id);

    int countUnresolved();
}
