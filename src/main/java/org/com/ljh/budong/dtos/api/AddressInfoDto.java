package org.com.ljh.budong.dtos.api;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AddressInfoDto {
    private String pnu;
    private String addressName;
    private String roadAddressName;

    public AddressInfoDto(String pnu, String addressName, String roadAddressName) {
        this.pnu = pnu;
        this.addressName = addressName;
        this.roadAddressName = roadAddressName;
    }
}
