package org.com.ljh.budong.entities;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(of = {"landAlarmPnu", "userEmail"})
public class LandAlarmEntity {
    private String landAlarmPnu;
    private String userEmail;
    private LocalDateTime createdAt;
}
