package org.com.ljh.budong.mappers;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.com.ljh.budong.entities.LandReportEntity;

@Mapper
public interface LandReportMapper {
    int insertLandReport(LandReportEntity landReport);

    LandReportEntity selectLandReport(@Param("pnu") String pnu,
                                      @Param("userEmail") String userEmail);
}
