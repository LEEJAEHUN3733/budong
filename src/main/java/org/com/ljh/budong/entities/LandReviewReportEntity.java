package org.com.ljh.budong.entities;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(of = {"landReviewIndex", "userEmail"})
public class LandReviewReportEntity {
    private int landReviewIndex;
    private String userEmail;
    private LocalDateTime createdAt;
}
