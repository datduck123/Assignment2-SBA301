package com.funews.service.impl;

import com.funews.dto.request.AccountRequest;
import com.funews.dto.response.AccountResponse;
import com.funews.dto.response.PageDTO;
import com.funews.entity.SystemAccount;
import com.funews.exception.ConflictException;
import com.funews.exception.ResourceNotFoundException;
import com.funews.repository.NewsArticleRepository;
import com.funews.repository.SystemAccountRepository;
import com.funews.service.AccountService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AccountServiceImpl implements AccountService {

    private final SystemAccountRepository accountRepository;
    private final NewsArticleRepository newsRepository;

    public AccountServiceImpl(SystemAccountRepository accountRepository, NewsArticleRepository newsRepository) {
        this.accountRepository = accountRepository;
        this.newsRepository = newsRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public PageDTO<AccountResponse> getAllAccounts(String keyword, Pageable pageable) {
        Page<SystemAccount> pageResult;
        if (keyword != null && !keyword.trim().isEmpty()) {
            pageResult = accountRepository.findByAccountNameContainingIgnoreCaseOrAccountEmailContainingIgnoreCase(
                    keyword.trim(), keyword.trim(), pageable);
        } else {
            pageResult = accountRepository.findAll(pageable);
        }
        return PageDTO.of(pageResult.map(this::mapToResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public AccountResponse getById(String id) {
        SystemAccount acc = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + id));
        return mapToResponse(acc);
    }

    @Override
    public AccountResponse createAccount(AccountRequest request) {
        if (accountRepository.existsById(request.id())) {
            throw new ConflictException("AccountID already exists: " + request.id());
        }
        if (accountRepository.existsByAccountEmail(request.email())) {
            throw new ConflictException("AccountEmail already exists: " + request.email());
        }

        SystemAccount account = SystemAccount.builder()
                .accountId(request.id())
                .accountName(request.name())
                .accountEmail(request.email())
                .accountRole(request.role())
                .accountPassword(request.password() != null ? request.password() : "@123")
                .build();

        return mapToResponse(accountRepository.save(account));
    }

    @Override
    public AccountResponse updateAccount(String id, AccountRequest request) {
        SystemAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + id));

        account.setAccountName(request.name());
        account.setAccountRole(request.role());
        if (request.password() != null && !request.password().isBlank()) {
            account.setAccountPassword(request.password());
        }

        return mapToResponse(accountRepository.save(account));
    }

    @Override
    public void deleteAccount(String id) {
        if (!accountRepository.existsById(id)) {
            throw new ResourceNotFoundException("Account not found with ID: " + id);
        }

        // Constraint check from assignment requirements
        if (newsRepository.existsByCreatedBy_AccountId(id)) {
            throw new ConflictException("Cannot delete account: This account has already created news articles!");
        }

        accountRepository.deleteById(id);
    }

    private AccountResponse mapToResponse(SystemAccount a) {
        return new AccountResponse(a.getAccountId(), a.getAccountName(), a.getAccountEmail(), a.getAccountRole());
    }
}
