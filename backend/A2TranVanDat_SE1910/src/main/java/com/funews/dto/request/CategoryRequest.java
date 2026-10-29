package com.funews.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryRequest(
    @NotBlank(message = "CategoryName is required")
    @Size(max = 100, message = "CategoryName must not exceed 100 characters")
    String name,

    @Size(max = 250, message = "Description must not exceed 250 characters")
    String description,

    Short parentId,
    Boolean isActive
) {}
