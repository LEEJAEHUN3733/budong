package org.com.ljh.budong.services;

import jakarta.mail.MessagingException;
import org.com.ljh.budong.entities.LandAlarmEntity;
import org.com.ljh.budong.mappers.LandAlarmMapper;
import org.com.ljh.budong.misc.MailSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class AsyncMailService {
    private final LandAlarmMapper landAlarmMapper;
    private final JavaMailSender javaMailSender;
    private final TemplateEngine templateEngine;

    @Autowired
    public AsyncMailService(LandAlarmMapper landAlarmMapper, JavaMailSender javaMailSender, TemplateEngine templateEngine) {
        this.landAlarmMapper = landAlarmMapper;
        this.javaMailSender = javaMailSender;
        this.templateEngine = templateEngine;
    }

    @Async  // Async로 비동기처리
    public void updateMailSend(String pnu, String landAddress) throws MessagingException {
        LandAlarmEntity[] landAlarms = this.landAlarmMapper.selectLandAlarmByPnu(pnu);
        for (LandAlarmEntity landAlarm : landAlarms) {
            Context context = new Context();
            context.setVariable("landAddress", landAddress);
            new MailSender(this.javaMailSender)
                    .setFrom("wogns3733@gmail.com")
                    .setSubject("[Budong] 알림설정한 대지의 정보가 업데이트되었습니다.")
                    .setTo(landAlarm.getUserEmail())
                    .setText(this.templateEngine.process("user/alarmEmail", context), true)
                    .send();
        }
        System.out.println("갱신완료알림 메일 전송이 완료되었습니다.");
    }
}
