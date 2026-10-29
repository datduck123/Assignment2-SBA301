package com.funews.service;

import com.funews.dto.request.TagRequest;
import com.funews.dto.response.TagResponse;
import java.util.List;

public interface TagService {
    List<TagResponse> getAllTags();
    TagResponse createTag(TagRequest request);
}
