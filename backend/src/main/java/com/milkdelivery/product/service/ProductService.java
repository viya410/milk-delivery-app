package com.milkdelivery.product.service;

import com.milkdelivery.inventory.entity.Inventory;
import com.milkdelivery.inventory.repository.InventoryRepository;
import com.milkdelivery.inventory.service.InventoryService;
import com.milkdelivery.product.entity.Product;
import com.milkdelivery.product.repository.ProductRepository;
import org.springframework.stereotype.Service;
import com.milkdelivery.exception.ProductNotFoundException;
import com.milkdelivery.product.entity.ProductSize;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    private final InventoryRepository inventoryRepository;
    private final InventoryService inventoryService;

    public ProductService(
            ProductRepository productRepository,
            InventoryRepository inventoryRepository,
            InventoryService inventoryService
    ) {
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.inventoryService = inventoryService;
    }

    public List<Product> getAllProducts() {

        return productRepository.findAll();

    }

    /**
     * Category-aware customer catalogue. Legacy rows without a category are
     * treated as dairy so existing products remain visible after rollout.
     */
    public List<Product> getProductsByCategory(
            com.milkdelivery.product.entity.ProductCategory category
    ) {
        return productRepository.findAll().stream()
                .filter(product -> product.getCategory() == category
                        || (category == com.milkdelivery.product.entity.ProductCategory.DAIRY
                        && product.getCategory() == null))
                .toList();
    }

    public Product getProductById(
            Long id
    ) {

        return productRepository
                .findById(id)
                .orElseThrow(() ->
                        new ProductNotFoundException(id)
                );

    }

    public Product addProduct(Product product) {

        if (product.getSizes() != null) {
            for (ProductSize size : product.getSizes()) {
                size.setProduct(product);
            }
        }

        Product savedProduct = productRepository.save(product);

        inventoryService.createInventory(savedProduct);

        return savedProduct;
    }

    public Product updateProduct(
            Long id,
            Product updatedProduct
    ) {

        Product product = getProductById(id);

        product.setName(updatedProduct.getName());
        product.setDescription(updatedProduct.getDescription());
        product.setPrice(updatedProduct.getPrice());
        product.setMaxOrderQuantity(updatedProduct.getMaxOrderQuantity());
        product.setUnit(updatedProduct.getUnit());
        product.setImageUrl(updatedProduct.getImageUrl());
        product.setCategory(updatedProduct.getCategory());
        product.setAvailable(updatedProduct.getAvailable());
        product.setHasSizeSelection(updatedProduct.getHasSizeSelection());
        product.getSizes().clear();

        if (updatedProduct.getSizes() != null) {

            for (ProductSize size : updatedProduct.getSizes()) {

                size.setProduct(product);

                product.getSizes().add(size);

            }

        }

        return productRepository.save(product);

    }

    public void deleteProduct(
            Long id
    ) {

        Product product = getProductById(id);

        inventoryRepository
                .findByProduct(product)
                .ifPresent(inventoryRepository::delete);

        productRepository.delete(product);

    }

}