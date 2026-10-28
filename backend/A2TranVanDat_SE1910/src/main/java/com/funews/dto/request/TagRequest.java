package com.funews.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TagRequest(
    @NotBlank(message = "TagName is required")
    @Size(max = 50, message = "TagName must not exceed 50 characters")
    String name,

    String note
) {}
