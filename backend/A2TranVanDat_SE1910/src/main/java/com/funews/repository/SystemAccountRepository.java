package com.funews.repository;

import com.funews.entity.SystemAccount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SystemAccountRepository extends JpaRepository<SystemAccount, String> {
    Optional<SystemAccount> findByAccountEmail(String email);
    boolean existsByAccountEmail(String email);
    Page<SystemAccount> findByAccountNameContainingIgnoreCaseOrAccountEmailContainingIgnoreCase(
            String name, String email, Pageable pageable);
}
