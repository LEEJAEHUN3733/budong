package org.com.ljh.budong.mappers;

import org.apache.ibatis.annotations.Mapper;
import org.com.ljh.budong.entities.CenterEntity;

@Mapper
public interface CenterMapper {
    int insertCenter(CenterEntity centerEntity);
}
