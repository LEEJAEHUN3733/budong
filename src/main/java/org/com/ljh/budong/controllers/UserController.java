package org.com.ljh.budong.controllers;

import com.google.gson.Gson;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpSession;
import org.com.ljh.budong.dtos.LandDto;
import org.com.ljh.budong.dtos.LandSaveDto;
import org.com.ljh.budong.dtos.UserDto;
import org.com.ljh.budong.entities.EmailAuthEntity;
import org.com.ljh.budong.entities.LandReviewEntity;
import org.com.ljh.budong.entities.UserEntity;
import org.com.ljh.budong.entities.UserProfileImageEntity;
import org.com.ljh.budong.results.CommonResult;
import org.com.ljh.budong.results.Result;
import org.com.ljh.budong.services.UserService;
import org.com.ljh.budong.utils.UserUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.security.NoSuchAlgorithmException;

@Controller
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping(value = "/getEmail", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getUserEmail(@SessionAttribute(value = "user", required = false) UserEntity user) {
        JSONObject responseObject = new JSONObject();
        if (user == null) {
            responseObject.put("email", "noEmail");
        } else {
            responseObject.put("email", user.getEmail());
        }
        return responseObject.toString();
    }

    @RequestMapping(value = "/getInfo", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public UserDto getInfo(@SessionAttribute(value = "user", required = false) UserEntity user) {
        UserDto userInfo = new UserDto();
        if (user == null) {
            return null;
        } else {
            UserEntity dbUserInfo = this.userService.getInfoByUserEmail(user.getEmail());
            userInfo.setEmail(dbUserInfo.getEmail());
            userInfo.setNickname(dbUserInfo.getNickname());
            userInfo.setAdmin(dbUserInfo.isAdmin());
            userInfo.setDeleted(dbUserInfo.isDeleted());
            userInfo.setSuspended(dbUserInfo.isSuspended());
            userInfo.setProfileImageIndex(this.userService.getImageIndex(dbUserInfo.getEmail()));
            return userInfo;
        }
    }

    @RequestMapping(value = "/land", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getLand(@SessionAttribute(value = "user", required = false) UserEntity user,
                          @RequestParam(value = "page", required = false, defaultValue = "1") int page) {
        if (user == null) {
            return null;
        } else {
            Gson gson = new Gson();
            JSONObject responseObject = new JSONObject();
            LandDto landDto = new LandDto();
            landDto.setUserEmail(user.getEmail());
            landDto.setRequestPage(page);
            LandSaveDto[] landSaves = this.userService.getLandByPage(landDto);
            responseObject.put("lands", landSaves);

            String pageJson = gson.toJson(landDto);
            responseObject.put("page", pageJson);
            return responseObject.toString();
        }
    }

    @RequestMapping(value = "/email", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getEmail(@RequestParam("nickname") String nickname) {
        String email = this.userService.getEmailByNickname(nickname);
        Result result = email == null ? CommonResult.FAILURE : CommonResult.SUCCESS;
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        if (result == CommonResult.SUCCESS) {
            responseObject.put("email", email);
        }
        return responseObject.toString();
    }

    @RequestMapping(value = "/", method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postIndex(@SessionAttribute UserEntity user,
                            UserEntity user2) {
        user.setPassword(user2.getPassword());
        Result result = this.userService.delete(user);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

    @RequestMapping(value = "/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postIndex(EmailAuthEntity emailAuth,
                            UserEntity user) throws IOException {
        Result result = this.userService.register(emailAuth, user);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postLogin(HttpSession session,
                            UserEntity user) {
        Result result = this.userService.login(user);
        if (result == CommonResult.SUCCESS) {
            session.setAttribute("user", user);
        }
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

    @RequestMapping(value = "/logout", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String getLogout(HttpSession session) {
        session.setAttribute("user", null);
        return "redirect:/home";
    }

    @RequestMapping(value = "/mainLogout", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String getMainLogout(HttpSession session) {
        session.setAttribute("user", null);
        return "redirect:/main";
    }

    @RequestMapping(value = "/registerEmail", method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String patchRegisterEmail(EmailAuthEntity emailAuth) {
        Result result = this.userService.verifyEmailAuth(emailAuth);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

    @RequestMapping(value = "/registerEmail", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postRegisterEmail(EmailAuthEntity emailAuth) throws NoSuchAlgorithmException, MessagingException {
        Result result = this.userService.sendRegisterEmail(emailAuth);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        if (result == CommonResult.SUCCESS) {
            responseObject.put("salt", emailAuth.getSalt());
        }
        return responseObject.toString();
    }

    @RequestMapping(value = "/resetPassword", method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String patchResetPassword(EmailAuthEntity emailAuth, UserEntity user) {
        Result result = this.userService.resetPassword(emailAuth, user);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

    @RequestMapping(value = "/resetPasswordEmail", method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String patchResetPasswordEmail(EmailAuthEntity emailAuth) {
        Result result = this.userService.verifyEmailAuth(emailAuth);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

    @RequestMapping(value = "/resetPasswordEmail", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postResetPasswordEmail(EmailAuthEntity emailAuth) throws MessagingException, NoSuchAlgorithmException {
        Result result = this.userService.sendResetPasswordEmail(emailAuth);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        if (result == CommonResult.SUCCESS) {
            responseObject.put("salt", emailAuth.getSalt());
        }
        return responseObject.toString();
    }

    @RequestMapping(value = "/info", method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String patchInfo(@SessionAttribute UserEntity user,
                            @RequestParam(value = "nickname", required = false) String nickname,
                            @RequestParam(value = "password", required = false) String password) {
        UserEntity editUserInfo = new UserEntity();
        editUserInfo.setEmail(user.getEmail());
        if (nickname == null) {
            editUserInfo.setPassword(password);
        }
        if (password == null) {
            editUserInfo.setNickname(nickname);
        }
        Result result = this.userService.modifyUser(editUserInfo);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

    @RequestMapping(value = "/profile", method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String patchProfile(@SessionAttribute UserEntity user,
                               @RequestParam(value = "_thumbnail", required = false)MultipartFile thumbnail) throws IOException {
        UserProfileImageEntity profileImage = new UserProfileImageEntity();
        if (thumbnail == null) {
            // 파일을 올리지않고 올릴시 폴더에 저장한 기본이미지 넣음
            byte[] profileImageData = UserUtils.getBasicProfileImage();
            profileImage.setData(profileImageData);
            profileImage.setName("basic_profile.jpg");
            profileImage.setContentType("image/jpg");
        } else {
            profileImage.setData(thumbnail.getBytes());
            profileImage.setName(thumbnail.getOriginalFilename());
            profileImage.setContentType(thumbnail.getContentType());
        }
        profileImage.setUserEmail(user.getEmail());
        Result result = this.userService.modifyProfileImage(profileImage);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

    @RequestMapping(value = "/profile", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<byte[]> getImage(@RequestParam(value = "index", required = false, defaultValue = "0") int index) {
        UserProfileImageEntity profileImage = this.userService.getImage(index);
        if (profileImage == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .contentLength(profileImage.getData().length)
                .contentType(MediaType.parseMediaType(profileImage.getContentType()))
                .body(profileImage.getData());
    }
}
