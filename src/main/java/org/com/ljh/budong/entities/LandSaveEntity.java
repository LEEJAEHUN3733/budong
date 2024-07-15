package org.com.ljh.budong.entities;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(of = {"landSavePnu", "userEmail"})
public class LandSaveEntity {
    private String landSavePnu;
    private String userEmail;
    private LocalDateTime createdAt;
}
