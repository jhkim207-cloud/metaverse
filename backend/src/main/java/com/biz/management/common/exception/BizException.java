package com.biz.management.common.exception;

/**
 * 비즈니스 예외
 */
public class BizException extends RuntimeException {

    private final String errorCode;

    public BizException(String message) {
        super(message);
        this.errorCode = "BIZ_ERROR";
    }

    public BizException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public BizException(String errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
