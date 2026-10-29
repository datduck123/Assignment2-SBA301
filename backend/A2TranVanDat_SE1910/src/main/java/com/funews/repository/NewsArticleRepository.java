package com.funews.repository;

import com.funews.entity.NewsArticle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NewsArticleRepository extends JpaRepository<NewsArticle, String> {
    List<NewsArticle> findByNewsStatusTrue();

    Page<NewsArticle> findByNewsTitleContainingIgnoreCaseOrNewsContentContainingIgnoreCase(
            String title, String content, Pageable pageable);

    List<NewsArticle> findByCreatedBy_AccountIdOrderByCreatedDateDesc(Short accountId);

    // Business Constraints
    boolean existsByCategory_CategoryId(Short categoryId);
    boolean existsByCreatedBy_AccountId(Short accountId);
}
