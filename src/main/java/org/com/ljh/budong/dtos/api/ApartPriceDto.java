package org.com.ljh.budong.dtos.api;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ApartPriceDto {

    private String pnu;
    private String apartPriceStandardYear;      // 기준년도
    private String apartPriceStandardMonth;     // 기준월
    private String averagePrice;                // 평균공시가격
    private String allPrice;                    // 전체공시가격

    public ApartPriceDto(String pnu, String apartPriceStandardYear, String apartPriceStandardMonth, String averagePrice, String allPrice) {
        this.pnu = pnu;
        this.apartPriceStandardYear = apartPriceStandardYear;
        this.apartPriceStandardMonth = apartPriceStandardMonth;
        this.averagePrice = averagePrice;
        this.allPrice = allPrice;
    }
}
