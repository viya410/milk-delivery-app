package com.milkdelivery.admin.controller;

import com.milkdelivery.admin.service.AdminService;
import com.milkdelivery.order.dto.OrderResponse;
import com.milkdelivery.order.entity.OrderStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    private final AdminService adminService;

    public AdminOrderController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping
    public List<OrderResponse> getOrders() {
        return adminService.getAllOrders();
    }

    @GetMapping("/{id}")
    public OrderResponse getOrder(@PathVariable Long id) {
        return adminService.getOrder(id);
    }

    @PutMapping("/{id}/status")
    public OrderResponse updateStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status
    ) {
        return adminService.updateOrderStatus(id, status);
    }

    @GetMapping("/today")
    public List<OrderResponse> getTodayDeliveries() {

        return adminService.getTodayDeliveries();

    }
}