package org.com.ljh.budong.mappers.api;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.com.ljh.budong.entities.api.AddressInfoEntity;

@Mapper
public interface AddressInfoMapper {
    AddressInfoEntity selectAddressInfo(@Param("pnu") String pnu);

    int insertAddressInfo(AddressInfoEntity addressInfo);

    int updateAddressInfo(AddressInfoEntity addressInfo);
}
