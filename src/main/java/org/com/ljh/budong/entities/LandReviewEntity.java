package org.com.ljh.budong.entities;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(of = "index")
public class LandReviewEntity {
    private int index;
    private String landReviewPnu;
    private String userEmail;
    private int rating;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
}
