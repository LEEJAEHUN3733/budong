package org.com.ljh.budong.results.user;

import org.com.ljh.budong.results.Result;

public enum RegisterResult implements Result {
    FAILURE_DUPLICATE_EMAIL,
    FAILURE_DUPLICATE_NICKNAME
}
