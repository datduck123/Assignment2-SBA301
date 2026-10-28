package com.funews.dto.response;

public record CategoryResponse(
    Short id,
    String name,
    String description,
    Short parentId,
    String parentName,
    Boolean isActive
) {}
