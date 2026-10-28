package com.funews.repository;

import com.funews.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Short> {
    List<Category> findByCategoryNameContainingIgnoreCase(String keyword);
    boolean existsByCategoryNameIgnoreCase(String name);
}
