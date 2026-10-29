package com.funews.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public record NewsArticleRequest(
    @NotBlank(message = "NewsArticleID is required")
    @Size(max = 20, message = "NewsArticleID must not exceed 20 characters")
    String id,

    @Size(max = 400, message = "Title must not exceed 400 characters")
    String title,

    @NotBlank(message = "Headline is required")
    @Size(max = 150, message = "Headline must not exceed 150 characters")
    String headline,

    @Size(max = 4000, message = "Content must not exceed 4000 characters")
    String content,

    @Size(max = 400, message = "Source must not exceed 400 characters")
    String source,

    Short categoryId,

    Boolean status,

    Short createdById,
    List<Integer> tagIds
) {}
