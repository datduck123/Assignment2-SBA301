package com.funews.service.impl;

import com.funews.dto.request.TagRequest;
import com.funews.dto.response.TagResponse;
import com.funews.entity.Tag;
import com.funews.repository.TagRepository;
import com.funews.service.TagService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;

    public TagServiceImpl(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TagResponse> getAllTags() {
        return tagRepository.findAll().stream()
                .map(t -> new TagResponse(t.getTagId(), t.getTagName(), t.getNote()))
                .toList();
    }

    @Override
    public TagResponse createTag(TagRequest request) {
        Integer nextId = tagRepository.getNextTagId();
        Tag tag = Tag.builder()
                .tagId(nextId)
                .tagName(request.name())
                .note(request.note())
                .build();
        Tag saved = tagRepository.save(tag);
        return new TagResponse(saved.getTagId(), saved.getTagName(), saved.getNote());
    }
}
