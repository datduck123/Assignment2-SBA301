package com.funews.service;

import com.funews.dto.request.LoginRequest;
import com.funews.dto.response.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
}
