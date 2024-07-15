package org.com.ljh.budong.components;

import org.com.ljh.budong.entities.UserEntity;
import org.com.ljh.budong.mappers.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class UserDeleteScheduler {
    private final UserMapper userMapper;

    @Autowired
    public UserDeleteScheduler(UserMapper userMapper) {
        this.userMapper = userMapper;
    }
    
    
    // 매일 0시에 실행되도록 함
    @Scheduled(cron = "0 0 0 * * *")
    public void deleteUsers() {
        LocalDateTime today = LocalDateTime.now();

        LocalDateTime beforeToday = today.minusDays(30);

        UserEntity[] deletedUser = this.userMapper.selectUserByDeleted(true, beforeToday);

        for (UserEntity user : deletedUser) {
            this.userMapper.deleteUser(user);
        }
    }
}
