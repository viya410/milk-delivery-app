package com.milkdelivery.inventory.service;

import com.milkdelivery.exception.BusinessDayNotOpenException;
import com.milkdelivery.exception.InsufficientStockException;
import com.milkdelivery.exception.InventoryNotFoundException;
import com.milkdelivery.exception.InvalidQuantityException;
import com.milkdelivery.inventory.dto.InventoryResponse;
import com.milkdelivery.inventory.dto.InventoryTransactionResponse;
import com.milkdelivery.inventory.entity.Inventory;
import com.milkdelivery.inventory.entity.InventoryDay;
import com.milkdelivery.inventory.entity.InventoryDayStatus;
import com.milkdelivery.inventory.entity.InventoryTransaction;
import com.milkdelivery.inventory.entity.TransactionType;
import com.milkdelivery.inventory.repository.InventoryDayRepository;
import com.milkdelivery.inventory.repository.InventoryRepository;
import com.milkdelivery.inventory.repository.InventoryTransactionRepository;
import com.milkdelivery.product.entity.Product;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    private final InventoryTransactionRepository transactionRepository;

    private final InventoryDayRepository inventoryDayRepository;

    public InventoryService(
            InventoryRepository inventoryRepository,
            InventoryTransactionRepository transactionRepository,
            InventoryDayRepository inventoryDayRepository
    ) {

        this.inventoryRepository = inventoryRepository;
        this.transactionRepository = transactionRepository;
        this.inventoryDayRepository = inventoryDayRepository;
    }

    /**
     * Creates inventory for a product.
     * Called only from ProductService.
     */
    public void createInventory(
            Product product
    ) {

        if (inventoryRepository.existsByProduct(product)) {

            return;

        }

        Inventory inventory = new Inventory();

        inventory.setProduct(product);

        inventory.setCurrentStock(0.0);

        inventory.setReservedStock(0.0);

        inventoryRepository.save(inventory);

    }

    /**
     * Returns all inventory.
     */
    public List<InventoryResponse> getAllInventory() {

        return inventoryRepository.findAll()

                .stream()

                .map(this::toResponse)

                .toList();

    }

    /**
     * Returns inventory for one product.
     */
    public InventoryResponse getInventory(
            Long productId
    ) {

        Inventory inventory = inventoryRepository

                .findByProductId(productId)

                .orElseThrow(() ->
                        new InventoryNotFoundException(productId)
                );

        return toResponse(inventory);

    }

    @Transactional
    public InventoryResponse addStock(

            Long productId,

            Double quantity,

            String remarks

    ) {

        if (quantity == null || quantity <= 0) {

            throw new InvalidQuantityException();

        }

        Inventory inventory = inventoryRepository

                .findByProductId(productId)

                .orElseThrow(() ->
                        new InventoryNotFoundException(productId)
                );

        inventory.setCurrentStock(

                inventory.getCurrentStock() + quantity

        );

        inventoryRepository.save(inventory);

        createTransaction(

                inventory.getProduct(),

                TransactionType.ADD,

                quantity,

                remarks,

                null

        );

        return toResponse(inventory);

    }

    @Transactional
    public InventoryResponse removeStock(

            Long productId,

            Double quantity,

            String remarks

    ) {

        if (quantity == null || quantity <= 0) {

            throw new InvalidQuantityException();

        }

        Inventory inventory = inventoryRepository

                .findByProductId(productId)

                .orElseThrow(() ->
                        new InventoryNotFoundException(productId)
                );

        if (inventory.getCurrentStock() < quantity) {

            throw new InsufficientStockException();

        }

        inventory.setCurrentStock(

                inventory.getCurrentStock() - quantity

        );

        inventoryRepository.save(inventory);

        createTransaction(

                inventory.getProduct(),

                TransactionType.REMOVE,

                quantity,

                remarks,

                null

        );

        return toResponse(inventory);

    }

    @Transactional
    public InventoryResponse adjustStock(

            Long productId,

            Double quantity,

            String remarks

    ) {

        if (quantity == null || quantity < 0) {

            throw new InvalidQuantityException();

        }

        Inventory inventory = inventoryRepository

                .findByProductId(productId)

                .orElseThrow(() ->
                        new InventoryNotFoundException(productId)
                );

        inventory.setCurrentStock(quantity);

        inventoryRepository.save(inventory);

        createTransaction(

                inventory.getProduct(),

                TransactionType.ADJUST,

                quantity,

                remarks,

                null

        );

        return toResponse(inventory);

    }

    /**
     * Converts entity to DTO.
     */
    private InventoryResponse toResponse(
            Inventory inventory
    ) {

        return new InventoryResponse(

                inventory.getId(),

                inventory.getProduct().getId(),

                inventory.getProduct().getName(),

                inventory.getCurrentStock(),

                inventory.getReservedStock(),

                inventory.getAvailableStock()

        );

    }

    /**
     * Creates an inventory transaction.
     */
    private void createTransaction(

            Product product,

            TransactionType type,

            Double quantity,

            String remarks,

            String reference

    ) {

        InventoryTransaction transaction = new InventoryTransaction();

        transaction.setProduct(product);

        transaction.setType(type);

        transaction.setQuantity(quantity);

        transaction.setRemarks(remarks);

        transaction.setReference(reference);

        transactionRepository.save(transaction);

    }
    @Transactional
    public void openBusinessDay() {

        LocalDate today = LocalDate.now();

        if (isBusinessDayAlreadyOpen(today)) {
            return;
        }

        closePreviousBusinessDay();

        resetInventory(today);

        createBusinessDay(today);

    }

    @Transactional
    public void closeBusinessDay() {

        InventoryDay businessDay = inventoryDayRepository

                .findByStatus(InventoryDayStatus.OPEN)

                .orElseThrow(
                        BusinessDayNotOpenException::new
                );

        businessDay.setStatus(
                InventoryDayStatus.CLOSED
        );

        businessDay.setClosedAt(
                LocalDateTime.now()
        );

        inventoryDayRepository.save(
                businessDay
        );

    }

    public List<InventoryTransactionResponse> getTransactions() {

        return transactionRepository.findAll()
                .stream()
                .sorted((a, b) ->
                        b.getTransactionDate().compareTo(a.getTransactionDate())
                )
                .map(transaction -> new InventoryTransactionResponse(
                        transaction.getId(),
                        transaction.getProduct().getId(),
                        transaction.getProduct().getName(),
                        transaction.getType(),
                        transaction.getQuantity(),
                        transaction.getRemarks(),
                        transaction.getReference(),
                        transaction.getBusinessDate(),
                        transaction.getTransactionDate()
                ))
                .toList();

    }

    @Transactional
    public void reserveStock(Product product, double quantity) {

        Inventory inventory = inventoryRepository.findByProductId(product.getId())
                .orElseThrow(() -> new RuntimeException("Inventory not found."));

        if (inventory.getAvailableStock() < quantity) {
            throw new InsufficientStockException();
        }

        inventory.setReservedStock(
                inventory.getReservedStock() + quantity
        );

        inventoryRepository.save(inventory);

        createTransaction(
                product,
                TransactionType.RESERVE,
                quantity,
                "Order Reserved",
                null
        );

    }

    @Transactional
    public void reserveStock(
            Product product,
            double quantity,
            String remarks,
            String reference
    ) {

        Inventory inventory = inventoryRepository.findByProductId(product.getId())
                .orElseThrow(() -> new RuntimeException("Inventory not found."));

        if (inventory.getAvailableStock() < quantity) {
            throw new InsufficientStockException();
        }

        inventory.setReservedStock(
                inventory.getReservedStock() + quantity
        );

        inventoryRepository.save(inventory);

        createTransaction(
                product,
                TransactionType.RESERVE,
                quantity,
                remarks,
                reference
        );

    }

    @Transactional
    public void releaseReservedStock(Product product, double quantity) {

        Inventory inventory = inventoryRepository.findByProductId(product.getId())
                .orElseThrow(() -> new RuntimeException("Inventory not found."));

        inventory.setReservedStock(
                Math.max(0, inventory.getReservedStock() - quantity)
        );

        inventoryRepository.save(inventory);

        createTransaction(
                product,
                TransactionType.RELEASE,
                quantity,
                "Order Cancelled",
                null
        );

    }

    @Transactional
    public void consumeReservedStock(Product product, double quantity) {

        Inventory inventory = inventoryRepository.findByProductId(product.getId())
                .orElseThrow(() -> new RuntimeException("Inventory not found."));

        if (inventory.getReservedStock() < quantity) {
            throw new RuntimeException("Reserved stock is insufficient.");
        }

        inventory.setReservedStock(
                inventory.getReservedStock() - quantity
        );

        inventory.setCurrentStock(
                inventory.getCurrentStock() - quantity
        );

        inventoryRepository.save(inventory);

        createTransaction(
                product,
                TransactionType.CONSUME,
                quantity,
                "Order Delivered",
                null
        );

    }

    private boolean isBusinessDayAlreadyOpen(LocalDate businessDate) {

        return inventoryDayRepository
                .findByBusinessDateAndStatus(
                        businessDate,
                        InventoryDayStatus.OPEN
                )
                .isPresent();

    }

    private void closePreviousBusinessDay() {

        inventoryDayRepository
                .findByStatus(InventoryDayStatus.OPEN)
                .ifPresent(day -> {

                    day.setStatus(InventoryDayStatus.CLOSED);

                    day.setClosedAt(LocalDateTime.now());

                    inventoryDayRepository.save(day);

                });

    }

    private void resetInventory(LocalDate businessDate) {

        List<Inventory> inventories = inventoryRepository.findAll();

        for (Inventory inventory : inventories) {

            if (inventory.getCurrentStock() > 0) {

                createTransaction(
                        inventory.getProduct(),
                        TransactionType.DAY_RESET,
                        inventory.getCurrentStock(),
                        "Business Day Reset",
                        "OPEN_DAY_" + businessDate
                );

            }

            inventory.setCurrentStock(0.0);

            inventory.setReservedStock(0.0);

            inventoryRepository.save(inventory);

        }

    }

    private void createBusinessDay(LocalDate businessDate) {

        InventoryDay businessDay = new InventoryDay();

        businessDay.setBusinessDate(businessDate);

        businessDay.setStatus(InventoryDayStatus.OPEN);

        inventoryDayRepository.save(businessDay);

    }
}