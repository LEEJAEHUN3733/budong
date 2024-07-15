package org.com.ljh.budong.regexes;

import lombok.experimental.UtilityClass;

@UtilityClass
public class LandReviewRegex {
    public static final Regex content = new Regex("^([\\s\\S]{10,1000})$");
}
