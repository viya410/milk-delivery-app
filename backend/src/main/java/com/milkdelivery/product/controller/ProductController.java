package com.milkdelivery.product.controller;

import com.milkdelivery.product.entity.Product;
import com.milkdelivery.product.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.milkdelivery.product.entity.ProductCategory;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(
            ProductService productService
    ) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> getProducts(
            @RequestParam(required = false) ProductCategory category
    ) {
        return category == null ? productService.getAllProducts() : productService.getProductsByCategory(category);
    }

    @GetMapping("/{id}")
    public Product getProductById(
            @PathVariable Long id
    ) {

        return productService.getProductById(id);

    }

}