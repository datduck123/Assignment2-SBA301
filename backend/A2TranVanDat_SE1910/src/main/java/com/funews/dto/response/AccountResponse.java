package com.funews.dto.response;

public record AccountResponse(
    String accountId,
    String name,
    String email,
    Integer role
) {}
