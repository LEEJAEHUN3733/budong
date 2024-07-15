package org.com.ljh.budong.services;

import org.com.ljh.budong.entities.LandSaveEntity;
import org.com.ljh.budong.mappers.LandSaveMapper;
import org.com.ljh.budong.results.CommonResult;
import org.com.ljh.budong.results.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class LandSaveService {
    private final LandSaveMapper landSaveMapper;

    @Autowired
    public LandSaveService(LandSaveMapper landSaveMapper) {
        this.landSaveMapper = landSaveMapper;
    }

    public LandSaveEntity get(String pnu, String userEmail) {
        return this.landSaveMapper.selectLandSave(pnu, userEmail);
    }

    public Result toggle(String pnu, String userEmail) {
        int affectRows;
        if (this.landSaveMapper.selectLandSave(pnu, userEmail) == null) {
            LandSaveEntity landSave = new LandSaveEntity();
            landSave.setLandSavePnu(pnu);
            landSave.setUserEmail(userEmail);
            landSave.setCreatedAt(LocalDateTime.now());
            affectRows = this.landSaveMapper.insertLandSave(landSave);
        } else {
            affectRows = this.landSaveMapper.deleteLandSave(pnu, userEmail);
        }
        return affectRows > 0 ? CommonResult.SUCCESS : CommonResult.FAILURE;
    }
}
