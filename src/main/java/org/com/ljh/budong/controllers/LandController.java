package org.com.ljh.budong.controllers;

import org.com.ljh.budong.dtos.api.AllInfoDto;
import org.com.ljh.budong.entities.UserEntity;
import org.com.ljh.budong.mappers.api.*;
import org.com.ljh.budong.services.LandAlarmService;
import org.com.ljh.budong.services.LandSaveService;
import org.com.ljh.budong.services.api.ApiService;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/land")
public class LandController {
    private final LandCoordinateMapper landCoordinateMapper;
    private final AddressInfoMapper addressInfoMapper;
    private final ApartPriceMapper apartPriceMapper;
    private final BuildingInfoMapper buildingInfoMapper;
    private final BuildingPriceMapper buildingPriceMapper;
    private final LandInfoMapper landInfoMapper;
    private final LandOwnInfoMapper landOwnInfoMapper;
    private final LandPriceMapper landPriceMapper;
    private final ApiService apiService;
    private final LandSaveService landSaveService;
    private final LandAlarmService landAlarmService;

    public LandController(LandCoordinateMapper landCoordinateMapper, AddressInfoMapper addressInfoMapper, ApartPriceMapper apartPriceMapper, BuildingInfoMapper buildingInfoMapper, BuildingPriceMapper buildingPriceMapper, LandInfoMapper landInfoMapper, LandOwnInfoMapper landOwnInfoMapper, LandPriceMapper landPriceMapper, ApiService apiService, LandSaveService landSaveService, LandAlarmService landAlarmService) {
        this.landCoordinateMapper = landCoordinateMapper;
        this.addressInfoMapper = addressInfoMapper;
        this.apartPriceMapper = apartPriceMapper;
        this.buildingInfoMapper = buildingInfoMapper;
        this.buildingPriceMapper = buildingPriceMapper;
        this.landInfoMapper = landInfoMapper;
        this.landOwnInfoMapper = landOwnInfoMapper;
        this.landPriceMapper = landPriceMapper;
        this.apiService = apiService;
        this.landSaveService = landSaveService;
        this.landAlarmService = landAlarmService;
    }

    @RequestMapping(value = "/info", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public AllInfoDto getInfo(@RequestParam("pnu") String pnu,
                              @SessionAttribute(value = "user", required = false) UserEntity user) {
        AllInfoDto allInfo =  this.apiService.entityToAllInfoDto(pnu,
                                                                this.landCoordinateMapper.selectLandCoordinate(pnu),
                                                                this.addressInfoMapper.selectAddressInfo(pnu),
                                                                this.landInfoMapper.selectLandInfo(pnu),
                                                                this.buildingInfoMapper.selectBuildingInfo(pnu),
                                                                this.landOwnInfoMapper.selectLandOwnInfo(pnu),
                                                                this.landPriceMapper.selectLandPrice(pnu),
                                                                this.buildingPriceMapper.selectBuildingPrice(pnu),
                                                                this.apartPriceMapper.selectApartPrice(pnu));
        if (user != null) {
            allInfo.setSigned(true);
            if (this.landSaveService.get(allInfo.getPnu(), user.getEmail()) != null) {
                allInfo.setSaved(true);
            }
            if (this.landAlarmService.get(allInfo.getPnu(), user.getEmail()) != null) {
                allInfo.setSavedAlarm(true);
            }
        }
        return allInfo;
    }
}
