package com.funews.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<Map<String, Object>> handleConflict(ConflictException ex) {
        Map<String, Object> err = new HashMap<>();
        err.put("timestamp", LocalDateTime.now());
        err.put("status", HttpStatus.CONFLICT.value());
        err.put("error", "Data Constraint Conflict");
        err.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(err);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex) {
        Map<String, Object> err = new HashMap<>();
        err.put("timestamp", LocalDateTime.now());
        err.put("status", HttpStatus.NOT_FOUND.value());
        err.put("error", "Resource Not Found");
        err.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<Map<String, Object>> handleUnauthorized(UnauthorizedException ex) {
        Map<String, Object> err = new HashMap<>();
        err.put("timestamp", LocalDateTime.now());
        err.put("status", HttpStatus.UNAUTHORIZED.value());
        err.put("error", "Unauthorized");
        err.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        Map<String, Object> err = new HashMap<>();
        err.put("timestamp", LocalDateTime.now());
        err.put("status", HttpStatus.BAD_REQUEST.value());
        err.put("error", "Validation Failed");
        err.put("message", fieldErrors.values().stream().findFirst().orElse("Validation failed"));
        err.put("validationErrors", fieldErrors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
    }
}
