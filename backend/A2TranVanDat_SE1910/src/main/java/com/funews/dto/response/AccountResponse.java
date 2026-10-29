package com.funews.dto.response;

public record AccountResponse(
    Short accountId,
    String name,
    String email,
    Integer role
) {}
