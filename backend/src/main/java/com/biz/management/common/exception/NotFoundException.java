package com.biz.management.common.exception;

/**
 * 리소스 미발견 예외
 */
public class NotFoundException extends RuntimeException {

    public NotFoundException(String message) {
        super(message);
    }

    public NotFoundException(String resourceName, Object id) {
        super(String.format("%s not found: %s", resourceName, id));
    }
}
