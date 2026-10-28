package com.funews.dto.response;

public record LoginResponse(
    String accountId,
    String name,
    String email,
    Integer role,
    String token
) {}
