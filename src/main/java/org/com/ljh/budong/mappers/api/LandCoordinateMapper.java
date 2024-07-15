package org.com.ljh.budong.mappers.api;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.com.ljh.budong.entities.api.LandCoordinateEntity;

@Mapper
public interface LandCoordinateMapper {
    LandCoordinateEntity selectLandCoordinate(@Param("pnu") String pnu);

    int insertLandCoordinate(LandCoordinateEntity landCoordinate);

    int updateLandCoordinate(LandCoordinateEntity landCoordinate);
}
