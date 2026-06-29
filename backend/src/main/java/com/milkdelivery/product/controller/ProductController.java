package com.milkdelivery.product.controller;

import com.milkdelivery.product.entity.Product;
import com.milkdelivery.product.repository.ProductRepository;

import org.springframework.web.bind.annotation.*;

        import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(
            ProductRepository productRepository
    ) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<Product> getProducts() {

        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public Product getProductById(
            @PathVariable Long id
    ) {

        return productRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found with id: " + id
                        )
                );
    }
}