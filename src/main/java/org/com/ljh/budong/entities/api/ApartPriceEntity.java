package org.com.ljh.budong.entities.api;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(of = "pnu")
public class ApartPriceEntity {
    private String pnu;
    private String apartPriceInfo;              // 기준년도, 기준월, 평균공시가격, 전체공시가격
    private LocalDateTime updatedAt;            // 갱신날짜
}
