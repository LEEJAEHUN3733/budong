package org.com.ljh.budong.entities;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(of = {"index"})
public class CenterEntity {
    private int index;
    private String user;
    private String category;
    private String content;
    private LocalDateTime createdAt;
}
