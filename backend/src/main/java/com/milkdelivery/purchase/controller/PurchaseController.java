package com.milkdelivery.purchase.controller;

import com.milkdelivery.purchase.dto.PlacePurchaseRequest;
import com.milkdelivery.purchase.dto.PurchaseResponse;
import com.milkdelivery.purchase.service.PurchaseService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {
    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @PostMapping
    public PurchaseResponse placePurchase(@RequestBody PlacePurchaseRequest request,
                                          Authentication authentication) {
        return purchaseService.placePurchase(request, authentication);
    }

    @GetMapping
    public List<PurchaseResponse> getPurchases(Authentication authentication) {
        return purchaseService.getPurchases(authentication);
    }
}
