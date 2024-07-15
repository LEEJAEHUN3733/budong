package org.com.ljh.budong.mappers.api;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.com.ljh.budong.entities.api.LandPriceEntity;

@Mapper
public interface LandPriceMapper {
    LandPriceEntity selectLandPrice(@Param("pnu") String pnu);

    int insertLandPrice(LandPriceEntity landPrice);

    int updateLandPrice(LandPriceEntity landPrice);
}
