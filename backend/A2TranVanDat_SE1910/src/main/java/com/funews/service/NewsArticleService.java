package com.funews.service;

import com.funews.dto.request.NewsArticleRequest;
import com.funews.dto.response.NewsArticleResponse;
import com.funews.dto.response.PageDTO;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface NewsArticleService {
    List<NewsArticleResponse> getPublicActiveNews();
    PageDTO<NewsArticleResponse> getAllNews(String keyword, Pageable pageable);
    List<NewsArticleResponse> getHistoryByStaff(String staffAccountId);
    NewsArticleResponse getById(String id);
    NewsArticleResponse createNews(NewsArticleRequest request);
    NewsArticleResponse updateNews(String id, NewsArticleRequest request);
    void deleteNews(String id);
}
