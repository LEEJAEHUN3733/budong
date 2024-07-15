package org.com.ljh.budong.entities.api;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(of = "pnu")
public class LandCoordinateEntity {
    private String pnu;
    private double latitude;
    private double longitude;
}
