package org.com.ljh.budong.services;

import jakarta.mail.MessagingException;
import org.apache.commons.lang3.RandomStringUtils;
import org.com.ljh.budong.dtos.LandDto;
import org.com.ljh.budong.dtos.LandSaveDto;
import org.com.ljh.budong.entities.EmailAuthEntity;
import org.com.ljh.budong.entities.UserEntity;
import org.com.ljh.budong.entities.UserProfileImageEntity;
import org.com.ljh.budong.mappers.LandSaveMapper;
import org.com.ljh.budong.mappers.UserMapper;
import org.com.ljh.budong.misc.MailSender;
import org.com.ljh.budong.regexes.EmailAuthRegex;
import org.com.ljh.budong.regexes.UserRegex;
import org.com.ljh.budong.results.CommonResult;
import org.com.ljh.budong.results.Result;
import org.com.ljh.budong.results.user.*;
import org.com.ljh.budong.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.token.Sha512DigestUtils;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.io.IOException;
import java.nio.file.Files;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Objects;

@Service
public class UserService {
    private static void prepareEmailAuth(EmailAuthEntity emailAuth) throws NoSuchAlgorithmException {
        emailAuth.setCode(RandomStringUtils.randomNumeric(6));
        emailAuth.setSalt(Sha512DigestUtils.shaHex(String.format("%s%s%f%f",
                emailAuth.getEmail(),
                emailAuth.getCode(),
                SecureRandom.getInstanceStrong().nextDouble(),
                SecureRandom.getInstanceStrong().nextDouble())));
        emailAuth.setCreatedAt(LocalDateTime.now());
        emailAuth.setExpiresAt(LocalDateTime.now().plusMinutes(3));
        emailAuth.setExpired(false);
        emailAuth.setVerified(false);
        emailAuth.setUsed(false);
    }

    private final UserMapper userMapper;
    private final LandSaveMapper landSaveMapper;
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Autowired
    public UserService(UserMapper userMapper, LandSaveMapper landSaveMapper, JavaMailSender mailSender, SpringTemplateEngine templateEngine) {
        this.userMapper = userMapper;
        this.landSaveMapper = landSaveMapper;
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    public Result sendRegisterEmail(EmailAuthEntity emailAuth) throws NoSuchAlgorithmException, MessagingException {
        if (emailAuth == null || !EmailAuthRegex.email.tests(emailAuth.getEmail())) {
            return CommonResult.FAILURE;
        }
        if (this.userMapper.selectUserByEmail(emailAuth.getEmail()) != null) {
            return SendRegisterEmailResult.FAILURE_DUPLICATE_EMAIL;
        }
        prepareEmailAuth(emailAuth);
        if (this.userMapper.insertEmailAuth(emailAuth) != 1) {
            return CommonResult.FAILURE;
        }
        Context context = new Context();
        context.setVariable("code", emailAuth.getCode());
        new MailSender(this.mailSender)
                .setFrom("wogns3733@gmail.com")
                .setSubject("[Budong] 회원가입 인증번호")
                .setTo(emailAuth.getEmail())
                .setText(this.templateEngine.process("user/registerEmail", context), true)
                .send();
        return CommonResult.SUCCESS;
    }

    public Result verifyEmailAuth(EmailAuthEntity emailAuth) {
        if (emailAuth == null ||
            !EmailAuthRegex.email.tests(emailAuth.getEmail()) ||
            !EmailAuthRegex.code.tests(emailAuth.getCode()) ||
            !EmailAuthRegex.salt.tests(emailAuth.getSalt())) {
            return CommonResult.FAILURE;
        }
        EmailAuthEntity dbEmailAuth = this.userMapper.selectEmailAuthByEmailCodeSalt(
                emailAuth.getEmail(),
                emailAuth.getCode(),
                emailAuth.getSalt());
        if (dbEmailAuth == null || dbEmailAuth.isVerified() || dbEmailAuth.isUsed()) {
            return CommonResult.FAILURE;
        }
        if (dbEmailAuth.isExpired() || dbEmailAuth.getExpiresAt().isBefore(LocalDateTime.now())) {
            return VerifyEmailAuthResult.FAILURE_EXPIRED;
        }
        dbEmailAuth.setVerified(true);
        return this.userMapper.updateEmailAuth(dbEmailAuth) > 0
                ? CommonResult.SUCCESS
                : CommonResult.FAILURE;
    }

    public Result login(UserEntity user) {
        // user 정규화
        if (user == null ||
            !UserRegex.email.tests(user.getEmail()) ||
            !UserRegex.password.tests(user.getPassword())) {
            return CommonResult.FAILURE;
        }
        // <A> 전달 받은 user의 email을 email값으로 가지는 UserEntity SELECT
        UserEntity dbUser = this.userMapper.selectUserByEmail(user.getEmail());
        // <A>가 null 이라면 return FAILURE
        if (dbUser == null) {
            return CommonResult.FAILURE;
        }
        if (dbUser.isDeleted()) {
            return LoginResult.FAILURE_DELETED;
        }
        // <A>가 가지는 password 값과 user가 가지는 password 값 비교 후 비밀번호가 올바르지 않으면 return FAILURE
        // BCrypt를 통해 암호화된 값과 평문은 BCrypt.checkpw(평문, 암호문)으로 비교
        if (!BCrypt.checkpw(user.getPassword(), dbUser.getPassword())) {
            return CommonResult.FAILURE;
        }
        // <A>의 isSuspended() 값이 true라면 return FAILURE_SUSPENDED 반환
        if (dbUser.isSuspended()) {
            return LoginResult.FAILURE_SUSPENDED;
        }
        user.setPassword(dbUser.getEmail());
        user.setNickname(dbUser.getEmail());
        user.setCreatedAt(dbUser.getCreatedAt());
        user.setAdmin(dbUser.isAdmin());
        user.setDeleted(dbUser.isDeleted());
        user.setSuspended(dbUser.isSuspended());
        return CommonResult.SUCCESS;
    }

    @Transactional
    public Result register(EmailAuthEntity emailAuth, UserEntity user) throws IOException {
        // 정규화
        if(emailAuth == null || user == null ||
            !EmailAuthRegex.email.tests(emailAuth.getEmail()) ||
            !EmailAuthRegex.code.tests(emailAuth.getCode()) ||
            !EmailAuthRegex.salt.tests(emailAuth.getSalt()) ||
            !UserRegex.email.tests(user.getEmail()) ||
            !UserRegex.nickname.tests(user.getNickname()) ||
            !UserRegex.password.tests(user.getPassword())) {
            return CommonResult.FAILURE;
        }
        EmailAuthEntity dbEmailAuth = this.userMapper.selectEmailAuthByEmailCodeSalt(
                emailAuth.getEmail(),
                emailAuth.getCode(),
                emailAuth.getSalt());
        // 이메일 인증 완료 여부 확인
        if(dbEmailAuth == null || !dbEmailAuth.isVerified() || dbEmailAuth.isUsed()) {
            return CommonResult.FAILURE;
        }
        // 이메일 중복 검사(selectUserByEmail 있는거 사용)
        if(this.userMapper.selectUserByEmail(emailAuth.getEmail()) != null) {
            return RegisterResult.FAILURE_DUPLICATE_EMAIL;
        }
        // 닉네임 중복 검사(selectUserByNickName 만들기)
        if(this.userMapper.selectEmailAuthByNickName(user.getNickname()) != null) {
            return RegisterResult.FAILURE_DUPLICATE_NICKNAME;
        }
        // 비밀번호 암호화(SHA-512 대신 BCrypt/PBKDF2 사용)
        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(null);
        user.setAdmin(false);
        user.setDeleted(false);
        user.setSuspended(false);
        // 사용자 추가(insertUser 만들기)
        this.userMapper.insertUser(user);
        // 이메일 인증 사용됨으로 수정(isUsed를 true로 할당 후 UPDATE, updateEmailAuth 있는거 사용)
        dbEmailAuth.setUsed(true);
        this.userMapper.updateEmailAuth(dbEmailAuth);
        // 기본 프로필 사진 설정
        UserProfileImageEntity profileImage = new UserProfileImageEntity();
        byte[] profileImageData = UserUtils.getBasicProfileImage();
        profileImage.setUserEmail(user.getEmail());
        profileImage.setData(profileImageData);
        profileImage.setName("basic_profile.jpg");
        profileImage.setContentType("image/jpg");
        this.userMapper.insertUserProfileImage(profileImage);
        return CommonResult.SUCCESS;
    }

    public String getEmailByNickname(String nickname) {
        // 전달 받은 nickname 값에 대해 정규화
        if(!UserRegex.nickname.tests(nickname)) {
            return null;
        }
        UserEntity dbUser = this.userMapper.selectEmailAuthByNickName(nickname);
        // 전달 받은 nickname을 닉네임으로 가지는 회원의 이메일을 고스란히 반환
        return dbUser == null
                ? null
                : dbUser.getEmail();
    }

    public UserEntity getInfoByUserEmail(String userEmail) {
        UserEntity dbuser = this.userMapper.selectUserByEmail(userEmail);
        dbuser.setPassword(null);
        return dbuser;
    }

    public LandSaveDto[] getLandByPage(LandDto page) {
        // 페이지네이션
        page.setTotalCount(this.landSaveMapper.selectLandSaveCountByPage(page));
        page.setMaxPage(page.getTotalCount() / page.getCountPerPage() + (page.getTotalCount() % page.getCountPerPage() == 0 ? 0 : 1));
        page.setMinPage(1);
        page.setOffset(page.getCountPerPage() * (page.getRequestPage() - 1));

        // 불러오기
        return this.landSaveMapper.selectLandSaveByPage(page);
    }

    public Result sendResetPasswordEmail(EmailAuthEntity emailAuth) throws NoSuchAlgorithmException, MessagingException {
        if (emailAuth == null || !EmailAuthRegex.email.tests(emailAuth.getEmail())) {
            return CommonResult.FAILURE;
        }
        if (this.userMapper.selectUserByEmail(emailAuth.getEmail()) == null) {
            return CommonResult.FAILURE;
        }
        prepareEmailAuth(emailAuth);
        if (this.userMapper.insertEmailAuth(emailAuth) != 1) {
            return CommonResult.FAILURE;
        }
        Context context = new Context();
        context.setVariable("code", emailAuth.getCode());
        new MailSender(this.mailSender)
                .setFrom("wogns3733@gmail.com")
                .setSubject("[Budong] 비밀번호 재설정 인증번호")
                .setTo(emailAuth.getEmail())
                .setText(this.templateEngine.process("user/resetPasswordEmail", context), true)
                .send();
        return CommonResult.SUCCESS;
    }

    public Result delete(UserEntity user) {
        // 받아온 비밀번호 정규화
        if(user.getPassword() == null || !UserRegex.password.tests(user.getPassword())) {
            return CommonResult.FAILURE;
        }
        UserEntity dbUser = this.userMapper.selectUserByEmail(user.getEmail());
        if (dbUser == null) {
            return CommonResult.FAILURE;
        }
        // 받아온 패스워드가 입력한 password와 맞는지 확인
        if (!BCrypt.checkpw(user.getPassword(), dbUser.getPassword())) {
            return WithdrawalResult.FAILURE_DIFFERENT_PASSWORD;
        }
        user.setEmail(dbUser.getEmail());
        user.setPassword(dbUser.getPassword());
        user.setNickname(dbUser.getNickname());
        user.setCreatedAt(dbUser.getCreatedAt());
        user.setUpdatedAt(LocalDateTime.now());
        user.setAdmin(dbUser.isAdmin());
        user.setDeleted(true);  // 회원탈퇴시 isDeleted true 설정
        user.setSuspended(dbUser.isSuspended());
        return this.userMapper.updateUser(user) > 0
                ? CommonResult.SUCCESS
                : CommonResult.FAILURE;
    }

    @Transactional
    public Result resetPassword(EmailAuthEntity emailAuth,
                                UserEntity user) {
        if(emailAuth == null || user == null ||
                !EmailAuthRegex.email.tests(emailAuth.getEmail()) ||
                !EmailAuthRegex.code.tests(emailAuth.getCode()) ||
                !EmailAuthRegex.salt.tests(emailAuth.getSalt()) ||
                !UserRegex.email.tests(user.getEmail()) ||
                !UserRegex.password.tests(user.getPassword())) {
            return CommonResult.FAILURE;
        }
        EmailAuthEntity dbEmailAuth = this.userMapper.selectEmailAuthByEmailCodeSalt(
                emailAuth.getEmail(),
                emailAuth.getCode(),
                emailAuth.getSalt());
        if (dbEmailAuth == null || !dbEmailAuth.isVerified()) {
            return CommonResult.FAILURE;
        }
        dbEmailAuth.setUsed(true);
        this.userMapper.updateEmailAuth(dbEmailAuth);
        UserEntity dbUser = this.userMapper.selectUserByEmail(user.getEmail());
        if (dbUser == null || dbUser.isDeleted()) {
            return CommonResult.FAILURE;
        }
        dbUser.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        // 정보 수정된 날짜 저장
        dbUser.setUpdatedAt(LocalDateTime.now());
        this.userMapper.updateUser(dbUser);
        return CommonResult.SUCCESS;
    }

    // 회원정보수정(닉네임, 비밀번호)
    public Result modifyUser(UserEntity editUserInfo) {
        UserEntity dbUser = this.userMapper.selectUserByEmail(editUserInfo.getEmail());
        if (dbUser == null) {
            return CommonResult.FAILURE;
        }
        // 닉네임 변경
        if (editUserInfo.getNickname() != null) {
            if (!UserRegex.nickname.tests(editUserInfo.getNickname())) {
                return CommonResult.FAILURE;
            }
            if (this.userMapper.selectEmailAuthByNickName(editUserInfo.getNickname()) != null &&
                !Objects.equals(this.userMapper.selectEmailAuthByNickName(editUserInfo.getNickname()).getEmail(), dbUser.getEmail())) {
                return ModifyResult.FAILURE_DUPLICATE_NICKNAME;
            }
            dbUser.setNickname(editUserInfo.getNickname());
            dbUser.setUpdatedAt(LocalDateTime.now());
            dbUser.setAdmin(false);
            dbUser.setDeleted(false);
            dbUser.setSuspended(false);
            return this.userMapper.updateUser(dbUser) > 0
                    ? CommonResult.SUCCESS
                    : CommonResult.FAILURE;
        }
        // 비밀번호 변경
        if (editUserInfo.getPassword() != null) {
            if (!UserRegex.password.tests(editUserInfo.getPassword())) {
                return CommonResult.FAILURE;
            }
            dbUser.setPassword(new BCryptPasswordEncoder().encode(editUserInfo.getPassword()));
            dbUser.setUpdatedAt(LocalDateTime.now());
            dbUser.setAdmin(false);
            dbUser.setDeleted(false);
            dbUser.setSuspended(false);
            return this.userMapper.updateUser(dbUser) > 0
                    ? CommonResult.SUCCESS
                    : CommonResult.FAILURE;
        }
        return CommonResult.SUCCESS;
    }

    // 프로필이미지수정
    public Result modifyProfileImage(UserProfileImageEntity profileImage) {
        UserProfileImageEntity dbProfileImage = this.userMapper.selectUserProfileByUserEmail(profileImage.getUserEmail());
        if (dbProfileImage == null) {
            return CommonResult.FAILURE;
        }
        dbProfileImage.setUserEmail(profileImage.getUserEmail());
        dbProfileImage.setData(profileImage.getData());
        dbProfileImage.setName(profileImage.getName());
        dbProfileImage.setContentType(profileImage.getContentType());
        return this.userMapper.updateUserProfileImage(dbProfileImage) > 0
                ? CommonResult.SUCCESS
                : CommonResult.FAILURE;
    }

    // 프로필이미지 가져오기
    public UserProfileImageEntity getImage(int index) {
        if (index < 1) {
            return null;
        }
        return this.userMapper.selectUserProfileByIndex(index);
    }

    // 프로필이미지 인덱스 가져오기
    public Integer getImageIndex(String email) {
        if (email == null) {
            return null;
        }
        return this.userMapper.selectUserProfileByUserEmail(email).getIndex();
    }
}
