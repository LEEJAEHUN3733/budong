package org.com.ljh.budong.mappers;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.com.ljh.budong.entities.LandAlarmEntity;

@Mapper
public interface LandAlarmMapper {
    int deleteLandAlarm(@Param("pnu") String pnu,
                        @Param("userEmail") String userEmail);

    int insertLandAlarm(LandAlarmEntity landAlarmEntity);

    LandAlarmEntity selectLandAlarm(@Param("pnu") String pnu,
                                    @Param("userEmail") String userEmail);

    LandAlarmEntity[] selectLandAlarmByPnu(@Param("pnu") String pnu);
}
