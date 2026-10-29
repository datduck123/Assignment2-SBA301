package com.funews.service.impl;

import com.funews.dto.request.CategoryRequest;
import com.funews.dto.response.CategoryResponse;
import com.funews.entity.Category;
import com.funews.exception.ConflictException;
import com.funews.exception.ResourceNotFoundException;
import com.funews.repository.CategoryRepository;
import com.funews.repository.NewsArticleRepository;
import com.funews.service.CategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final NewsArticleRepository newsRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository, NewsArticleRepository newsRepository) {
        this.categoryRepository = categoryRepository;
        this.newsRepository = newsRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream().map(this::mapToResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> searchCategories(String keyword) {
        return categoryRepository.findByCategoryNameContainingIgnoreCase(keyword)
                .stream().map(this::mapToResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Short id) {
        Category cat = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
        return mapToResponse(cat);
    }

    @Override
    public CategoryResponse createCategory(CategoryRequest request) {
        Category parent = request.parentId() != null ? categoryRepository.findById(request.parentId()).orElse(null) : null;
        Category category = Category.builder()
                .categoryName(request.name())
                .categoryDescription(request.description() != null ? request.description() : "")
                .parentCategory(parent)
                .isActive(request.isActive() != null ? request.isActive() : true)
                .build();
        return mapToResponse(categoryRepository.save(category));
    }

    @Override
    public CategoryResponse updateCategory(Short id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));

        Category parent = request.parentId() != null ? categoryRepository.findById(request.parentId()).orElse(null) : null;

        category.setCategoryName(request.name());
        category.setCategoryDescription(request.description() != null ? request.description() : "");
        category.setParentCategory(parent);
        if (request.isActive() != null) {
            category.setIsActive(request.isActive());
        }

        return mapToResponse(categoryRepository.save(category));
    }

    @Override
    public void deleteCategory(Short id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with ID: " + id);
        }

        // Constraint check from assignment requirements
        if (newsRepository.existsByCategory_CategoryId(id)) {
            throw new ConflictException("Cannot delete category: This category already contains news articles!");
        }

        categoryRepository.deleteById(id);
    }

    private CategoryResponse mapToResponse(Category c) {
        return new CategoryResponse(
                c.getCategoryId(),
                c.getCategoryName(),
                c.getCategoryDescription(),
                c.getParentCategory() != null ? c.getParentCategory().getCategoryId() : null,
                c.getParentCategory() != null ? c.getParentCategory().getCategoryName() : null,
                c.getIsActive()
        );
    }
}
