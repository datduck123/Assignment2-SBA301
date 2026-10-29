package com.funews.service;

import com.funews.dto.request.CategoryRequest;
import com.funews.dto.response.CategoryResponse;
import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getAllCategories();
    List<CategoryResponse> searchCategories(String keyword);
    CategoryResponse getCategoryById(Short id);
    CategoryResponse createCategory(CategoryRequest request);
    CategoryResponse updateCategory(Short id, CategoryRequest request);
    void deleteCategory(Short id);
}
