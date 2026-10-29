package com.funews.controller;

import com.funews.dto.request.NewsArticleRequest;
import com.funews.dto.response.NewsArticleResponse;
import com.funews.dto.response.PageDTO;
import com.funews.service.NewsArticleService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
public class NewsArticleController {

    private final NewsArticleService newsService;

    public NewsArticleController(NewsArticleService newsService) {
        this.newsService = newsService;
    }

    @GetMapping("/public")
    public ResponseEntity<List<NewsArticleResponse>> getPublicActiveNews() {
        return ResponseEntity.ok(newsService.getPublicActiveNews());
    }

    @GetMapping
    public ResponseEntity<PageDTO<NewsArticleResponse>> getAll(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdDate") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(newsService.getAllNews(keyword, pageable));
    }

    @GetMapping("/history/{staffId}")
    public ResponseEntity<List<NewsArticleResponse>> getHistoryByStaff(@PathVariable String staffId) {
        return ResponseEntity.ok(newsService.getHistoryByStaff(staffId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsArticleResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(newsService.getById(id));
    }

    @PostMapping
    public ResponseEntity<NewsArticleResponse> create(@Valid @RequestBody NewsArticleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(newsService.createNews(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NewsArticleResponse> update(@PathVariable String id, @Valid @RequestBody NewsArticleRequest request) {
        return ResponseEntity.ok(newsService.updateNews(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        newsService.deleteNews(id);
        return ResponseEntity.noContent().build();
    }
}
