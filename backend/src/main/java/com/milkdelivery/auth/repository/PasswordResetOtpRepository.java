package com.milkdelivery.auth.repository;

import com.milkdelivery.auth.entity.PasswordResetOtp;
import com.milkdelivery.user.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordResetOtpRepository extends JpaRepository<PasswordResetOtp, Long> {
    Optional<PasswordResetOtp> findTopByUserAndUsedAtIsNullOrderByCreatedAtDesc(User user);
    void deleteByUser(User user);
}
