package org.com.ljh.budong.entities;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(of = "index")
public class LandReviewImageEntity {
    private int index;
    private int landReviewIndex;
    private byte[] data;
    private String name;
    private String contentType;
}
