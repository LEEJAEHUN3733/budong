package org.com.ljh.budong.services.api;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.com.ljh.budong.dtos.api.*;
import org.com.ljh.budong.entities.LandAlarmEntity;
import org.com.ljh.budong.entities.api.*;
import org.com.ljh.budong.mappers.LandAlarmMapper;
import org.com.ljh.budong.mappers.LandReviewMapper;
import org.com.ljh.budong.mappers.LandSaveMapper;
import org.com.ljh.budong.mappers.api.*;
import org.com.ljh.budong.misc.MailSender;
import org.com.ljh.budong.results.CommonResult;
import org.com.ljh.budong.services.AsyncMailService;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ApiService {
    private final AddressInfoMapper addressInfoMapper;
    private final ApartPriceMapper apartPriceMapper;
    private final BuildingInfoMapper buildingInfoMapper;
    private final BuildingPriceMapper buildingPriceMapper;
    private final LandInfoMapper landInfoMapper;
    private final LandOwnInfoMapper landOwnInfoMapper;
    private final LandPriceMapper landPriceMapper;
    private final LandReviewMapper landReviewMapper;
    private final LandSaveMapper landSaveMapper;
    private final LandCoordinateMapper landCoordinateMapper;

    private final ApartPriceService apartPriceService;
    private final BuildingInfoService buildingInfoService;
    private final BuildingPriceService buildingPriceService;
    private final LandInfoService landInfoService;
    private final LandOwnInfoService landOwnInfoService;
    private final LandPriceService landPriceService;
    private final AsyncMailService asyncMailService;

    @Transactional
    public AllInfoDto api(JSONObject sb1JSON, JSONObject sb2JSON, LandCoordinateDto landCoordinate) throws Exception {
        // pnu 값 추출
        String pnu = pnuConverter(sb1JSON, sb2JSON);
        // db에 latitude, longitude 값 insert 및 있다면 update
        LandCoordinateEntity newLandCoordinate = new LandCoordinateEntity();
        newLandCoordinate.setPnu(pnu);
        newLandCoordinate.setLatitude(landCoordinate.getLatitude());
        newLandCoordinate.setLongitude(landCoordinate.getLongitude());
        LandCoordinateEntity dbLandCoordinate = this.landCoordinateMapper.selectLandCoordinate(pnu);
        if (dbLandCoordinate == null) {
            landCoordinateMapper.insertLandCoordinate(newLandCoordinate);
        } else {
            landCoordinateMapper.updateLandCoordinate(newLandCoordinate);
        }
        AddressInfoEntity addressInfoEntity = this.addressInfoMapper.selectAddressInfo(pnu);
        // db에 값이 있을때
        if (dbCheck(pnu)) {
            // 갱신일자가 7일 지났을때
            if (addressInfoEntity.getUpdatedAt() != null &&
                addressInfoEntity.getUpdatedAt().isBefore(LocalDateTime.now().minusDays(7))) {
                // 주소 호출 및 업데이트
                AddressInfoDto addressInfoDto = getAddress(pnu, sb2JSON);
                AddressInfoEntity addressInfo = new AddressInfoEntity();
                AddressInfoEntity updatedAddressInfo = addressInfoDtoToEntity(pnu, addressInfoDto, addressInfo);
                addressInfoMapper.updateAddressInfo(updatedAddressInfo);
                // 토지정보 호출 및 업데이트
                List<LandInfoDto> landInfoDtoList = this.landInfoService.getLandInfo(pnu);
                LandInfoEntity landInfo = new LandInfoEntity();
                LandInfoEntity updatedLandInfo = landInfoDtoListToEntity(pnu, landInfoDtoList, landInfo);
                landInfoMapper.updateLandInfo(updatedLandInfo);
                // 건물정보 호출 및 업데이트
                List<BuildingInfoDto> buildingInfoDtoList = this.buildingInfoService.getBuildingInfo(pnu);
                BuildingInfoEntity buildingInfo = new BuildingInfoEntity();
                BuildingInfoEntity updatedBuildingInfo = buildingInfoDtoListToEntity(pnu, buildingInfoDtoList, buildingInfo);
                buildingInfoMapper.updateBuildingInfo(updatedBuildingInfo);
                // 토지소유정보 호출 및 업데이트
                List<LandOwnInfoDto> landOwnInfoDtoList = this.landOwnInfoService.getLandOwnInfo(pnu);
                LandOwnInfoEntity landOwnInfo = new LandOwnInfoEntity();
                LandOwnInfoEntity updatedLandOwnInfo = landOwnInfoDtoListToEntity(pnu, landOwnInfoDtoList, landOwnInfo);
                landOwnInfoMapper.updateLandOwnInfo(updatedLandOwnInfo);
                // 개별공시지가 호출 및 업데이트
                List<LandPriceDto> landPriceDtoList = this.landPriceService.getLandPrice(pnu);
                LandPriceEntity landPrice = new LandPriceEntity();
                LandPriceEntity updatedLandPrice = landPriceDtoListToEntity(pnu, landPriceDtoList, landPrice);
                landPriceMapper.updateLandPrice(updatedLandPrice);
                // 개별주택가격 호출 및 업데이트
                List<BuildingPriceDto> buildingPriceDtoList = this.buildingPriceService.getBuildingPrice(pnu);
                BuildingPriceEntity buildingPrice = new BuildingPriceEntity();
                BuildingPriceEntity updatedBuildingPrice = buildingPriceDtoListToEntity(pnu, buildingPriceDtoList, buildingPrice);
                buildingPriceMapper.updateBuildingPrice(updatedBuildingPrice);
                // 공공주택가격 호출 및 업데이트
                List<ApartPriceDto> apartPriceDtoList = this.apartPriceService.getApartPrice(pnu);
                ApartPriceEntity apartPrice = new ApartPriceEntity();
                ApartPriceEntity updatedApartPrice = apartPriceDtoListToEntity(pnu, apartPriceDtoList, apartPrice);
                apartPriceMapper.updateApartPrice(updatedApartPrice);
                // 메일보내기(pnu 등록한 사람 메일주소로 메일 발송)
                System.out.println("업데이트 완료");
                this.asyncMailService.updateMailSend(pnu, addressInfo.getAddressName());
                return entityToAllInfoDto(pnu, newLandCoordinate,updatedAddressInfo, updatedLandInfo, updatedBuildingInfo, updatedLandOwnInfo, updatedLandPrice, updatedBuildingPrice, updatedApartPrice);
            }

            AddressInfoEntity addressInfo = this.addressInfoMapper.selectAddressInfo(pnu);
            LandInfoEntity landInfo = this.landInfoMapper.selectLandInfo(pnu);
            BuildingInfoEntity buildingInfo = this.buildingInfoMapper.selectBuildingInfo(pnu);
            LandOwnInfoEntity landOwnInfo = this.landOwnInfoMapper.selectLandOwnInfo(pnu);
            LandPriceEntity landPrice = this.landPriceMapper.selectLandPrice(pnu);
            BuildingPriceEntity buildingPrice = this.buildingPriceMapper.selectBuildingPrice(pnu);
            ApartPriceEntity apartPrice = this.apartPriceMapper.selectApartPrice(pnu);

            System.out.println("불러오기 완료");
            return entityToAllInfoDto(pnu, newLandCoordinate,addressInfo, landInfo, buildingInfo, landOwnInfo, landPrice, buildingPrice, apartPrice);
        }
        // db에 값이 없을 때 api호출 후 db에 insert
        if (!dbCheck(pnu)) {
            // 주소 호출 및 db insert
            AddressInfoDto addressInfoDto = getAddress(pnu, sb2JSON);
            AddressInfoEntity addressInfo = new AddressInfoEntity();
            AddressInfoEntity newAddressInfo = addressInfoDtoToEntity(pnu, addressInfoDto, addressInfo);
            addressInfoMapper.insertAddressInfo(newAddressInfo);
            // 토지정보 호출 및 db insert
            List<LandInfoDto> landInfoDtoList = this.landInfoService.getLandInfo(pnu);
            LandInfoEntity landInfo = new LandInfoEntity();
            LandInfoEntity newLandInfo = landInfoDtoListToEntity(pnu, landInfoDtoList, landInfo);
            landInfoMapper.insertLandInfo(newLandInfo);
            // 건물정보 호출 및 db insert
            List<BuildingInfoDto> buildingInfoDtoList = this.buildingInfoService.getBuildingInfo(pnu);
            BuildingInfoEntity buildingInfo = new BuildingInfoEntity();
            BuildingInfoEntity newBuildingInfo = buildingInfoDtoListToEntity(pnu, buildingInfoDtoList, buildingInfo);
            buildingInfoMapper.insertBuildingInfo(newBuildingInfo);
            // 토지소유정보 호출 및 db insert
            List<LandOwnInfoDto> landOwnInfoDtoList = this.landOwnInfoService.getLandOwnInfo(pnu);
            LandOwnInfoEntity landOwnInfo = new LandOwnInfoEntity();
            LandOwnInfoEntity newLandOwnInfo = landOwnInfoDtoListToEntity(pnu, landOwnInfoDtoList, landOwnInfo);
            landOwnInfoMapper.insertLandOwnInfo(newLandOwnInfo);
            // 개별공시지가 호출 및 db insert
            List<LandPriceDto> landPriceDtoList = this.landPriceService.getLandPrice(pnu);
            LandPriceEntity landPrice = new LandPriceEntity();
            LandPriceEntity newLandPrice = landPriceDtoListToEntity(pnu, landPriceDtoList, landPrice);
            landPriceMapper.insertLandPrice(newLandPrice);
            // 개별주택가격 호출 및 db insert
            List<BuildingPriceDto> buildingPriceDtoList = this.buildingPriceService.getBuildingPrice(pnu);
            BuildingPriceEntity buildingPrice = new BuildingPriceEntity();
            BuildingPriceEntity newBuildingPrice = buildingPriceDtoListToEntity(pnu, buildingPriceDtoList, buildingPrice);
            buildingPriceMapper.insertBuildingPrice(newBuildingPrice);
            // 공공주택가격 호출 및 db insert
            List<ApartPriceDto> apartPriceDtoList = this.apartPriceService.getApartPrice(pnu);
            ApartPriceEntity apartPrice = new ApartPriceEntity();
            ApartPriceEntity newApartPrice = apartPriceDtoListToEntity(pnu, apartPriceDtoList, apartPrice);
            apartPriceMapper.insertApartPrice(newApartPrice);

            System.out.println("INSERT 완료");
            return entityToAllInfoDto(pnu, newLandCoordinate, newAddressInfo, newLandInfo, newBuildingInfo, newLandOwnInfo, newLandPrice, newBuildingPrice, newApartPrice);
        }
        return null;
    }

    private String pnuConverter(JSONObject sb1JSON, JSONObject sb2JSON) {
        // 전달받은 sb 매개변수에서 값 추출 후 pnu반환
        JSONArray documentArray1 = (JSONArray) sb1JSON.get("documents");
        String pnu1 = "";
        for (int i = 0; i < documentArray1.length(); i++) {
            JSONObject documentObject = (JSONObject) documentArray1.get(i);
            if (Objects.equals(documentObject.get("region_type").toString(), "B")) {
                pnu1 = documentObject.get("code").toString();
            }
        }

        JSONArray documentArray2 = sb2JSON.getJSONArray("documents");
        JSONObject addressObject = documentArray2.getJSONObject(0).getJSONObject("address");
        String pnu2 = "";
        String pnu3 = "";
        String pnu4 = "";

        if (Objects.equals(addressObject.get("mountain_yn").toString(), "N")) {
            pnu2 = "1";
        } else {
            pnu2 = "0";
        }

        if (addressObject.get("main_address_no") == null) {
            pnu3 = "0000";
        } else if(addressObject.get("main_address_no") == "") {
            pnu3 = "0000";
        } else {
            pnu3 = String.format("%04d", Integer.parseInt(addressObject.get("main_address_no").toString()));
        }

        if (addressObject.get("sub_address_no") == null) {
            pnu4 = "0000";
        } else if(addressObject.get("sub_address_no") == "") {
            pnu4 = "0000";
        } else {
            pnu4 = String.format("%04d", Integer.parseInt(addressObject.get("sub_address_no").toString()));
        }

        return pnu1 + pnu2 + pnu3 + pnu4;
    }

    private boolean dbCheck(String pnu) {
        return this.addressInfoMapper.selectAddressInfo(pnu) != null;
    }

    public AllInfoDto entityToAllInfoDto(String pnu, LandCoordinateEntity landCoordinate,AddressInfoEntity addressInfo, LandInfoEntity landInfo, BuildingInfoEntity buildingInfo, LandOwnInfoEntity landOwnInfo, LandPriceEntity landPrice, BuildingPriceEntity buildingPrice, ApartPriceEntity apartPrice) {

        AllInfoDto allInfo = new AllInfoDto();
        // 고유번호
        allInfo.setPnu(pnu);
        // 주소정보
        if (addressInfo != null) {
            allInfo.setAddressName(addressInfo.getAddressName() != null ? addressInfo.getAddressName() : "-");
            allInfo.setRoadAddressName(addressInfo.getRoadAddressName() != "" ? addressInfo.getRoadAddressName() : "-");
        }
        // 토지정보
        if (landInfo != null) {
            allInfo.setLandMainNumber(landInfo.getLandMainNumber() != null ? landInfo.getLandMainNumber() : "-");
            allInfo.setLandSubNumber(landInfo.getLandSubNumber() != null ? landInfo.getLandSubNumber() : "-");
            allInfo.setLandCategoryName(landInfo.getLandCategoryName() != null ? landInfo.getLandCategoryName() : "-");
            allInfo.setLandArea(landInfo.getLandArea() != null ? landInfo.getLandArea() : "-");
            allInfo.setMainPurposeName(landInfo.getMainPurposeName() != null ? landInfo.getMainPurposeName() : "-");
            allInfo.setSubPurposeName(landInfo.getSubPurposeName() != null ? landInfo.getSubPurposeName() : "-");
            allInfo.setLandUseSituation(landInfo.getLandUseSituation() != null ? landInfo.getLandUseSituation() : "-");
            allInfo.setTerrainHeight(landInfo.getTerrainHeight() != null ? landInfo.getTerrainHeight() : "-");
            allInfo.setTerrainShape(landInfo.getTerrainShape() != null ? landInfo.getTerrainShape() : "-");
            allInfo.setRoadSide(landInfo.getRoadSide() != null ? landInfo.getRoadSide() : "-");
        }
        // 건물정보
        if (buildingInfo != null) {
            allInfo.setBuildingName(buildingInfo.getBuildingName() != null ? buildingInfo.getBuildingName() : "-");
            allInfo.setSiteArea(buildingInfo.getSiteArea() != null ? buildingInfo.getSiteArea() : "-");
            allInfo.setBuildingArea(buildingInfo.getBuildingArea() != null ? buildingInfo.getBuildingArea() : "-");
            allInfo.setTotalFloorArea(buildingInfo.getTotalFloorArea() != null ? buildingInfo.getTotalFloorArea() : "-");
            allInfo.setFloorAreaRatio(buildingInfo.getFloorAreaRatio() != null ? buildingInfo.getFloorAreaRatio() : "-");
            allInfo.setBuildingToLandRatio(buildingInfo.getBuildingToLandRatio() != null ? buildingInfo.getBuildingToLandRatio() : "-");
            allInfo.setStructureName(buildingInfo.getStructureName() != null ? buildingInfo.getStructureName() : "-");
            allInfo.setBuildingMainPurposeName(buildingInfo.getBuildingMainPurposeName() != null ? buildingInfo.getBuildingMainPurposeName() : "-");
            allInfo.setDetailPurposeCode(buildingInfo.getDetailPurposeCode() != null ? buildingInfo.getDetailPurposeCode() : "-");
            allInfo.setDetailPurposeName(buildingInfo.getDetailPurposeName() != null ? buildingInfo.getDetailPurposeName() : "-");
            allInfo.setBuildingPurposeClassification(buildingInfo.getBuildingPurposeClassification() != null ? buildingInfo.getBuildingPurposeClassification() : "-");
            allInfo.setBuildingHeight(buildingInfo.getBuildingHeight() != null ? buildingInfo.getBuildingHeight() : "-");
            allInfo.setGroundFloor(buildingInfo.getGroundFloor() != null ? buildingInfo.getGroundFloor() : "-");
            allInfo.setUndergroundFloor(buildingInfo.getUndergroundFloor() != null ? buildingInfo.getUndergroundFloor() : "-");
            allInfo.setPermitDate(buildingInfo.getPermitDate() != null ? buildingInfo.getPermitDate() : "-");
            allInfo.setUseConfirmDate(buildingInfo.getUseConfirmDate() != null ? buildingInfo.getUseConfirmDate() : "-");
        }
        // 소유정보
        if (landOwnInfo != null) {
            allInfo.setLandShare(landOwnInfo.getLandShare() != null ? landOwnInfo.getLandShare() : "-");
            allInfo.setPossession(landOwnInfo.getPossession() != null ? landOwnInfo.getPossession() : "-");
            allInfo.setOwnershipChangeDate(landOwnInfo.getOwnershipChangeDate() != null ? landOwnInfo.getOwnershipChangeDate() : "-");
        }
        // 개별공시지가
        if (landPrice != null) {
            allInfo.setGovAssessedLandPrice(landPrice.getGovAssessedLandPrice() != null ? landPrice.getGovAssessedLandPrice() : "-");
            allInfo.setLandPriceStandardYear(landPrice.getLandPriceStandardYear() != null ? landPrice.getLandPriceStandardYear() : "-");
            allInfo.setLandPriceStandardMonth(landPrice.getLandPriceStandardMonth() != null ? landPrice.getLandPriceStandardMonth() : "-");
        }
        // 개별주택가격
        if (buildingPrice != null) {
            allInfo.setHousePrice(buildingPrice.getHousePrice() != null ? buildingPrice.getHousePrice() : "-");
            allInfo.setHousePriceStandardYear(buildingPrice.getHousePriceStandardYear() != null ? buildingPrice.getHousePriceStandardYear() : "-");
            allInfo.setHousePriceStandardMonth(buildingPrice.getHousePriceStandardMonth() != null ? buildingPrice.getHousePriceStandardMonth() : "-");
        }
        // 공공주택가격
        if (apartPrice != null) {
            allInfo.setApartPriceInfo(apartPrice.getApartPriceInfo() != null ? apartPrice.getApartPriceInfo() : "-");
        }
        // 좌표값
        allInfo.setLatitude(landCoordinate.getLatitude());
        allInfo.setLongitude(landCoordinate.getLongitude());
        // 저장 수, 리뷰 갯수
        allInfo.setSaveCount(this.landSaveMapper.selectLandSaveCountByPnu(pnu));
        allInfo.setReviewCount(this.landReviewMapper.selectLandReviewCountByPnu(pnu));
        return allInfo;
    }

    private AddressInfoEntity addressInfoDtoToEntity(String pnu, AddressInfoDto addressInfoDto, AddressInfoEntity addressInfo) {
        addressInfo.setPnu(pnu);
        addressInfo.setAddressName(addressInfoDto.getAddressName());
        addressInfo.setRoadAddressName(addressInfoDto.getRoadAddressName());
        addressInfo.setUpdatedAt(LocalDateTime.now());
        return addressInfo;
    }

    private LandInfoEntity landInfoDtoListToEntity(String pnu, List<LandInfoDto> landInfoDtoList, LandInfoEntity landInfo) {
        if (landInfoDtoList == null || landInfoDtoList.isEmpty()) {
            landInfo.setPnu(pnu);
            landInfo.setUpdatedAt(LocalDateTime.now());
        }
        if (!landInfoDtoList.isEmpty()) {
            LandInfoDto landInfoDto = landInfoDtoList.get(0);
            landInfo.setPnu(landInfoDto.getPnu());
            landInfo.setLandMainNumber(landInfoDto.getLandMainNumber());
            landInfo.setLandSubNumber(landInfoDto.getLandSubNumber());
            landInfo.setLandCategoryName(landInfoDto.getLandCategoryName());
            landInfo.setLandArea(landInfoDto.getLandArea());
            landInfo.setMainPurposeName(landInfoDto.getMainPurposeName());
            landInfo.setSubPurposeName(landInfoDto.getSubPurposeName());
            landInfo.setLandUseSituation(landInfoDto.getLandUseSituation());
            landInfo.setTerrainHeight(landInfoDto.getTerrainHeight());
            landInfo.setTerrainShape(landInfoDto.getTerrainShape());
            landInfo.setRoadSide(landInfoDto.getRoadSide());
            landInfo.setUpdatedAt(LocalDateTime.now());
        }
        return landInfo;
    }

    private BuildingInfoEntity buildingInfoDtoListToEntity(String pnu, List<BuildingInfoDto> buildingInfoDtoList, BuildingInfoEntity buildingInfo) {
        if (buildingInfoDtoList == null || buildingInfoDtoList.isEmpty()) {
            buildingInfo.setPnu(pnu);
            buildingInfo.setUpdatedAt(LocalDateTime.now());
        }
        if (!buildingInfoDtoList.isEmpty()) {
            BuildingInfoDto buildingInfoDto = buildingInfoDtoList.get(0);
            buildingInfo.setPnu(buildingInfoDto.getPnu());
            buildingInfo.setBuildingName(buildingInfoDto.getBuildingName());
            buildingInfo.setSiteArea(buildingInfoDto.getSiteArea());
            buildingInfo.setBuildingArea(buildingInfoDto.getBuildingArea());
            buildingInfo.setTotalFloorArea(buildingInfoDto.getTotalFloorArea());
            buildingInfo.setFloorAreaRatio(buildingInfoDto.getFloorAreaRatio());
            buildingInfo.setBuildingToLandRatio(buildingInfoDto.getBuildingToLandRatio());
            buildingInfo.setStructureName(buildingInfoDto.getStructureName());
            buildingInfo.setBuildingMainPurposeName(buildingInfoDto.getBuildingMainPurposeName());
            buildingInfo.setDetailPurposeCode(buildingInfoDto.getDetailPurposeCode());
            buildingInfo.setDetailPurposeName(buildingInfoDto.getDetailPurposeName());
            buildingInfo.setBuildingPurposeClassification(buildingInfoDto.getBuildingPurposeClassification());
            buildingInfo.setBuildingHeight(buildingInfoDto.getBuildingHeight());
            buildingInfo.setGroundFloor(buildingInfoDto.getGroundFloor());
            buildingInfo.setUndergroundFloor(buildingInfoDto.getUndergroundFloor());
            buildingInfo.setPermitDate(buildingInfoDto.getPermitDate());
            buildingInfo.setUseConfirmDate(buildingInfoDto.getUseConfirmDate());
            buildingInfo.setUpdatedAt(LocalDateTime.now());
        }
        return buildingInfo;
    }

    private LandOwnInfoEntity landOwnInfoDtoListToEntity(String pnu, List<LandOwnInfoDto> landOwnInfoDtoList, LandOwnInfoEntity landOwnInfo) {
        if (landOwnInfoDtoList == null || landOwnInfoDtoList.isEmpty()) {
            landOwnInfo.setPnu(pnu);
            landOwnInfo.setUpdatedAt(LocalDateTime.now());
        }
        if (!landOwnInfoDtoList.isEmpty()) {
            LandOwnInfoDto landOwnInfoDto = landOwnInfoDtoList.get(0);
            landOwnInfo.setPnu(landOwnInfoDto.getPnu());
            landOwnInfo.setLandShare(landOwnInfoDto.getLandShare());
            landOwnInfo.setPossession(landOwnInfoDto.getPossession());
            landOwnInfo.setOwnershipChangeDate(landOwnInfoDto.getOwnershipChangeDate());
            landOwnInfo.setUpdatedAt(LocalDateTime.now());
        }
        return landOwnInfo;
    }

    private LandPriceEntity landPriceDtoListToEntity(String pnu, List<LandPriceDto> landPriceDtoList, LandPriceEntity landPrice) {
        if (landPriceDtoList == null || landPriceDtoList.isEmpty()) {
            landPrice.setPnu(pnu);
            landPrice.setUpdatedAt(LocalDateTime.now());
        }
        if (!landPriceDtoList.isEmpty()) {
            LandPriceDto landPriceDto = landPriceDtoList.get(0);
            landPrice.setPnu(landPriceDto.getPnu());
            landPrice.setGovAssessedLandPrice(landPriceDto.getGovAssessedLandPrice());
            landPrice.setLandPriceStandardYear(landPriceDto.getLandPriceStandardYear());
            landPrice.setLandPriceStandardMonth(landPriceDto.getLandPriceStandardMonth());
            landPrice.setUpdatedAt(LocalDateTime.now());
        }
        return landPrice;
    }

    private BuildingPriceEntity buildingPriceDtoListToEntity(String pnu, List<BuildingPriceDto> buildingPriceDtoList, BuildingPriceEntity buildingPrice) {
        if (buildingPriceDtoList == null || buildingPriceDtoList.isEmpty()) {
            buildingPrice.setPnu(pnu);
            buildingPrice.setUpdatedAt(LocalDateTime.now());
        }
        if (!buildingPriceDtoList.isEmpty()) {
            BuildingPriceDto buildingPriceDto = buildingPriceDtoList.get(0);
            buildingPrice.setPnu(buildingPriceDto.getPnu());
            buildingPrice.setHousePrice(buildingPriceDto.getHousePrice());
            buildingPrice.setHousePriceStandardYear(buildingPriceDto.getHousePriceStandardYear());
            buildingPrice.setHousePriceStandardMonth(buildingPriceDto.getHousePriceStandardMonth());
            buildingPrice.setUpdatedAt(LocalDateTime.now());
        }
        return buildingPrice;
    }

    private ApartPriceEntity apartPriceDtoListToEntity(String pnu, List<ApartPriceDto> apartPriceDtoList, ApartPriceEntity apartPrice) {
        // Gson 객체 생성
        Gson gson = new Gson();
        // Json 배열을 저장할 JsonArray 생성
        JsonArray jsonArray = new JsonArray();
        // apartPriceDtoList가 비어있지 않은 경우
        if (apartPriceDtoList != null && !apartPriceDtoList.isEmpty()) {
            for (ApartPriceDto dto : apartPriceDtoList) {
                // JsonObject 생성
                JsonObject jsonObject = new JsonObject();
                jsonObject.addProperty("apartPriceStandardYear", dto.getApartPriceStandardYear());
                jsonObject.addProperty("apartPriceStandardMonth", dto.getApartPriceStandardMonth());
                jsonObject.addProperty("averagePrice", dto.getAveragePrice());
                jsonObject.addProperty("allPrice", dto.getAllPrice());
                // JsonObject를 JsonArray에 추가
                jsonArray.add(jsonObject);
            }
        }
        // apartPrice 엔티티에 값 설정
        apartPrice.setPnu(pnu);
        apartPrice.setApartPriceInfo(gson.toJson(jsonArray)); // JsonArray를 문자열로 변환하여 설정
        apartPrice.setUpdatedAt(LocalDateTime.now());
        return apartPrice;
    }

    private AddressInfoDto getAddress(String pnu, JSONObject sb2JSON) {
        JSONArray documentArray = sb2JSON.getJSONArray("documents");
        String roadAddressName = "";
        // documents 배열의 첫 번째 요소가 존재하고 그 안에 address 오브젝트가 있는 경우에만 처리
        if (documentArray.length() > 0 && documentArray.getJSONObject(0).has("address")) {
            JSONObject addressObject = documentArray.getJSONObject(0).getJSONObject("address");
            // 주소 정보 추출
            String addressName = addressObject.getString("address_name");

            if (documentArray.getJSONObject(0).has("road_address") &&
                    !documentArray.getJSONObject(0).isNull("road_address") &&
                    documentArray.getJSONObject(0).get("road_address") instanceof JSONObject) {
                JSONObject roadAddressObject = documentArray.getJSONObject(0).getJSONObject("road_address");

                if (roadAddressObject.has("address_name") && !roadAddressObject.isNull("address_name")) {
                    roadAddressName = roadAddressObject.getString("address_name");
                }
            }
            return new AddressInfoDto(pnu, addressName, roadAddressName);
        }
        return new AddressInfoDto(pnu, "", roadAddressName);
    }
}
