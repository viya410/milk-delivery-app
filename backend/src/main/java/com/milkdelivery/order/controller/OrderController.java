package com.milkdelivery.order.controller;

import com.milkdelivery.cart.entity.CartItem;
import com.milkdelivery.cart.repository.CartItemRepository;
import com.milkdelivery.order.entity.Order;
import com.milkdelivery.order.entity.OrderItem;
import com.milkdelivery.order.repository.OrderRepository;
import com.milkdelivery.user.entity.User;
import com.milkdelivery.user.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;

    private final CartItemRepository cartItemRepository;

    private final UserRepository userRepository;

    public OrderController(

            OrderRepository orderRepository,

            CartItemRepository cartItemRepository,

            UserRepository userRepository

    ) {

        this.orderRepository = orderRepository;

        this.cartItemRepository = cartItemRepository;

        this.userRepository = userRepository;

    }

    private User getCurrentUser(

            Authentication authentication

    ) {

        String username = authentication.getName();

        return userRepository

                .findByEmail(username)

                .or(() ->

                        userRepository.findByPhoneNumber(username)

                )

                .orElseThrow();

    }

    @PostMapping
    public Order placeOrder(

            Authentication authentication

    ) {

        User user = getCurrentUser(authentication);

        List<CartItem> cartItems =

                cartItemRepository.findByUser(user);

        List<OrderItem> orderItems =

                new ArrayList<>();

        double total = 0;

        Order order = new Order();

        order.setUser(user);

        order.setOrderDate(LocalDateTime.now());

        order.setStatus("PLACED");

        for (CartItem cartItem : cartItems) {

            OrderItem item = new OrderItem();

            item.setProduct(cartItem.getProduct());

            item.setQuantity(cartItem.getQuantity());

            // IMPORTANT
            item.setOrder(order);

            orderItems.add(item);

            total += cartItem.getProduct().getPrice()
                    * cartItem.getQuantity();

        }

        order.setItems(orderItems);

        order.setTotalAmount(total);

        Order savedOrder =

                orderRepository.save(order);

        cartItemRepository.deleteAll(cartItems);

        return savedOrder;

    }

    @GetMapping
    public List<Order> getOrders(

            Authentication authentication

    ) {

        User user = getCurrentUser(authentication);

        return orderRepository.findByUserOrderByOrderDateDesc(user);
    }

}