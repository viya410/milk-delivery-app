package com.milkdelivery.admin.controller;

import com.milkdelivery.inventory.dto.InventoryResponse;
import com.milkdelivery.inventory.dto.InventoryTransactionResponse;
import com.milkdelivery.inventory.dto.InventoryUpdateRequest;
import com.milkdelivery.inventory.service.InventoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/inventory")
public class AdminInventoryController {

    private final InventoryService inventoryService;

    public AdminInventoryController(
            InventoryService inventoryService
    ) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public List<InventoryResponse> getInventory() {
        return inventoryService.getAllInventory();
    }

    @GetMapping("/{productId}")
    public InventoryResponse getInventory(@PathVariable Long productId) {
        return inventoryService.getInventory(productId);
    }

    @GetMapping("/transactions")
    public List<InventoryTransactionResponse> getTransactions() {
        return inventoryService.getTransactions();
    }

    @PutMapping("/{productId}/add")
    public InventoryResponse addStock(
            @PathVariable Long productId,
            @RequestBody InventoryUpdateRequest request
    ) {
        return inventoryService.addStock(
                productId,
                request.getQuantity(),
                request.getRemarks()
        );
    }

    @PutMapping("/{productId}/remove")
    public InventoryResponse removeStock(
            @PathVariable Long productId,
            @RequestBody InventoryUpdateRequest request
    ) {
        return inventoryService.removeStock(
                productId,
                request.getQuantity(),
                request.getRemarks()
        );
    }

    @PutMapping("/{productId}/adjust")
    public InventoryResponse adjustStock(
            @PathVariable Long productId,
            @RequestBody InventoryUpdateRequest request
    ) {
        return inventoryService.adjustStock(
                productId,
                request.getQuantity(),
                request.getRemarks()
        );
    }

}