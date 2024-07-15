package org.com.ljh.budong.regexes;

import lombok.experimental.UtilityClass;

@UtilityClass // 접근 제한
public class EmailAuthRegex {
    public static final Regex email = new Regex(UserRegex.email.expression);
    public static final Regex code = new Regex("^(\\d{6})$");
    public static final Regex salt = new Regex("^([\\da-f]{128})$");
}
