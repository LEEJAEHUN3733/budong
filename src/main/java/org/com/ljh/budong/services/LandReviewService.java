package org.com.ljh.budong.services;

import org.com.ljh.budong.dtos.LandReviewDto;
import org.com.ljh.budong.dtos.ReviewPageDto;
import org.com.ljh.budong.entities.LandReviewEntity;
import org.com.ljh.budong.entities.LandReviewImageEntity;
import org.com.ljh.budong.entities.LandReviewReportEntity;
import org.com.ljh.budong.entities.UserEntity;
import org.com.ljh.budong.mappers.LandReviewMapper;
import org.com.ljh.budong.regexes.LandReviewRegex;
import org.com.ljh.budong.regexes.UserRegex;
import org.com.ljh.budong.results.CommonResult;
import org.com.ljh.budong.results.ReportResult;
import org.com.ljh.budong.results.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LandReviewService {
    private final LandReviewMapper landReviewMapper;

    @Autowired
    public LandReviewService(LandReviewMapper landReviewMapper) {
        this.landReviewMapper = landReviewMapper;
    }

    @Transactional
    public Result add(LandReviewEntity landReview, LandReviewImageEntity[] landReviewImages) {
        if (!UserRegex.email.tests(landReview.getUserEmail()) ||
            !LandReviewRegex.content.tests(landReview.getContent())) {
            return CommonResult.FAILURE;
        }
        landReview.setCreatedAt(LocalDateTime.now());
        landReview.setModifiedAt(null);
        if (this.landReviewMapper.insertLandReview(landReview) == 0) {
            return CommonResult.FAILURE;
        }
        for (LandReviewImageEntity landReviewImage : landReviewImages) {
            landReviewImage.setLandReviewIndex(landReview.getIndex());
            if (this.landReviewMapper.insertLandReviewImage(landReviewImage) == 0) {
                throw new RuntimeException();
            }
        }
        return CommonResult.SUCCESS;
    }


    public LandReviewDto[] getReviews(UserEntity user, ReviewPageDto reviewPageDto) {
        if (reviewPageDto.getPnu() == null && user == null) {
            return new LandReviewDto[0];
        }
        // 마이페이지 리뷰 조회(링크에 pnu 미포함, 유저 로그인 상태)
        if (reviewPageDto.getPnu() == null && user != null) {
            // 페이지네이션
            reviewPageDto.setTotalCount(this.landReviewMapper.selectLandReviewCountByPageDto(reviewPageDto, user.getEmail()));
            reviewPageDto.setMaxPage(reviewPageDto.getTotalCount() / reviewPageDto.getCountPerPage() + (reviewPageDto.getTotalCount() % reviewPageDto.getCountPerPage() == 0 ? 0 : 1));
            reviewPageDto.setMinPage(1);
            reviewPageDto.setOffset(reviewPageDto.getCountPerPage() * (reviewPageDto.getRequestPage() - 1));

            LandReviewDto[] landReviews = this.landReviewMapper.selectLandReviewByPageDto(reviewPageDto, user.getEmail());
            for (LandReviewDto landReview : landReviews) {
                LandReviewImageEntity[] landReviewImages = this.landReviewMapper.selectLandReviewByLandReviewIndex(landReview.getIndex(), true);
                int[] imageIndexes = new int[landReviewImages.length];
                for (int i = 0; i < landReviewImages.length; i++) {
                    imageIndexes[i] = landReviewImages[i].getIndex();
                }
                landReview.setRequestPage(reviewPageDto.getRequestPage());
                landReview.setImageIndexes(imageIndexes);
                landReview.setSigned(true);
                landReview.setMine(true);
            }
            return landReviews;
        }

        // detailAside 리뷰 조회(로그인 여부 상관x pnu 필요함)
        // 페이지네이션
        reviewPageDto.setTotalCount(this.landReviewMapper.selectLandReviewCountByPageDto(reviewPageDto, null));
        reviewPageDto.setMaxPage(reviewPageDto.getTotalCount() / reviewPageDto.getCountPerPage() + (reviewPageDto.getTotalCount() % reviewPageDto.getCountPerPage() == 0 ? 0 : 1));
        reviewPageDto.setMinPage(1);
        reviewPageDto.setOffset(reviewPageDto.getCountPerPage() * (reviewPageDto.getRequestPage() - 1));

        LandReviewDto[] landReviews = this.landReviewMapper.selectLandReviewByPageDto(reviewPageDto, null);
        for (LandReviewDto landReview : landReviews) {
            LandReviewImageEntity[] landReviewImages = this.landReviewMapper.selectLandReviewByLandReviewIndex(landReview.getIndex(), true);
            int[] imageIndexes = new int[landReviewImages.length];
            for (int i = 0; i < landReviewImages.length; i++) {
                imageIndexes[i] = landReviewImages[i].getIndex();
            }
            landReview.setRequestPage(reviewPageDto.getRequestPage());
            landReview.setImageIndexes(imageIndexes);
            landReview.setSigned(user != null);
            landReview.setMine(user != null && user.getEmail().equals(landReview.getUserEmail()));
        }
        return landReviews;
    }

    public LandReviewDto getReview(UserEntity user, int index) {
        LandReviewDto landReview = this.landReviewMapper.selectLandReviewByIndex(index);
        LandReviewImageEntity[] landReviewImages = this.landReviewMapper.selectLandReviewByLandReviewIndex(index, true);
        int[] imageIndexes = new int[landReviewImages.length];
        for (int i = 0; i < landReviewImages.length; i++) {
            imageIndexes[i] = landReviewImages[i].getIndex();
        }
        landReview.setImageIndexes(imageIndexes);
        landReview.setSigned(user != null);
        landReview.setMine(user != null && user.getEmail().equals(landReview.getUserEmail()));
        return landReview;
    }

    public LandReviewImageEntity getImage(int index) {
        if (index < 0) {
            return null;
        }
        return this.landReviewMapper.selectLandReviewImage(index);
    }

    public int[] getIndexes(String pnu) {
        LandReviewEntity[] landReviews = this.landReviewMapper.selectLandReviewByPnu(pnu);
        int[] reviewIndexes = new int[landReviews.length];
        for (int i = 0; i < landReviews.length; i++) {
            reviewIndexes[i] = landReviews[i].getIndex();
        }
        return reviewIndexes;
    }

    public Result delete(UserEntity user, int index) {
        if (user == null || index < 1) {
            return CommonResult.FAILURE;
        }
        LandReviewEntity dbLandReview = this.landReviewMapper.selectLandReview(index);
        if (dbLandReview == null || !dbLandReview.getUserEmail().equals(user.getEmail())) {
            return CommonResult.FAILURE;
        }
        return this.landReviewMapper.deleteLandReview(index) > 0
                ? CommonResult.SUCCESS
                : CommonResult.FAILURE;
    }

    public Result report(UserEntity user, int index) {
        if (user == null || index < 0) {
            return CommonResult.FAILURE;
        }
        if (this.landReviewMapper.selectLandReviewReport(index, user.getEmail()) != null) {
            return ReportResult.FAILURE_DUPLICATE;
        }
        LandReviewReportEntity landReviewReport = new LandReviewReportEntity();
        landReviewReport.setLandReviewIndex(index);
        landReviewReport.setUserEmail(user.getEmail());
        landReviewReport.setCreatedAt(LocalDateTime.now());
        return this.landReviewMapper.insertLandReviewReport(landReviewReport) > 0
                ? CommonResult.SUCCESS
                : CommonResult.FAILURE;
    }

    @Transactional
    public Result modify(LandReviewEntity landReview, LandReviewImageEntity[] landReviewImages, int[] remainReviewImageIndexes) {
        // 정규화
        if (!UserRegex.email.tests(landReview.getUserEmail()) ||
                !LandReviewRegex.content.tests(landReview.getContent())) {
            return CommonResult.FAILURE;
        }
        LandReviewEntity dbLandReview = this.landReviewMapper.selectLandReview(landReview.getIndex());
        if (dbLandReview == null) {
            return CommonResult.FAILURE;
        }
        dbLandReview.setLandReviewPnu(landReview.getLandReviewPnu());
        dbLandReview.setRating(landReview.getRating());
        dbLandReview.setContent(landReview.getContent());
        dbLandReview.setModifiedAt(LocalDateTime.now());
        if (this.landReviewMapper.updateLandReview(dbLandReview) == 0) {
            return CommonResult.FAILURE;
        }
        // 남겨놓을 이미지가 있을때 그 이미지를 제외한 나머지 이미지 삭제
        if (remainReviewImageIndexes != null) {
            LandReviewImageEntity[] allLandReviewImages = this.landReviewMapper.selectLandReviewByLandReviewIndex(landReview.getIndex(), true);
            for (LandReviewImageEntity landReviewImage : allLandReviewImages) {
                if (!containsIndex(remainReviewImageIndexes, landReviewImage.getIndex())) {
                    if (this.landReviewMapper.deleteLandReviewImage(landReviewImage.getIndex()) == 0) {
                        return CommonResult.FAILURE;
                    }
                }
            }
        }
        // remainReviewImageIndexes == null => 이미지 전체 삭제
        if (remainReviewImageIndexes == null) {
            LandReviewImageEntity[] allLandReviewImages = this.landReviewMapper.selectLandReviewByLandReviewIndex(landReview.getIndex(), true);
            for (LandReviewImageEntity landReviewImage : allLandReviewImages) {
                if (this.landReviewMapper.deleteLandReviewImage(landReviewImage.getIndex()) == 0) {
                    return CommonResult.FAILURE;
                }
            }
        }
        // 새로 추가할 이미지가 있을때 새로 이미지 추가
        if (landReviewImages != null) {
            for (LandReviewImageEntity landReviewImage : landReviewImages) {
                landReviewImage.setLandReviewIndex(landReview.getIndex());
                if (this.landReviewMapper.insertLandReviewImage(landReviewImage) == 0) {
                    throw new RuntimeException();
                }
            }
        }
        return CommonResult.SUCCESS;
    }

    private boolean containsIndex(int[] remainReviewImageIndexes, int index) {
        for (int remainReviewImageIndex : remainReviewImageIndexes) {
            if (remainReviewImageIndex == index) {
                return true;
            }
        }
        return false;
    }


}
