package com.funews.dto.response;

public record LoginResponse(
    Short accountId,
    String name,
    String email,
    Integer role,
    String token
) {}
