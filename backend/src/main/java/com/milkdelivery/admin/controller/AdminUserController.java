package com.milkdelivery.admin.controller;

import com.milkdelivery.admin.dto.AdminUserResponse;
import com.milkdelivery.admin.service.AdminService;
import com.milkdelivery.subscription.dto.SubscriptionResponse;
import org.springframework.web.bind.annotation.*;
import com.milkdelivery.admin.dto.UpdateUserRequest;
import com.milkdelivery.user.entity.User;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final AdminService adminService;

    public AdminUserController(
            AdminService adminService
    ) {
        this.adminService = adminService;
    }

    @GetMapping
    public List<AdminUserResponse> getUsers() {
        return adminService.getAllUsers();
    }

    @PutMapping("/{id}")
    public User updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request
    ) {

        return adminService.updateUser(
                id,
                request
        );

    }

    @DeleteMapping("/{id}")
    public void deleteUser(
            @PathVariable Long id
    ) {

        adminService.deleteUser(id);

    }

    @GetMapping("/{id}/subscriptions")
    public List<SubscriptionResponse> getUserSubscriptions(
            @PathVariable Long id
    ) {

        return adminService.getUserSubscriptions(id);

    }
}