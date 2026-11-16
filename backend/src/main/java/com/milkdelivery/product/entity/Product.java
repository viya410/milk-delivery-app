package com.milkdelivery.product.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(name = "max_order_quantity", nullable = false)
    private Double maxOrderQuantity = 3.0;

    private String unit;

    private String imageUrl;

    @Column(nullable = false)
    private Boolean available = true;

    private Boolean hasSizeSelection = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "category")
    private ProductCategory category = ProductCategory.DAIRY;

    @OneToMany(
            mappedBy = "product",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    @JsonManagedReference
    private List<ProductSize> sizes = new ArrayList<>();

    public Product() {
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getMaxOrderQuantity() {
        return maxOrderQuantity;
    }

    public void setMaxOrderQuantity(Double maxOrderQuantity) {
        this.maxOrderQuantity = maxOrderQuantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }

    public Boolean getHasSizeSelection() {
        return hasSizeSelection;
    }

    public void setHasSizeSelection(Boolean hasSizeSelection) {
        this.hasSizeSelection = hasSizeSelection;
    }

    public ProductCategory getCategory() {
        return category == null ? ProductCategory.DAIRY : category;
    }

    public void setCategory(ProductCategory category) {
        this.category = category == null ? ProductCategory.DAIRY : category;
    }

    public List<ProductSize> getSizes() {
        return sizes;
    }

    public void setSizes(List<ProductSize> sizes) {
        this.sizes = sizes;
    }
}