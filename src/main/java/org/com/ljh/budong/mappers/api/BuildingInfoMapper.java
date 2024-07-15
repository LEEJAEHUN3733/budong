package org.com.ljh.budong.mappers.api;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.com.ljh.budong.entities.api.BuildingInfoEntity;

@Mapper
public interface BuildingInfoMapper {
    BuildingInfoEntity selectBuildingInfo(@Param("pnu") String pnu);

    int insertBuildingInfo(BuildingInfoEntity buildingInfo);

    int updateBuildingInfo(BuildingInfoEntity buildingInfo);
}
