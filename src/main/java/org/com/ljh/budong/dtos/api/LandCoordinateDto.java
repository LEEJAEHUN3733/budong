package org.com.ljh.budong.dtos.api;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class LandCoordinateDto {
    private double latitude;
    private double longitude;

    public LandCoordinateDto(double latitude, double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
