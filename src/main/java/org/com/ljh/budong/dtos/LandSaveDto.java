package org.com.ljh.budong.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.com.ljh.budong.entities.LandSaveEntity;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LandSaveDto extends LandSaveEntity {
    private String landAddressName;
    private String landRoadAddressName;
    private String landBuildingName;
}
