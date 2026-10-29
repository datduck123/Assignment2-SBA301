package com.funews.repository;

import com.funews.entity.SystemAccount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface SystemAccountRepository extends JpaRepository<SystemAccount, Short> {
    Optional<SystemAccount> findByAccountEmail(String email);
    boolean existsByAccountEmail(String email);
    Page<SystemAccount> findByAccountNameContainingIgnoreCaseOrAccountEmailContainingIgnoreCase(
            String name, String email, Pageable pageable);

    @Query("SELECT COALESCE(MAX(a.accountId), 0) + 1 FROM SystemAccount a")
    Short getNextAccountId();
}
