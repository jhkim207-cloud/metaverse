package com.biz.management.yard.mapper;

import com.biz.management.yard.dto.YardCctvDto;
import com.biz.management.yard.dto.YardItemDto;
import com.biz.management.yard.dto.YardMasterDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface YardMapper {

    /** 야적장 마스터 조회 */
    YardMasterDto selectYardMaster(@Param("yardCd") String yardCd);

    /** 야적장 물건 목록 조회 */
    List<YardItemDto> selectYardItems(@Param("yardCd") String yardCd);

    /** 야적장 CCTV 목록 조회 */
    List<YardCctvDto> selectYardCctvs(@Param("yardCd") String yardCd);

    /** 물건 추가 */
    void insertYardItem(YardItemDto item);

    /** 물건 위치/상태 업데이트 */
    void updateYardItem(YardItemDto item);

    /** 물건 삭제 */
    void deleteYardItem(@Param("id") Long id);

    /** CCTV 알람 상태 업데이트 */
    void updateCctvAlarm(@Param("id") Long id, @Param("alarmStatus") Boolean alarmStatus);

    /** 알람 로그 추가 */
    void insertAlarmLog(@Param("yardCd") String yardCd,
                        @Param("cctvNm") String cctvNm,
                        @Param("alarmType") String alarmType,
                        @Param("message") String message);
}
