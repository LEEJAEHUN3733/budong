package org.com.ljh.budong.mappers;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.com.ljh.budong.dtos.LandReviewDto;
import org.com.ljh.budong.dtos.ReviewPageDto;
import org.com.ljh.budong.entities.LandReviewEntity;
import org.com.ljh.budong.entities.LandReviewImageEntity;
import org.com.ljh.budong.entities.LandReviewReportEntity;
import org.com.ljh.budong.entities.UserProfileImageEntity;

@Mapper
public interface LandReviewMapper {
    int deleteLandReview(@Param("index") int index);

    int deleteLandReviewImage(@Param("index") int index);

    int insertLandReview(LandReviewEntity landReview);

    int insertLandReviewImage(LandReviewImageEntity landReviewImage);

    int insertLandReviewReport(LandReviewReportEntity landReviewReport);

    LandReviewEntity[] selectLandReviewByPnu(@Param("pnu") String pnu);

    int selectLandReviewCountByPnu(@Param("pnu") String pnu);

    LandReviewEntity selectLandReview(@Param("index") int index);

    LandReviewDto[] selectLandReviewByPageDto(ReviewPageDto reviewPageDto,
                                              @Param("userEmail") String userEmail);

    LandReviewDto selectLandReviewByIndex(@Param("index") int index);

    int selectLandReviewCountByPageDto(ReviewPageDto reviewPageDto,
                                       @Param("userEmail") String userEmail);

    LandReviewImageEntity[] selectLandReviewByLandReviewIndex(@Param("landReviewIndex") int landReviewIndex,
                                                              @Param("excludeData") boolean excludeData);

    LandReviewImageEntity selectLandReviewImage(@Param("index") int index);

    LandReviewReportEntity selectLandReviewReport(@Param("landReviewIndex") int landReviewIndex,
                                                  @Param("userEmail") String userEmail);

    int updateLandReview(LandReviewEntity landReview);
}
