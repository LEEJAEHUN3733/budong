package org.com.ljh.budong.dtos.api;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class LandInfoDto {

    private String pnu;                 // 고유번호
    private String landMainNumber;      // 본번
    private String landSubNumber;       // 부번
    private String landCategoryName;    // 지목명
    private String landArea;            // 면적
    private String mainPurposeName;     // 용도지역명
    private String subPurposeName;      // 지역지구 등 지정여부
    private String landUseSituation;    // 이용상황
    private String terrainHeight;       // 지형높이
    private String terrainShape;        // 지형형상
    private String roadSide;            // 도로접면

    public LandInfoDto(String pnu, String landMainNumber, String landSubNumber, String landCategoryName, String landArea, String mainPurposeName, String subPurposeName, String landUseSituation, String terrainHeight, String terrainShape, String roadSide) {
        this.pnu = pnu;
        this.landMainNumber = landMainNumber;
        this.landSubNumber = landSubNumber;
        this.landCategoryName = landCategoryName;
        this.landArea = landArea;
        this.mainPurposeName = mainPurposeName;
        this.subPurposeName = subPurposeName;
        this.landUseSituation = landUseSituation;
        this.terrainHeight = terrainHeight;
        this.terrainShape = terrainShape;
        this.roadSide = roadSide;
    }
}
