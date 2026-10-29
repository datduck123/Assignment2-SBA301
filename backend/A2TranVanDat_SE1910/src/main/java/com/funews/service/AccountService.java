package com.funews.service;

import com.funews.dto.request.AccountRequest;
import com.funews.dto.response.AccountResponse;
import com.funews.dto.response.PageDTO;
import org.springframework.data.domain.Pageable;

public interface AccountService {
    PageDTO<AccountResponse> getAllAccounts(String keyword, Pageable pageable);
    AccountResponse getById(String id);
    AccountResponse createAccount(AccountRequest request);
    AccountResponse updateAccount(String id, AccountRequest request);
    void deleteAccount(String id);
}
