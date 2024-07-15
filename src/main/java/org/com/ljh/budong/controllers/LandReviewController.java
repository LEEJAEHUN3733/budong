package org.com.ljh.budong.controllers;

import com.google.gson.Gson;
import org.com.ljh.budong.dtos.LandReviewDto;
import org.com.ljh.budong.dtos.ReviewPageDto;
import org.com.ljh.budong.entities.LandReviewEntity;
import org.com.ljh.budong.entities.LandReviewImageEntity;
import org.com.ljh.budong.entities.UserEntity;
import org.com.ljh.budong.results.CommonResult;
import org.com.ljh.budong.results.Result;
import org.com.ljh.budong.services.LandReviewService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Controller
@RequestMapping("/landReview")
public class LandReviewController {
    private final LandReviewService landReviewService;

    @Autowired
    public LandReviewController(LandReviewService landReviewService) {
        this.landReviewService = landReviewService;
    }

    @RequestMapping(value = "/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postPnu(@SessionAttribute("user") UserEntity user,
                          @RequestParam(value = "_images", required = false) MultipartFile[] images,
                          LandReviewEntity landReview) throws IOException {
        landReview.setUserEmail(user.getEmail());
        if (images == null) {
            images = new MultipartFile[0];
        }
        LandReviewImageEntity[] landReviewImages = new LandReviewImageEntity[images.length];
        for (int i = 0; i < images.length; i++) {
            LandReviewImageEntity landReviewImage = new LandReviewImageEntity();
            landReviewImage.setData(images[i].getBytes());
            landReviewImage.setName(images[i].getOriginalFilename());
            landReviewImage.setContentType(images[i].getContentType());
            landReviewImages[i] = landReviewImage;
        }
        Result result = this.landReviewService.add(landReview, landReviewImages);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

    @RequestMapping(value = "/reviewIndexes", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public int[] getReviewIndexes(@RequestParam(value = "pnu") String pnu) {
        return this.landReviewService.getIndexes(pnu);
    }

    @RequestMapping(value = "/reviews", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getReviews(@SessionAttribute(value = "user", required = false) UserEntity user,
                             ReviewPageDto reviewPageDto,
                             @RequestParam(value = "page", required = false, defaultValue = "1") int page) {
        Gson gson = new Gson();
        JSONObject responseObject = new JSONObject();
        reviewPageDto.setRequestPage(page);
        LandReviewDto[] landReviews = this.landReviewService.getReviews(user, reviewPageDto);
        responseObject.put("landReviews", landReviews);

        String reviewPage = gson.toJson(reviewPageDto);
        responseObject.put("reviewPage", reviewPage);
        return responseObject.toString();
    }

    @RequestMapping(value = "/review", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public LandReviewDto getReview(@SessionAttribute(value = "user") UserEntity user,
                                   @RequestParam(value = "index") int index) {
        return this.landReviewService.getReview(user, index);
    }

    @RequestMapping(value = "/image", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<byte[]> getImage(@RequestParam(value = "index", required = false, defaultValue = "0") int index) {
        LandReviewImageEntity image = this.landReviewService.getImage(index);
        if (image == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .contentLength(image.getData().length)
                .contentType(MediaType.parseMediaType(image.getContentType()))
                .body(image.getData());
    }

    @RequestMapping(value = "/", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String deletePnu(@SessionAttribute(value = "user", required = false) UserEntity user,
                            @RequestParam(value = "index", required = false, defaultValue = "0") int index) {
        Result result = this.landReviewService.delete(user, index);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

    @RequestMapping(value = "/report", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postReport(@SessionAttribute(value = "user", required = false) UserEntity user,
                             @RequestParam(value = "index", required = false, defaultValue = "0") int index) {
        Result result = this.landReviewService.report(user, index);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

    @RequestMapping(value = "/", method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String patchIndex(@SessionAttribute("user") UserEntity user,
                              @RequestParam(value = "_images", required = false) MultipartFile[] images,
                              @RequestParam(value = "remainReviewImageIndexes", required = false) int[] remainReviewImageIndexes,
                              LandReviewEntity landReview) throws IOException {
        // images
        if (images == null) {
            images = new MultipartFile[0];
        }
        LandReviewImageEntity[] landReviewImages = new LandReviewImageEntity[images.length];
        for (int i = 0; i < images.length; i++) {
            LandReviewImageEntity landReviewImage = new LandReviewImageEntity();
            landReviewImage.setData(images[i].getBytes());
            landReviewImage.setName(images[i].getOriginalFilename());
            landReviewImage.setContentType(images[i].getContentType());
            landReviewImages[i] = landReviewImage;
        }
        // landReview에 userEmail값 넣기
        landReview.setUserEmail(user.getEmail());
        Result result = this.landReviewService.modify(landReview, landReviewImages ,remainReviewImageIndexes);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.toString().toLowerCase());
        return responseObject.toString();
    }
}
