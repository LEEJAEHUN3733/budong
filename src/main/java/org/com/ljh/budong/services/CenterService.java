package org.com.ljh.budong.services;

import org.com.ljh.budong.entities.CenterEntity;
import org.com.ljh.budong.mappers.CenterMapper;
import org.com.ljh.budong.results.CommonResult;
import org.com.ljh.budong.results.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class CenterService {
    private final CenterMapper centerMapper;

    @Autowired
    public CenterService(CenterMapper centerMapper) {
        this.centerMapper = centerMapper;
    }

    public Result add(CenterEntity centerEntity) {
        centerEntity.setCreatedAt(LocalDateTime.now());
        return this.centerMapper.insertCenter(centerEntity) > 0
                ? CommonResult.SUCCESS
                : CommonResult.FAILURE;
    }
}
