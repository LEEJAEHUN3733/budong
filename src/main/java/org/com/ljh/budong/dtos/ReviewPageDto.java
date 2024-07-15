package org.com.ljh.budong.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReviewPageDto {
    private String pnu;

    private int countPerPage = 3;
    private int requestPage;        // 요청한 페이지 정보
    private int totalCount;         // 전체 리뷰 개수
    private int maxPage;            // 최대 페이지
    private int minPage = 1;        // 최소 페이지
    private int offset;             // 거를 게시글 개수
}
