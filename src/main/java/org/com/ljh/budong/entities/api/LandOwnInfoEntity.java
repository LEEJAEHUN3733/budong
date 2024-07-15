package org.com.ljh.budong.entities.api;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(of = "pnu")
public class LandOwnInfoEntity {
    private String pnu;
    private String landShare;               // 공유인수
    private String possession;              // 소유 구분 코드
    private String ownershipChangeDate;     // 소유권 변동 일자
    private LocalDateTime updatedAt;        // 갱신일자
}
