package com.milkdelivery.product.repository;

import com.milkdelivery.product.entity.Product;
import com.milkdelivery.product.entity.ProductSize;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductSizeRepository extends JpaRepository<ProductSize, Long> {

    List<ProductSize> findByProduct(Product product);

}