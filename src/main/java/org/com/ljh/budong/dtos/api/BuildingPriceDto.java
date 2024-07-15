package org.com.ljh.budong.dtos.api;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class BuildingPriceDto {

    private String pnu;     
    private String housePrice;                      // 개별주택가격
    private String housePriceStandardYear;          // 기준년도
    private String housePriceStandardMonth;         // 기준월

    public BuildingPriceDto(String pnu, String housePrice, String housePriceStandardYear, String housePriceStandardMonth) {
        this.pnu = pnu;
        this.housePrice = housePrice;
        this.housePriceStandardYear = housePriceStandardYear;
        this.housePriceStandardMonth = housePriceStandardMonth;
    }
}
