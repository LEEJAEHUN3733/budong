package org.com.ljh.budong.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.com.ljh.budong.entities.api.AddressInfoEntity;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AddressDto extends AddressInfoEntity {
    private String buildingName;
    private int reviewCount;
    private int saveCount;
}
