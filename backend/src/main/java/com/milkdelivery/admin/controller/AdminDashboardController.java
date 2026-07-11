package com.milkdelivery.admin.controller;

import com.milkdelivery.admin.dto.AdminDashboardResponse;
import com.milkdelivery.admin.service.AdminService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final AdminService adminService;

    public AdminDashboardController(
            AdminService adminService
    ) {
        this.adminService = adminService;
    }

    @GetMapping
    public AdminDashboardResponse getDashboard() {
        return adminService.getDashboard();
    }
}