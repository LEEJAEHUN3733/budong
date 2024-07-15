package org.com.ljh.budong.dtos.api;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class LandPriceDto {

    private String pnu;
    private String govAssessedLandPrice;        // 개별공시지가
    private String landPriceStandardYear;       // 기준년도
    private String landPriceStandardMonth;      // 기준월

    public LandPriceDto(String pnu, String govAssessedLandPrice, String landPriceStandardYear, String landPriceStandardMonth) {
        this.pnu = pnu;
        this.govAssessedLandPrice = govAssessedLandPrice;
        this.landPriceStandardYear = landPriceStandardYear;
        this.landPriceStandardMonth = landPriceStandardMonth;
    }
}
