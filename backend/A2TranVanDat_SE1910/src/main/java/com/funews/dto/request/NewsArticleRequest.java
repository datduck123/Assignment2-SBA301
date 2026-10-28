package com.funews.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record NewsArticleRequest(
    @NotBlank(message = "NewsArticleID is required")
    @Size(max = 20, message = "NewsArticleID must not exceed 20 characters")
    String id,

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    String title,

    @Size(max = 150, message = "Headline must not exceed 150 characters")
    String headline,

    @NotBlank(message = "Content is required")
    String content,

    String source,

    @NotNull(message = "CategoryID is required")
    Short categoryId,

    @NotNull(message = "Status is required")
    Boolean status,

    String createdById,
    List<Integer> tagIds
) {}
