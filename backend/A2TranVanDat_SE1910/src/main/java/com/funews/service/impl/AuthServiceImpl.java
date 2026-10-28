package com.funews.service.impl;

import com.funews.dto.request.LoginRequest;
import com.funews.dto.response.LoginResponse;
import com.funews.entity.SystemAccount;
import com.funews.exception.ResourceNotFoundException;
import com.funews.exception.UnauthorizedException;
import com.funews.repository.SystemAccountRepository;
import com.funews.service.AuthService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class AuthServiceImpl implements AuthService {

    private final SystemAccountRepository accountRepository;

    public AuthServiceImpl(SystemAccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        SystemAccount account = accountRepository.findByAccountEmail(request.email().trim())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials: Email not found"));

        if (!account.getAccountPassword().equals(request.password())) {
            throw new UnauthorizedException("Invalid credentials: Password incorrect");
        }

        String mockToken = UUID.randomUUID().toString();
        return new LoginResponse(
                account.getAccountId(),
                account.getAccountName(),
                account.getAccountEmail(),
                account.getAccountRole(),
                mockToken
        );
    }
}
