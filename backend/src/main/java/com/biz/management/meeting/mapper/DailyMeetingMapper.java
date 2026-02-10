package com.biz.management.meeting.mapper;

import com.biz.management.meeting.dto.DailyMeetingDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface DailyMeetingMapper {

    DailyMeetingDto findByMeetingDate(@Param("meetingDate") String meetingDate);

    DailyMeetingDto findById(@Param("id") Long id);

    List<DailyMeetingDto> findRecent(@Param("limit") int limit);

    void insert(DailyMeetingDto meeting);

    void update(DailyMeetingDto meeting);

    void updateStatus(@Param("id") Long id, @Param("status") String status,
                      @Param("startTime") String startTime, @Param("endTime") String endTime);

    void updateMetrics(@Param("id") Long id,
                       @Param("totalWorkOrders") int totalWorkOrders,
                       @Param("totalQuantity") int totalQuantity,
                       @Param("totalArea") java.math.BigDecimal totalArea,
                       @Param("assignedCount") int assignedCount);
}
