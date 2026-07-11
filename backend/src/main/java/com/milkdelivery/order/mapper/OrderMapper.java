package com.milkdelivery.order.mapper;

import com.milkdelivery.order.dto.OrderItemResponse;
import com.milkdelivery.order.dto.OrderResponse;
import com.milkdelivery.order.entity.Order;
import org.springframework.stereotype.Component;

@Component
public class OrderMapper {

    public OrderResponse toOrderResponse(Order order) {

        String address = String.join(", ",
                order.getAddress().getHouseNo(),
                order.getAddress().getStreet(),
                order.getAddress().getCity(),
                order.getAddress().getState(),
                order.getAddress().getPincode()
        );

        return new OrderResponse(
                order.getId(),
                order.getUser().getFullName(),
                order.getUser().getEmail(),
                order.getUser().getPhoneNumber(),
                address,
                order.getTotalAmount(),
                order.getStatus().name(),
                order.getOrderDate(),
                order.getItems()
                        .stream()
                        .map(item -> new OrderItemResponse(
                                item.getProduct().getId(),
                                item.getProduct().getName(),
                                item.getProduct().getPrice(),
                                item.getProduct().getUnit(),
                                item.getQuantity()
                        ))
                        .toList()
        );
    }

}