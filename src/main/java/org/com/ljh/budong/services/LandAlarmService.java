package org.com.ljh.budong.services;

import org.com.ljh.budong.entities.LandAlarmEntity;
import org.com.ljh.budong.mappers.LandAlarmMapper;
import org.com.ljh.budong.results.CommonResult;
import org.com.ljh.budong.results.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class LandAlarmService {
    private final LandAlarmMapper landAlarmMapper;

    @Autowired
    public LandAlarmService(LandAlarmMapper landAlarmMapper) {
        this.landAlarmMapper = landAlarmMapper;
    }

    public LandAlarmEntity get(String pnu, String userEmail) {
        return this.landAlarmMapper.selectLandAlarm(pnu, userEmail);
    }

    public Result toggle(String pnu, String userEmail) {
        int affectRows;
        if (this.landAlarmMapper.selectLandAlarm(pnu, userEmail) == null) {
            LandAlarmEntity landAlarm = new LandAlarmEntity();
            landAlarm.setLandAlarmPnu(pnu);
            landAlarm.setUserEmail(userEmail);
            landAlarm.setCreatedAt(LocalDateTime.now());
            affectRows = this.landAlarmMapper.insertLandAlarm(landAlarm);
        } else {
            affectRows = this.landAlarmMapper.deleteLandAlarm(pnu, userEmail);
        }
        return affectRows > 0 ? CommonResult.SUCCESS : CommonResult.FAILURE;
    }
}
