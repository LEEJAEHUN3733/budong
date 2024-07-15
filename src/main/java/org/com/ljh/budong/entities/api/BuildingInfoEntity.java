package org.com.ljh.budong.entities.api;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(of = "pnu")
public class BuildingInfoEntity {
    private String pnu;
    private String buildingName;                    // 건물명
    private String siteArea;                        // 대지면적
    private String buildingArea;                    // 건축면적
    private String totalFloorArea;                  // 연면적
    private String floorAreaRatio;                  // 용적율
    private String buildingToLandRatio;             // 건폐율
    private String structureName;                   // 건축물구조명
    private String buildingMainPurposeName;         // 주요용도명
    private String detailPurposeCode;               // 세부용도코드
    private String detailPurposeName;               // 세부용도명
    private String buildingPurposeClassification;   // 용도분류명
    private String buildingHeight;                  // 건물높이
    private String groundFloor;                     // 지상층수
    private String undergroundFloor;                // 지하층수
    private String permitDate;                      // 허가일자
    private String useConfirmDate;                  // 사용승인일자
    private LocalDateTime updatedAt;                // 갱신일자
}
