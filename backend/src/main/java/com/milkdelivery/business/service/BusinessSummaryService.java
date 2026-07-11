package com.milkdelivery.business.service;

import com.milkdelivery.business.dto.BusinessDaySummaryResponse;
import com.milkdelivery.business.dto.ProductBusinessSummaryResponse;
import com.milkdelivery.inventory.entity.Inventory;
import com.milkdelivery.inventory.entity.InventoryTransaction;
import com.milkdelivery.inventory.entity.TransactionType;
import com.milkdelivery.inventory.repository.InventoryRepository;
import com.milkdelivery.inventory.repository.InventoryTransactionRepository;
import com.milkdelivery.order.entity.Order;
import com.milkdelivery.order.entity.OrderItem;
import com.milkdelivery.order.entity.OrderStatus;
import com.milkdelivery.order.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class BusinessSummaryService {

    private final OrderRepository orderRepository;
    private final InventoryRepository inventoryRepository;
    private final InventoryTransactionRepository transactionRepository;

    public BusinessSummaryService(
            OrderRepository orderRepository,
            InventoryRepository inventoryRepository,
            InventoryTransactionRepository transactionRepository
    ) {
        this.orderRepository = orderRepository;
        this.inventoryRepository = inventoryRepository;
        this.transactionRepository = transactionRepository;
    }

    public BusinessDaySummaryResponse getTodaySummary() {

        LocalDate today = LocalDate.now();

        List<Order> orders =
                orderRepository.findByOrderDateBetweenOrderByOrderDateAsc(
                        today.atStartOfDay(),
                        today.atTime(23, 59, 59)
                );

        List<Inventory> inventory =
                inventoryRepository.findAll();

        List<InventoryTransaction> transactions =
                transactionRepository.findByBusinessDate(today);

        BusinessDaySummaryResponse response =
                new BusinessDaySummaryResponse();

        response.setBusinessDate(today);

        response.setTotalOrders(orders.size());

        response.setDeliveredOrders(
                orders.stream()
                        .filter(o -> o.getStatus() == OrderStatus.DELIVERED)
                        .count()
        );

        response.setCancelledOrders(
                orders.stream()
                        .filter(o -> o.getStatus() == OrderStatus.CANCELLED)
                        .count()
        );

        response.setPendingOrders(
                orders.stream()
                        .filter(o ->
                                o.getStatus() != OrderStatus.DELIVERED &&
                                        o.getStatus() != OrderStatus.CANCELLED
                        )
                        .count()
        );

        response.setTotalRevenue(
                orders.stream()
                        .filter(o -> o.getStatus() == OrderStatus.DELIVERED)
                        .mapToDouble(Order::getTotalAmount)
                        .sum()
        );

        response.setTotalCustomers(
                orders.stream()
                        .map(order -> order.getUser().getId())
                        .distinct()
                        .count()
        );

        response.setOpeningStock(
                inventory.stream()
                        .mapToDouble(Inventory::getCurrentStock)
                        .sum()
        );

        response.setReservedStock(
                inventory.stream()
                        .mapToDouble(Inventory::getReservedStock)
                        .sum()
        );

        response.setAvailableStock(
                inventory.stream()
                        .mapToDouble(Inventory::getAvailableStock)
                        .sum()
        );

        Map<Long, ProductBusinessSummaryResponse> summaryMap =
                new LinkedHashMap<>();

        for (Inventory item : inventory) {

            ProductBusinessSummaryResponse summary =
                    new ProductBusinessSummaryResponse();

            summary.setProductId(item.getProduct().getId());
            summary.setProductName(item.getProduct().getName());

            summary.setCurrentStock(item.getCurrentStock());
            summary.setReservedStock(item.getReservedStock());
            summary.setAvailableStock(item.getAvailableStock());

            summary.setStockAdded(0);
            summary.setStockRemoved(0);
            summary.setQuantitySold(0);
            summary.setRevenue(0);

            summaryMap.put(
                    item.getProduct().getId(),
                    summary
            );

        }

        for (InventoryTransaction tx : transactions) {

            ProductBusinessSummaryResponse summary =
                    summaryMap.get(tx.getProduct().getId());

            if (summary == null) {
                continue;
            }

            switch (tx.getType()) {

                case ADD ->
                        summary.setStockAdded(
                                summary.getStockAdded()
                                        + tx.getQuantity()
                        );

                case REMOVE ->
                        summary.setStockRemoved(
                                summary.getStockRemoved()
                                        + tx.getQuantity()
                        );

                default -> {
                }

            }

        }

        for (Order order : orders) {

            if (order.getStatus() != OrderStatus.DELIVERED) {
                continue;
            }

            for (OrderItem item : order.getItems()) {

                ProductBusinessSummaryResponse summary =
                        summaryMap.get(item.getProduct().getId());

                if (summary == null) {
                    continue;
                }

                summary.setQuantitySold(
                        summary.getQuantitySold()
                                + item.getQuantity()
                );

                summary.setRevenue(
                        summary.getRevenue()
                                + item.getQuantity()
                                * item.getProduct().getPrice()
                );

            }

        }

        response.setProducts(
                new ArrayList<>(summaryMap.values())
        );

        return response;
    }

}