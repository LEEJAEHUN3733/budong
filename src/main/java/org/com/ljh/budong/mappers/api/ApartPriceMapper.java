package org.com.ljh.budong.mappers.api;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.com.ljh.budong.entities.api.ApartPriceEntity;

@Mapper
public interface ApartPriceMapper {
    ApartPriceEntity selectApartPrice(@Param("pnu") String pnu);

    int insertApartPrice(ApartPriceEntity apartPrice);

    int updateApartPrice(ApartPriceEntity apartPrice);
}
