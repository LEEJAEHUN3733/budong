package org.com.ljh.budong.mappers;

import org.apache.ibatis.annotations.Mapper;
import org.com.ljh.budong.dtos.AddressDto;
import org.com.ljh.budong.dtos.SearchDto;

@Mapper
public interface SearchMapper {
    AddressDto[] selectAddressBySearch(SearchDto search);

    int selectAddressCountBySearch(SearchDto search);
}
