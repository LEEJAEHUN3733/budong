package org.com.ljh.budong.controllers;

import org.com.ljh.budong.dtos.api.*;
import org.com.ljh.budong.entities.UserEntity;
import org.com.ljh.budong.services.LandAlarmService;
import org.com.ljh.budong.services.LandSaveService;
import org.com.ljh.budong.services.api.*;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api")
public class ApiController {
    private final ApiService apiService;
    private final LandInfoService landInfoService;
    private final AddressInfoService addressInfoService;
    private final BuildingInfoService buildingInfoService;
    private final LandOwnInfoService landOwnInfoService;
    private final LandPriceService landPriceService;
    private final BuildingPriceService buildingPriceService;
    private final ApartPriceService apartPriceService;
    private final LandSaveService landSaveService;
    private final LandAlarmService landAlarmService;

    @Autowired
    public ApiController(ApiService apiService, LandInfoService landInfoService, AddressInfoService addressInfoService, BuildingInfoService buildingInfoService, LandOwnInfoService landOwnInfoService, LandPriceService landPriceService, BuildingPriceService buildingPriceService, ApartPriceService apartPriceService, LandSaveService landSaveService, LandAlarmService landAlarmService) {
        this.apiService = apiService;
        this.landInfoService = landInfoService;
        this.addressInfoService = addressInfoService;
        this.buildingInfoService = buildingInfoService;
        this.landOwnInfoService = landOwnInfoService;
        this.landPriceService = landPriceService;
        this.buildingPriceService = buildingPriceService;
        this.apartPriceService = apartPriceService;
        this.landSaveService = landSaveService;
        this.landAlarmService = landAlarmService;
    }

    @GetMapping("/info")
    @ResponseBody
    public AllInfoDto getInfo(@RequestParam("lat") String latitude, @RequestParam("lng") String longitude,
                              @SessionAttribute(value = "user", required = false) UserEntity user) throws Exception {
        LandCoordinateDto landCoordinate = new LandCoordinateDto(Double.parseDouble(latitude), Double.parseDouble(longitude));
        List<JSONObject> jsonObjectList = this.addressInfoService.getAddresses(latitude, longitude);
        JSONObject sb1JSON = jsonObjectList.get(0);
        JSONObject sb2JSON = jsonObjectList.get(1);
        AllInfoDto allInfo = this.apiService.api(sb1JSON, sb2JSON, landCoordinate);
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

    @GetMapping("/addresses")
    public List<JSONObject> getAddresses(@RequestParam("lat") String latitude, @RequestParam("lng") String longitude) throws Exception {
        return this.addressInfoService.getAddresses(latitude, longitude);
    }

    @GetMapping("/landInfo")
    public List<LandInfoDto> getLandInfo(@RequestParam("pnu") String pnu) throws Exception {
        return this.landInfoService.getLandInfo(pnu);
    }

    @GetMapping("/buildingInfo")
    public List<BuildingInfoDto> getBuildingInfo(@RequestParam("pnu") String pnu) throws Exception {
        return this.buildingInfoService.getBuildingInfo(pnu);
    }

    @GetMapping("/landOwnInfo")
    public List<LandOwnInfoDto> getLandOwnInfo(@RequestParam("pnu") String pnu) throws Exception {
        return this.landOwnInfoService.getLandOwnInfo(pnu);
    }

    @GetMapping("/landPrice")
    public List<LandPriceDto> getLandPrice(@RequestParam("pnu") String pnu) throws Exception {
        return this.landPriceService.getLandPrice(pnu);
    }

    @GetMapping("/buildingPrice")
    public List<BuildingPriceDto> getBuildingPrice(@RequestParam("pnu") String pnu) throws Exception {
        return this.buildingPriceService.getBuildingPrice(pnu);
    }

    @GetMapping("/apartPrice")
    public List<ApartPriceDto> getApartPrice(@RequestParam("pnu") String pnu) throws Exception {
        return this.apartPriceService.getApartPrice(pnu);
    }
}
