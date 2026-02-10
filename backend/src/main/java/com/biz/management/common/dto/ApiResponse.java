package com.biz.management.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * 공통 API 응답 DTO
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private boolean success;
    private T data;
    private String message;
    private String errorCode;
    private String detail;

    private ApiResponse(boolean success, T data, String message, String errorCode, String detail) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.errorCode = errorCode;
        this.detail = detail;
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, data, null, null, null);
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, data, message, null, null);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, null, message, null, null);
    }

    public static <T> ApiResponse<T> error(String message, String errorCode) {
        return new ApiResponse<>(false, null, message, errorCode, null);
    }

    public static <T> ApiResponse<T> error(String message, String errorCode, String detail) {
        return new ApiResponse<>(false, null, message, errorCode, detail);
    }

    // Getters
    public boolean isSuccess() { return success; }
    public T getData() { return data; }
    public String getMessage() { return message; }
    public String getErrorCode() { return errorCode; }
    public String getDetail() { return detail; }
}
