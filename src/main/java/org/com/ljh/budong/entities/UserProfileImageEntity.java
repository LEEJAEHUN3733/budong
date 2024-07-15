package org.com.ljh.budong.entities;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(of = "index")
public class UserProfileImageEntity {
    private int index;
    private String userEmail;
    private byte[] data;
    private String name;
    private String contentType;
}
