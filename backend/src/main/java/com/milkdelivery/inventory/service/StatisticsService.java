package com.milkdelivery.inventory.service;

import com.milkdelivery.inventory.dto.DailyStatistics;
import com.milkdelivery.inventory.entity.Inventory;
import com.milkdelivery.inventory.repository.InventoryRepository;
import org.springframework.stereotype.Service;

@Service
public class StatisticsService {

    private final InventoryRepository inventoryRepository;

    public StatisticsService(
            InventoryRepository inventoryRepository
    ) {

        this.inventoryRepository = inventoryRepository;

    }

    public DailyStatistics generateDailyStatistics() {

        DailyStatistics statistics = new DailyStatistics();

        double closingStock = inventoryRepository

                .findAll()

                .stream()

                .mapToDouble(Inventory::getCurrentStock)

                .sum();

        statistics.setOpeningStock(0.0);

        statistics.setClosingStock(closingStock);

        statistics.setTotalCollected(0.0);

        statistics.setTotalSold(0.0);

        statistics.setTotalWaste(0.0);

        statistics.setTotalRevenue(0.0);

        statistics.setTotalOrders(0);

        statistics.setTotalSubscriptions(0);

        return statistics;

    }

}