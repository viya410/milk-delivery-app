package com.milkdelivery.auth.service;

import com.milkdelivery.auth.dto.ForgotPasswordRequest;
import com.milkdelivery.auth.dto.ResetPasswordRequest;
import com.milkdelivery.auth.entity.PasswordResetOtp;
import com.milkdelivery.auth.repository.PasswordResetOtpRepository;
import com.milkdelivery.user.entity.User;
import com.milkdelivery.user.repository.UserRepository;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PasswordResetService {
    private static final Logger log = LoggerFactory.getLogger(PasswordResetService.class);
    private static final int MAX_ATTEMPTS = 5;
    private static final int OTP_LIFETIME_MINUTES = 5;
    private static final int RESEND_COOLDOWN_SECONDS = 60;
    private final UserRepository users;
    private final PasswordResetOtpRepository otps;
    private final PasswordEncoder passwordEncoder;
    private final SmsService smsService;
    private final SecureRandom random = new SecureRandom();

    public PasswordResetService(UserRepository users, PasswordResetOtpRepository otps,
            PasswordEncoder passwordEncoder, SmsService smsService) {
        this.users = users; this.otps = otps; this.passwordEncoder = passwordEncoder; this.smsService = smsService;
    }

    @Transactional
    public void requestReset(ForgotPasswordRequest request) {
        users.findByPhoneNumber(request.phoneNumber()).ifPresent(user -> {
            PasswordResetOtp existing = otps.findTopByUserAndUsedAtIsNullOrderByCreatedAtDesc(user).orElse(null);
            Instant now = Instant.now();
            if (existing != null && existing.getLastSentAt().plusSeconds(RESEND_COOLDOWN_SECONDS).isAfter(now)) return;
            String code = String.format("%06d", random.nextInt(1_000_000));
            otps.deleteByUser(user);
            PasswordResetOtp record = new PasswordResetOtp();
            record.setUser(user); record.setOtpHash(hash(code));
            record.setExpiresAt(now.plus(OTP_LIFETIME_MINUTES, ChronoUnit.MINUTES));
            record.setLastSentAt(now); record.setAttempts(0); otps.save(record);
            try { smsService.sendPasswordResetOtp(user.getPhoneNumber(), code); }
            catch (RuntimeException ex) {
                otps.delete(record);
                log.error("Unable to send password reset OTP for user id {}", user.getId(), ex);
                throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Unable to send OTP right now. Please try again later.");
            }
        });
    }

    @Transactional(noRollbackFor = ResponseStatusException.class)
    public void resetPassword(ResetPasswordRequest request) {
        User user = users.findByPhoneNumber(request.phoneNumber()).orElseThrow(this::invalidOtp);
        PasswordResetOtp record = otps.findTopByUserAndUsedAtIsNullOrderByCreatedAtDesc(user).orElseThrow(this::invalidOtp);
        if (record.getExpiresAt().isBefore(Instant.now()) || record.getAttempts() >= MAX_ATTEMPTS) {
            otps.delete(record); throw invalidOtp();
        }
        if (!MessageDigest.isEqual(record.getOtpHash().getBytes(StandardCharsets.UTF_8),
                hash(request.otp()).getBytes(StandardCharsets.UTF_8))) {
            record.setAttempts(record.getAttempts() + 1); otps.save(record); throw invalidOtp();
        }
        user.setPassword(passwordEncoder.encode(request.newPassword())); users.save(user);
        record.setUsedAt(Instant.now()); otps.save(record); otps.deleteByUser(user);
    }

    private ResponseStatusException invalidOtp() {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, "The OTP is invalid or has expired. Request a new OTP and try again.");
    }
    private String hash(String value) {
        try {
            return java.util.HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) { throw new IllegalStateException("Unable to process OTP", ex); }
    }
}
