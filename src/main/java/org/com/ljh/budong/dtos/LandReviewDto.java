package org.com.ljh.budong.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.com.ljh.budong.entities.LandReviewEntity;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LandReviewDto extends LandReviewEntity {
    private String userNickname;
    private String LandAddress;
    private int[] imageIndexes;
    private boolean isSigned;
    private boolean isMine;
    private int requestPage;
}
