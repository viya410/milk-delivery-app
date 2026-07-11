package com.milkdelivery.cart.controller;

import com.milkdelivery.cart.dto.AddToCartRequest;
import com.milkdelivery.cart.dto.CartItemResponse;
import com.milkdelivery.cart.entity.CartItem;
import com.milkdelivery.cart.repository.CartItemRepository;
import com.milkdelivery.product.entity.Product;
import com.milkdelivery.product.repository.ProductRepository;
import com.milkdelivery.user.entity.User;
import com.milkdelivery.user.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.milkdelivery.product.entity.ProductSize;
import com.milkdelivery.product.repository.ProductSizeRepository;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartItemRepository cartItemRepository;

    private final ProductRepository productRepository;

    private final ProductSizeRepository productSizeRepository;

    private final UserRepository userRepository;

    public CartController(
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            ProductSizeRepository productSizeRepository,
            UserRepository userRepository
    ) {
        this.cartItemRepository = cartItemRepository;

        this.productRepository = productRepository;

        this.productSizeRepository = productSizeRepository;

        this.userRepository = userRepository;
    }

    private User getCurrentUser(Authentication authentication) {

        String username = authentication.getName();

        return userRepository
                .findByEmail(username)
                .or(() -> userRepository.findByPhoneNumber(username))
                .orElseThrow();
    }

    private CartItemResponse toResponse(CartItem item) {

        Double price = item.getProduct().getPrice();

        String unit = item.getProduct().getUnit();

        Long productSizeId = null;

        if (item.getProductSize() != null) {

            price = item.getProductSize().getPrice();

            unit = item.getProductSize().getSize();

            productSizeId = item.getProductSize().getId();

        }

        return new CartItemResponse(

                item.getId(),

                item.getProduct().getId(),

                item.getProduct().getName(),

                price,

                item.getProduct().getImageUrl(),

                item.getQuantity(),

                unit,

                item.getProduct().getMaxOrderQuantity(),

                productSizeId

        );

    }

    @PostMapping
    public CartItemResponse addToCart(
            @RequestBody AddToCartRequest request,
            Authentication authentication
    ) {

        User user = getCurrentUser(authentication);

        Product product = productRepository
                .findById(request.getProductId())
                .orElseThrow();

        ProductSize productSize = null;

        if (request.getProductSizeId() != null) {

            productSize = productSizeRepository
                    .findById(request.getProductSizeId())
                    .orElseThrow();

        }

        CartItem existingItem = cartItemRepository
                .findByProductAndUserAndProductSize(
                        product,
                        user,
                        productSize
                )
                .orElse(null);

        if (existingItem != null) {

            int newQuantity = existingItem.getQuantity() + request.getQuantity();

            if (newQuantity > product.getMaxOrderQuantity()) {

                throw new RuntimeException(
                        "Maximum order quantity for "
                                + product.getName()
                                + " is "
                                + product.getMaxOrderQuantity()
                                + " "
                                + product.getUnit()
                );

            }

            existingItem.setQuantity(newQuantity);

            return toResponse(cartItemRepository.save(existingItem));
        }

        if (request.getQuantity() > product.getMaxOrderQuantity()) {

            throw new RuntimeException(
                    "Maximum order quantity for "
                            + product.getName()
                            + " is "
                            + product.getMaxOrderQuantity()
                            + " "
                            + product.getUnit()
            );

        }

        CartItem item = new CartItem();

        item.setProduct(product);

        item.setProductSize(productSize);

        item.setUser(user);

        item.setQuantity(request.getQuantity());

        return toResponse(cartItemRepository.save(item));

    }

    @GetMapping
    public List<CartItemResponse> getCart(Authentication authentication) {

        User user = getCurrentUser(authentication);

        return cartItemRepository
                .findByUser(user)
                .stream()
                .map(this::toResponse)
                .toList();

    }

    @PutMapping("/{id}/increase")
    public CartItemResponse increaseQuantity(
            @PathVariable Long id
    ) {

        CartItem item = cartItemRepository
                .findById(id)
                .orElseThrow();

        if (item.getQuantity() + 1 > item.getProduct().getMaxOrderQuantity()) {

            throw new RuntimeException(
                    "Maximum order quantity for "
                            + item.getProduct().getName()
                            + " is "
                            + item.getProduct().getMaxOrderQuantity()
                            + " "
                            + item.getProduct().getUnit()
            );

        }

        item.setQuantity(item.getQuantity() + 1);

        return toResponse(cartItemRepository.save(item));

    }

    @PutMapping("/{id}/decrease")
    public void decreaseQuantity(
            @PathVariable Long id
    ) {

        CartItem item = cartItemRepository
                .findById(id)
                .orElseThrow();

        if (item.getQuantity() > 1) {

            item.setQuantity(item.getQuantity() - 1);

            cartItemRepository.save(item);

        } else {

            cartItemRepository.delete(item);

        }

    }

    @DeleteMapping("/{id}")
    public void removeItem(
            @PathVariable Long id
    ) {

        cartItemRepository.deleteById(id);

    }

    @DeleteMapping("/clear")
    public void clearCart(
            Authentication authentication
    ) {

        User user = getCurrentUser(authentication);

        cartItemRepository.deleteAll(
                cartItemRepository.findByUser(user)
        );

    }

}