package org.com.ljh.budong.entities.api;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(of = "pnu")
public class LandPriceEntity {
    private String pnu;
    private String govAssessedLandPrice;        // 개별공시지가
    private String landPriceStandardYear;       // 기준년도
    private String landPriceStandardMonth;      // 기준월
    private LocalDateTime updatedAt;            // 갱신일자
}
