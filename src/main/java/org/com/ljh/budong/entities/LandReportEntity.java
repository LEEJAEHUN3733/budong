package org.com.ljh.budong.entities;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(of = {"pnu", "userEmail"})
public class LandReportEntity {
    private String pnu;
    private String userEmail;
    private LocalDateTime createdAt;
}
