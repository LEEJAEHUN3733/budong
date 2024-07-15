package org.com.ljh.budong.entities.api;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(of = "pnu")
public class LandInfoEntity {
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
    private LocalDateTime updatedAt;    // 갱신일자
}
