package org.com.ljh.budong.dtos;

import lombok.*;
import org.com.ljh.budong.entities.UserEntity;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDto extends UserEntity {
    private int profileImageIndex;
}
