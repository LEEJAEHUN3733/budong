package org.com.ljh.budong.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SearchDto {
    private String by;
    private String keyword;

    private int countPerPage = 8;
    private int requestPage;        // 요청한 페이지 정보
    private int totalCount;         // 전체 검색 개수
    private int maxPage = 6;        // 최대 페이지
    private int minPage = 1;        // 최소 페이지
    private int offset;             // 거를 대지 개수

    private boolean isExceed;
}
