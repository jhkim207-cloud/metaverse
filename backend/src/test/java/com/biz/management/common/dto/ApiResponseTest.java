package com.biz.management.common.dto;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ApiResponseTest {

    @Test
    void success_shouldCreateSuccessResponse() {
        String data = "test data";

        ApiResponse<String> response = ApiResponse.success(data);

        assertTrue(response.isSuccess());
        assertEquals(data, response.getData());
        assertNull(response.getMessage());
        assertNull(response.getErrorCode());
    }

    @Test
    void success_withNullData_shouldCreateSuccessResponse() {
        ApiResponse<String> response = ApiResponse.success(null);

        assertTrue(response.isSuccess());
        assertNull(response.getData());
    }

    @Test
    void success_withMessage_shouldIncludeMessage() {
        String data = "test data";
        String message = "Operation successful";

        ApiResponse<String> response = ApiResponse.success(data, message);

        assertTrue(response.isSuccess());
        assertEquals(data, response.getData());
        assertEquals(message, response.getMessage());
    }

    @Test
    void error_shouldCreateErrorResponse() {
        String errorMessage = "Something went wrong";

        ApiResponse<String> response = ApiResponse.error(errorMessage);

        assertFalse(response.isSuccess());
        assertNull(response.getData());
        assertEquals(errorMessage, response.getMessage());
    }

    @Test
    void error_withErrorCode_shouldIncludeErrorCode() {
        String errorMessage = "Something went wrong";
        String errorCode = "ERR001";

        ApiResponse<String> response = ApiResponse.error(errorMessage, errorCode);

        assertFalse(response.isSuccess());
        assertNull(response.getData());
        assertEquals(errorMessage, response.getMessage());
        assertEquals(errorCode, response.getErrorCode());
    }
}
