package com.milkdelivery.auth.repository;

import com.milkdelivery.auth.entity.PasswordResetToken;
import com.milkdelivery.user.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByTokenHashAndUsedAtIsNull(String tokenHash);
    void deleteByUser(User user);
}
