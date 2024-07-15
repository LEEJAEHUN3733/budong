package org.com.ljh.budong.entities.api;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(of = "pnu")
public class AddressInfoEntity {
    private String pnu;
    private String addressName;
    private String roadAddressName;
    private LocalDateTime updatedAt;
}
