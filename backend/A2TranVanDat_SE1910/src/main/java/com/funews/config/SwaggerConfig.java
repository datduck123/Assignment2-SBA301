package com.funews.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("FUNewsManagementSystem RESTful API")
                .version("1.0.0")
                .description("Spring Boot 3 + MS SQL Server REST API - Assignment 02 SBA301")
                .contact(new Contact().name("Tran Van Dat - SE1910")));
    }
}
