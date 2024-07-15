package org.com.ljh.budong.entities.api;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(of = "pnu")
public class BuildingPriceEntity {
    private String pnu;
    private String housePrice;                      // 개별주택가격
    private String housePriceStandardYear;          // 기준년도
    private String housePriceStandardMonth;         // 기준월
    private LocalDateTime updatedAt;                // 갱신일자
}
