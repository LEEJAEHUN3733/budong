package org.com.ljh.budong.mappers.api;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.com.ljh.budong.entities.api.BuildingPriceEntity;

@Mapper
public interface BuildingPriceMapper {
    BuildingPriceEntity selectBuildingPrice(@Param("pnu") String pnu);

    int insertBuildingPrice(BuildingPriceEntity buildingPrice);

    int updateBuildingPrice(BuildingPriceEntity buildingPrice);
}
