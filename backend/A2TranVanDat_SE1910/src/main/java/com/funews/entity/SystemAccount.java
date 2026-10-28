package com.funews.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "SystemAccount")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemAccount {

    @Id
    @Column(name = "AccountID", length = 20)
    private String accountId;

    @Column(name = "AccountName", length = 100, nullable = false)
    private String accountName;

    @Column(name = "AccountEmail", length = 150, unique = true, nullable = false)
    private String accountEmail;

    @Column(name = "AccountRole", nullable = false)
    private Integer accountRole; // 1 = Admin, 2 = Staff

    @Column(name = "AccountPassword", length = 255, nullable = false)
    private String accountPassword;
}
