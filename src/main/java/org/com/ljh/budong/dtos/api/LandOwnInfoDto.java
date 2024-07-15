package org.com.ljh.budong.dtos.api;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class LandOwnInfoDto {

    private String pnu;
    private String landShare;               // 공유인수
    private String possession;              // 소유 구분 코드
    private String ownershipChangeDate;     // 소유권 변동 일자

    public LandOwnInfoDto(String pnu, String landShare, String possession, String ownershipChangeDate) {
        this.pnu = pnu;
        this.landShare = landShare;
        this.possession = possession;
        this.ownershipChangeDate = ownershipChangeDate;
    }
}
