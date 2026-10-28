# FUNewsManagementSystem - Assignment 02 SBA301

**Project Name:** A2TranVanDat_SE1910
**Backend Architecture:** 3-Layer with Repository Pattern (Spring Boot 3 + MS SQL Server)

## Cấu trúc các tầng

1. `config`: CorsConfig, SecurityConfig, SwaggerConfig
2. `controller`: AuthController, AccountController, CategoryController, NewsArticleController, TagController
3. `service` & `service/impl`: Tách rõ interface và class triển khai nghiệp vụ
4. `repository`: Spring Data JPA Interfaces với truy vấn kiểm tra ràng buộc khóa
5. `entity`: SystemAccount, Category, NewsArticle, Tag (quan hệ ManyToMany NewsTag)
6. `dto`: Request (Validation) và Response (Records) + PageDTO
7. `exception`: GlobalExceptionHandler bắt mã lỗi 409 Conflict, 404 Not Found, 400 Bad Request

## Hướng dẫn chạy

1. Tạo CSDL trong MS SQL Server: `A2TranVanDat_SE1910`
2. Cập nhật user/password trong `src/main/resources/application.properties`
3. Chạy `mvn clean spring-boot:run` hoặc mở thư mục trong IntelliJ IDEA
4. Truy cập tài liệu API Swagger UI: http://localhost:8080/swagger-ui.html
