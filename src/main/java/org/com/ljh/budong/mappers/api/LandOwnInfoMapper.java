package org.com.ljh.budong.mappers.api;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.com.ljh.budong.entities.api.LandOwnInfoEntity;

@Mapper
public interface LandOwnInfoMapper {
    LandOwnInfoEntity selectLandOwnInfo(@Param("pnu") String pnu);

    int insertLandOwnInfo(LandOwnInfoEntity landOwnInfo);

    int updateLandOwnInfo(LandOwnInfoEntity landOwnInfo);
}
