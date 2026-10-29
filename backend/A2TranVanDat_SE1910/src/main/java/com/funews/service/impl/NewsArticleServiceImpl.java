package com.funews.service.impl;

import com.funews.dto.request.NewsArticleRequest;
import com.funews.dto.response.NewsArticleResponse;
import com.funews.dto.response.PageDTO;
import com.funews.dto.response.TagResponse;
import com.funews.entity.Category;
import com.funews.entity.NewsArticle;
import com.funews.entity.SystemAccount;
import com.funews.entity.Tag;
import com.funews.exception.ResourceNotFoundException;
import com.funews.repository.CategoryRepository;
import com.funews.repository.NewsArticleRepository;
import com.funews.repository.SystemAccountRepository;
import com.funews.repository.TagRepository;
import com.funews.service.NewsArticleService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class NewsArticleServiceImpl implements NewsArticleService {

    private final NewsArticleRepository newsRepository;
    private final CategoryRepository categoryRepository;
    private final SystemAccountRepository accountRepository;
    private final TagRepository tagRepository;

    public NewsArticleServiceImpl(NewsArticleRepository newsRepository,
                                  CategoryRepository categoryRepository,
                                  SystemAccountRepository accountRepository,
                                  TagRepository tagRepository) {
        this.newsRepository = newsRepository;
        this.categoryRepository = categoryRepository;
        this.accountRepository = accountRepository;
        this.tagRepository = tagRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<NewsArticleResponse> getPublicActiveNews() {
        return newsRepository.findByNewsStatusTrue().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PageDTO<NewsArticleResponse> getAllNews(String keyword, Pageable pageable) {
        Page<NewsArticle> pageResult;
        if (keyword != null && !keyword.trim().isEmpty()) {
            pageResult = newsRepository.findByNewsTitleContainingIgnoreCaseOrNewsContentContainingIgnoreCase(
                    keyword.trim(), keyword.trim(), pageable);
        } else {
            pageResult = newsRepository.findAll(pageable);
        }
        return PageDTO.of(pageResult.map(this::mapToResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public List<NewsArticleResponse> getHistoryByStaff(Short staffAccountId) {
        return newsRepository.findByCreatedBy_AccountIdOrderByCreatedDateDesc(staffAccountId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public NewsArticleResponse getById(String id) {
        NewsArticle article = newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News article not found with ID: " + id));
        return mapToResponse(article);
    }

    @Override
    public NewsArticleResponse createNews(NewsArticleRequest request) {
        Category category = null;
        if (request.categoryId() != null) {
            category = categoryRepository.findById(request.categoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.categoryId()));
        }

        SystemAccount creator = null;
        if (request.createdById() != null) {
            creator = accountRepository.findById(request.createdById())
                    .orElseThrow(() -> new ResourceNotFoundException("Staff account not found: " + request.createdById()));
        }

        Set<Tag> tags = new HashSet<>();
        if (request.tagIds() != null && !request.tagIds().isEmpty()) {
            tags.addAll(tagRepository.findAllById(request.tagIds()));
        }

        NewsArticle article = NewsArticle.builder()
                .newsArticleId(request.id())
                .newsTitle(request.title())
                .headline(request.headline())
                .newsContent(request.content())
                .newsSource(request.source())
                .category(category)
                .newsStatus(request.status() != null ? request.status() : true)
                .createdBy(creator)
                .createdDate(LocalDateTime.now())
                .tags(tags)
                .build();

        return mapToResponse(newsRepository.save(article));
    }

    @Override
    public NewsArticleResponse updateNews(String id, NewsArticleRequest request) {
        NewsArticle article = newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News article not found with ID: " + id));

        Category category = null;
        if (request.categoryId() != null) {
            category = categoryRepository.findById(request.categoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.categoryId()));
        }

        article.setNewsTitle(request.title());
        article.setHeadline(request.headline());
        article.setNewsContent(request.content());
        article.setNewsSource(request.source());
        article.setCategory(category);
        if (request.status() != null) {
            article.setNewsStatus(request.status());
        }
        article.setModifiedDate(LocalDateTime.now());

        if (request.tagIds() != null) {
            article.setTags(new HashSet<>(tagRepository.findAllById(request.tagIds())));
        }

        return mapToResponse(newsRepository.save(article));
    }

    @Override
    public void deleteNews(String id) {
        if (!newsRepository.existsById(id)) {
            throw new ResourceNotFoundException("News article not found with ID: " + id);
        }
        newsRepository.deleteById(id);
    }

    private NewsArticleResponse mapToResponse(NewsArticle n) {
        List<TagResponse> tagResponses = (n.getTags() != null) ? n.getTags().stream()
                .map(t -> new TagResponse(t.getTagId(), t.getTagName(), t.getNote()))
                .toList() : List.of();

        return new NewsArticleResponse(
                n.getNewsArticleId(),
                n.getNewsTitle(),
                n.getHeadline(),
                n.getCreatedDate(),
                n.getNewsContent(),
                n.getNewsSource(),
                n.getCategory() != null ? n.getCategory().getCategoryId() : null,
                n.getCategory() != null ? n.getCategory().getCategoryName() : null,
                n.getNewsStatus(),
                n.getCreatedBy() != null ? n.getCreatedBy().getAccountId() : null,
                n.getCreatedBy() != null ? n.getCreatedBy().getAccountName() : null,
                tagResponses
        );
    }
}
