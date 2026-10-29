package com.funews.repository;

import com.funews.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface TagRepository extends JpaRepository<Tag, Integer> {
    List<Tag> findByTagNameContainingIgnoreCase(String keyword);

    @Query("SELECT COALESCE(MAX(t.tagId), 0) + 1 FROM Tag t")
    Integer getNextTagId();
}
