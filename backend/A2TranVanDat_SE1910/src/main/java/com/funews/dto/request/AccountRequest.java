package com.funews.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AccountRequest(
    Short id,

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    String name,

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 70, message = "Email must not exceed 70 characters")
    String email,

    @NotNull(message = "Role is required (1: Admin, 2: Staff)")
    Integer role,

    @Size(max = 70, message = "Password must not exceed 70 characters")
    String password
) {}
