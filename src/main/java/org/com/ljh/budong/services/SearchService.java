package org.com.ljh.budong.services;

import org.com.ljh.budong.dtos.AddressDto;
import org.com.ljh.budong.dtos.SearchDto;
import org.com.ljh.budong.mappers.LandReviewMapper;
import org.com.ljh.budong.mappers.LandSaveMapper;
import org.com.ljh.budong.mappers.SearchMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SearchService {
    private final SearchMapper searchMapper;
    private final LandReviewMapper landReviewMapper;
    private final LandSaveMapper landSaveMapper;

    @Autowired
    public SearchService(SearchMapper searchMapper, LandReviewMapper landReviewMapper, LandSaveMapper landSaveMapper) {
        this.searchMapper = searchMapper;
        this.landReviewMapper = landReviewMapper;
        this.landSaveMapper = landSaveMapper;
    }

    public AddressDto[] getLands(SearchDto search) {
        // 페이지네이션
        search.setTotalCount(this.searchMapper.selectAddressCountBySearch(search));
        search.setMaxPage(search.getTotalCount() / search.getCountPerPage() + (search.getTotalCount() % search.getCountPerPage() == 0 ? 0 : 1));
        search.setMinPage(1);
        search.setOffset(search.getCountPerPage() * (search.getRequestPage() - 1));
        // 검색결과가 6페이지를 넘길 시 초과 설정 후 MaxPage 6으로 고정
        if (search.getTotalCount() > 48) {
            search.setExceed(true);
            search.setMaxPage(6);
        }
        // 불러오기
        AddressDto[] addresses = this.searchMapper.selectAddressBySearch(search);
        // 조회수 및 저장수 넣기
        for (int i = 0; i < addresses.length; i++) {
            AddressDto address = addresses[i];
            address.setReviewCount(landReviewMapper.selectLandReviewCountByPnu(address.getPnu()));
            address.setSaveCount(landSaveMapper.selectLandSaveCountByPnu(address.getPnu()));
        }
        return addresses;
    }
}
