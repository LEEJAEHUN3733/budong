package org.com.ljh.budong.utils;

import lombok.experimental.UtilityClass;
import org.apache.commons.codec.binary.Base64;

@UtilityClass
public class UserUtils {
    private static final String BASIC_PROFILE_IMAGE_BASE64 = "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";

    public static byte[] getBasicProfileImage() {
        return Base64.decodeBase64(UserUtils.BASIC_PROFILE_IMAGE_BASE64);
    }
}
