package org.com.ljh.budong.mappers.api;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.com.ljh.budong.entities.api.LandInfoEntity;

@Mapper
public interface LandInfoMapper {
    LandInfoEntity selectLandInfo(@Param("pnu") String pnu);

    int insertLandInfo(LandInfoEntity landInfo);

    int updateLandInfo(LandInfoEntity landInfo);
}
