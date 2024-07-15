package org.com.ljh.budong.mappers;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.com.ljh.budong.entities.EmailAuthEntity;
import org.com.ljh.budong.entities.UserEntity;
import org.com.ljh.budong.entities.UserProfileImageEntity;

import java.time.LocalDateTime;

@Mapper
public interface UserMapper {
    int insertEmailAuth(EmailAuthEntity emailAuth);

    int insertUser(UserEntity user);

    int insertUserProfileImage(UserProfileImageEntity userProfileImage);

    UserProfileImageEntity selectUserProfileByUserEmail(@Param("userEmail") String userEmail);

    UserProfileImageEntity selectUserProfileByIndex(@Param("index") int index);

    EmailAuthEntity selectEmailAuthByEmailCodeSalt(@Param("email") String email,
                                                   @Param("code") String code,
                                                   @Param("salt") String salt);

    UserEntity selectUserByEmail(@Param("email") String email);

    int updateEmailAuth(EmailAuthEntity emailAuth);

    UserEntity selectEmailAuthByNickName(@Param("nickname") String nickname);

    int updateUser(UserEntity user);

    int updateUserProfileImage(UserProfileImageEntity userProfileImage);

    UserEntity[] selectUserByDeleted(@Param("deleted") boolean isDeleted,
                                     @Param("updatedAt")LocalDateTime updatedAt);

    int deleteUser(UserEntity user);
}
