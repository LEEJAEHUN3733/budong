package org.com.ljh.budong.dtos.api;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AllInfoDto {

    private String pnu;                             // 고유번호
    // 주소정보
    private String addressName;                     // 본 주소
    private String roadAddressName;                 // 도로명 주소
    // 토지정보
    private String landMainNumber;                  // 본번
    private String landSubNumber;                   // 부번
    private String landCategoryName;                // 지목명
    private String landArea;                        // 면적
    private String mainPurposeName;                 // 용도지역명
    private String subPurposeName;                  // 지역지구 등 지정여부
    private String landUseSituation;                // 이용상황
    private String terrainHeight;                   // 지형높이
    private String terrainShape;                    // 지형형상
    private String roadSide;                        // 도로접면
    // 건물정보
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
    // 소유정보
    private String landShare;                       // 공유인수
    private String possession;                      // 소유 구분 코드
    private String ownershipChangeDate;             // 소유권 변동 일자
    // 개별공시지가
    private String govAssessedLandPrice;            // 개별공시지가
    private String landPriceStandardYear;           // 기준년도
    private String landPriceStandardMonth;          // 기준월
    // 개별주택가격
    private String housePrice;                      // 개별주택가격
    private String housePriceStandardYear;          // 기준년도
    private String housePriceStandardMonth;         // 기준월
    // 공공주택가격
    private String apartPriceInfo;
    // 저장한 사람 수, 리뷰 갯수
    private int saveCount;
    private int reviewCount;
    // 클릭했을때 좌표 등록
    private double latitude;
    private double longitude;

    // 로그인 해 있는지
    private boolean isSigned;
    // 이미 저장했는지
    private boolean isSaved;
    // 알림 설정했는지
    private boolean isSavedAlarm;
}
