package com.milkdelivery.auth.service;

import com.milkdelivery.auth.dto.ForgotPasswordRequest;
import com.milkdelivery.auth.dto.ResetPasswordRequest;
import com.milkdelivery.auth.entity.PasswordResetToken;
import com.milkdelivery.auth.repository.PasswordResetTokenRepository;
import com.milkdelivery.user.entity.User;
import com.milkdelivery.user.repository.UserRepository;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PasswordResetService {
    private final UserRepository users;
    private final PasswordResetTokenRepository tokens;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.frontend-url:http://localhost:4200}")
    private String frontendUrl;

    @Value("${spring.mail.username:}")
    private String fromAddress;

    public PasswordResetService(UserRepository users, PasswordResetTokenRepository tokens,
            PasswordEncoder passwordEncoder, JavaMailSender mailSender) {
        this.users = users;
        this.tokens = tokens;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
    }

    @Transactional
    public void requestReset(ForgotPasswordRequest request) {
        String email = request.email().trim();
        users.findByEmailIgnoreCase(email).ifPresent(user -> {
            byte[] bytes = new byte[32];
            secureRandom.nextBytes(bytes);
            String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

            tokens.deleteByUser(user);
            PasswordResetToken reset = new PasswordResetToken();
            reset.setUser(user);
            reset.setTokenHash(hash(rawToken));
            reset.setExpiresAt(Instant.now().plus(30, ChronoUnit.MINUTES));
            tokens.save(reset);

            String link = frontendUrl.replaceAll("/+$", "")
                    + "/auth/reset-password?token=" + rawToken;
            SimpleMailMessage message = new SimpleMailMessage();
            if (fromAddress != null && !fromAddress.isBlank()) message.setFrom(fromAddress);
            message.setTo(email);
            message.setSubject("Reset your RK Farms password");
            message.setText("Hello " + user.getFullName() + ",\n\n"
                    + "Use the link below to choose a new password. This link expires in 30 minutes "
                    + "and can only be used once.\n\n" + link
                    + "\n\nIf you did not request this, you can ignore this email.");
            mailSender.send(message);
        });
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken reset = tokens.findByTokenHashAndUsedAtIsNull(hash(request.token()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "This password reset link is invalid or has expired."));
        if (reset.getExpiresAt().isBefore(Instant.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "This password reset link is invalid or has expired.");
        }
        User user = reset.getUser();
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        users.save(user);
        reset.setUsedAt(Instant.now());
        tokens.save(reset);
        tokens.deleteByUser(user);
    }

    private String hash(String value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(value.getBytes(StandardCharsets.UTF_8));
            return java.util.HexFormat.of().formatHex(digest);
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to process password reset token", exception);
        }
    }
}
