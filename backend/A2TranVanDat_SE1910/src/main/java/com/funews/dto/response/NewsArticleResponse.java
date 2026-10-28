package com.funews.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public record NewsArticleResponse(
    String id,
    String title,
    String headline,
    LocalDateTime createdDate,
    String content,
    String source,
    Short categoryId,
    String categoryName,
    Boolean status,
    String createdById,
    String createdByName,
    List<TagResponse> tags
) {}
