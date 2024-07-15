package org.com.ljh.budong.mappers;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.com.ljh.budong.dtos.LandDto;
import org.com.ljh.budong.dtos.LandSaveDto;
import org.com.ljh.budong.entities.LandSaveEntity;

@Mapper
public interface LandSaveMapper {
    int deleteLandSave(@Param("pnu") String pnu,
                       @Param("userEmail") String userEmail);

    int insertLandSave(LandSaveEntity landSaveEntity);

    int selectLandSaveCountByPnu(@Param("pnu") String pnu);

    LandSaveEntity selectLandSave(@Param("pnu") String pnu,
                                  @Param("userEmail") String userEmail);

    LandSaveDto[] selectLandSaveByPage(LandDto page);

    int selectLandSaveCountByPage(LandDto page);
}
