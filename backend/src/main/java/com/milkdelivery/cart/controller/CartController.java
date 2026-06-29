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

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartItemRepository cartItemRepository;

    private final ProductRepository productRepository;

    private final UserRepository userRepository;

    public CartController(

            CartItemRepository cartItemRepository,

            ProductRepository productRepository,

            UserRepository userRepository

    ) {

        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;

    }

    private User getCurrentUser(
            Authentication authentication
    ) {

        String username =
                authentication.getName();

        return userRepository

                .findByEmail(username)

                .or(() ->

                        userRepository.findByPhoneNumber(

                                username

                        )

                )

                .orElseThrow();

    }

    private CartItemResponse toResponse(
            CartItem item
    ) {

        return new CartItemResponse(

                item.getId(),

                item.getProduct().getId(),

                item.getProduct().getName(),

                item.getProduct().getPrice(),

                item.getProduct().getImageUrl(),

                item.getQuantity()

        );

    }

    @PostMapping
    public CartItemResponse addToCart(

            @RequestBody AddToCartRequest request,

            Authentication authentication

    ) {

        User user =
                getCurrentUser(authentication);

        Product product =

                productRepository

                        .findById(

                                request.getProductId()

                        )

                        .orElseThrow();

        CartItem existingItem =

                cartItemRepository

                        .findByProductAndUser(

                                product,

                                user

                        )

                        .orElse(null);

        if (

                existingItem != null

        ) {

            existingItem.setQuantity(

                    existingItem.getQuantity()

                            +

                            request.getQuantity()

            );

            return toResponse(

                    cartItemRepository.save(

                            existingItem

                    )

            );

        }

        CartItem item = new CartItem();

        item.setProduct(product);

        item.setUser(user);

        item.setQuantity(

                request.getQuantity()

        );

        return toResponse(

                cartItemRepository.save(item)

        );

    }

    @GetMapping
    public List<CartItemResponse> getCart(

            Authentication authentication

    ) {

        User user =
                getCurrentUser(authentication);

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

        CartItem item =

                cartItemRepository

                        .findById(id)

                        .orElseThrow();

        item.setQuantity(

                item.getQuantity() + 1

        );

        return toResponse(

                cartItemRepository.save(item)

        );

    }

    @PutMapping("/{id}/decrease")
    public void decreaseQuantity(

            @PathVariable Long id

    ) {

        CartItem item =

                cartItemRepository

                        .findById(id)

                        .orElseThrow();

        if (

                item.getQuantity() > 1

        ) {

            item.setQuantity(

                    item.getQuantity() - 1

            );

            cartItemRepository.save(item);

        }

        else {

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

        User user =
                getCurrentUser(authentication);

        cartItemRepository.deleteAll(

                cartItemRepository.findByUser(user)

        );

    }

}