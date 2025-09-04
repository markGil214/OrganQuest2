# OOP Fundamentals Lesson 1: Composition Over Inheritance (Real-World Service Design)

## 1. Concept Explanation

Think of inheritance as "is-a" relationships and composition as "has-a" relationships. Here's the key insight most developers miss: **inheritance creates tight coupling and rigid hierarchies**, while **composition creates flexible, testable, and maintainable systems**.

### Why Composition Wins in Real Systems

**Inheritance problems:**
- Deep hierarchies become brittle (change parent, break children)
- Multiple inheritance conflicts (diamond problem)
- Hard to test (can't mock parent behavior easily)
- Violates Single Responsibility Principle (classes do too much)

**Composition advantages:**
- **Flexibility**: Swap implementations at runtime
- **Testability**: Mock individual components easily
- **Single Responsibility**: Each class has one clear purpose
- **Reusability**: Components can be reused in different contexts

### Real-World Scenario: E-commerce Order Processing

Instead of creating a massive `Order` class hierarchy, we'll compose an order processing system from smaller, focused components. Think of it like building with LEGO blocks rather than carving from a single piece of wood.

**Reflection prompt**: Think about a complex system you've worked on. How many classes inherited from a base class? How often did you need to change the parent class and break child classes?

## 2. Code Example: E-commerce Order Processing System

Here's a realistic example showing composition in action - an order processing system with payment, inventory, shipping, and notification concerns:

```java
// Domain entities and value objects
public record CustomerId(String value) {
    public CustomerId {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("Customer ID cannot be empty");
        }
    }
}

public record ProductId(String value) {
    public ProductId {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("Product ID cannot be empty");
        }
    }
}

public record Money(BigDecimal amount, String currency) {
    public Money {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Amount cannot be negative");
        }
        if (currency == null || currency.trim().isEmpty()) {
            throw new IllegalArgumentException("Currency cannot be empty");
        }
    }
    
    public Money add(Money other) {
        if (!this.currency.equals(other.currency)) {
            throw new IllegalArgumentException("Cannot add different currencies");
        }
        return new Money(this.amount.add(other.amount), this.currency);
    }
    
    public Money multiply(int quantity) {
        return new Money(this.amount.multiply(BigDecimal.valueOf(quantity)), this.currency);
    }
}

public record OrderItem(ProductId productId, String productName, int quantity, Money unitPrice) {
    public OrderItem {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }
    }
    
    public Money totalPrice() {
        return unitPrice.multiply(quantity);
    }
}

public record Address(String street, String city, String state, String zipCode, String country) {
    public Address {
        if (street == null || street.trim().isEmpty()) {
            throw new IllegalArgumentException("Street cannot be empty");
        }
        if (city == null || city.trim().isEmpty()) {
            throw new IllegalArgumentException("City cannot be empty");
        }
        // Additional validations...
    }
}

// Order aggregate with composition
public class Order {
    private final String orderId;
    private final CustomerId customerId;
    private final List<OrderItem> items;
    private final Address shippingAddress;
    private OrderStatus status;
    private final Instant createdAt;
    private Instant updatedAt;
    
    public Order(String orderId, CustomerId customerId, List<OrderItem> items, Address shippingAddress) {
        this.orderId = validateOrderId(orderId);
        this.customerId = customerId;
        this.items = new ArrayList<>(items); // Defensive copy
        this.shippingAddress = shippingAddress;
        this.status = OrderStatus.PENDING;
        this.createdAt = Instant.now();
        this.updatedAt = this.createdAt;
        
        if (items.isEmpty()) {
            throw new IllegalArgumentException("Order must have at least one item");
        }
    }
    
    private String validateOrderId(String orderId) {
        if (orderId == null || orderId.trim().isEmpty()) {
            throw new IllegalArgumentException("Order ID cannot be empty");
        }
        return orderId;
    }
    
    public Money calculateTotal() {
        return items.stream()
                   .map(OrderItem::totalPrice)
                   .reduce(Money::add)
                   .orElse(new Money(BigDecimal.ZERO, "USD"));
    }
    
    public void updateStatus(OrderStatus newStatus) {
        this.status = newStatus;
        this.updatedAt = Instant.now();
    }
    
    // Getters
    public String getOrderId() { return orderId; }
    public CustomerId getCustomerId() { return customerId; }
    public List<OrderItem> getItems() { return new ArrayList<>(items); } // Defensive copy
    public Address getShippingAddress() { return shippingAddress; }
    public OrderStatus getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}

public enum OrderStatus {
    PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
}

// Service interfaces (composition contracts)
public interface PaymentProcessor {
    PaymentResult processPayment(Order order, PaymentMethod paymentMethod);
}

public interface InventoryService {
    InventoryCheckResult checkAvailability(List<OrderItem> items);
    void reserveItems(List<OrderItem> items);
    void releaseReservation(List<OrderItem> items);
}

public interface ShippingService {
    ShippingQuote calculateShipping(Address address, List<OrderItem> items);
    ShippingLabel createShippingLabel(Order order);
}

public interface NotificationService {
    void sendOrderConfirmation(Order order);
    void sendShippingNotification(Order order, String trackingNumber);
}

public interface OrderRepository {
    void save(Order order);
    Optional<Order> findById(String orderId);
    List<Order> findByCustomerId(CustomerId customerId);
}

// Supporting classes
public record PaymentMethod(String type, String details) {}

public record PaymentResult(boolean success, String transactionId, String errorMessage) {
    public static PaymentResult success(String transactionId) {
        return new PaymentResult(true, transactionId, null);
    }
    
    public static PaymentResult failure(String errorMessage) {
        return new PaymentResult(false, null, errorMessage);
    }
}

public record InventoryCheckResult(boolean allAvailable, Map<ProductId, Integer> availableQuantities) {}

public record ShippingQuote(Money cost, int estimatedDays) {}

public record ShippingLabel(String trackingNumber, String labelUrl) {}

// Main service using composition (NOT inheritance)
public class OrderProcessingService {
    private final PaymentProcessor paymentProcessor;
    private final InventoryService inventoryService;
    private final ShippingService shippingService;
    private final NotificationService notificationService;
    private final OrderRepository orderRepository;
    
    // Constructor injection - composition in action
    public OrderProcessingService(
            PaymentProcessor paymentProcessor,
            InventoryService inventoryService,
            ShippingService shippingService,
            NotificationService notificationService,
            OrderRepository orderRepository) {
        
        this.paymentProcessor = paymentProcessor;
        this.inventoryService = inventoryService;
        this.shippingService = shippingService;
        this.notificationService = notificationService;
        this.orderRepository = orderRepository;
    }
    
    public OrderProcessingResult processOrder(Order order, PaymentMethod paymentMethod) {
        try {
            // Step 1: Check inventory availability
            InventoryCheckResult inventoryCheck = inventoryService.checkAvailability(order.getItems());
            if (!inventoryCheck.allAvailable()) {
                return OrderProcessingResult.failure("Some items are not available");
            }
            
            // Step 2: Reserve inventory
            inventoryService.reserveItems(order.getItems());
            
            try {
                // Step 3: Process payment
                PaymentResult paymentResult = paymentProcessor.processPayment(order, paymentMethod);
                if (!paymentResult.success()) {
                    inventoryService.releaseReservation(order.getItems());
                    return OrderProcessingResult.failure("Payment failed: " + paymentResult.errorMessage());
                }
                
                // Step 4: Update order status and save
                order.updateStatus(OrderStatus.CONFIRMED);
                orderRepository.save(order);
                
                // Step 5: Create shipping label
                ShippingLabel shippingLabel = shippingService.createShippingLabel(order);
                
                // Step 6: Send notifications
                notificationService.sendOrderConfirmation(order);
                notificationService.sendShippingNotification(order, shippingLabel.trackingNumber());
                
                return OrderProcessingResult.success(order.getOrderId(), paymentResult.transactionId());
                
            } catch (Exception e) {
                // Compensating action: release reserved inventory
                inventoryService.releaseReservation(order.getItems());
                throw e;
            }
            
        } catch (Exception e) {
            return OrderProcessingResult.failure("Order processing failed: " + e.getMessage());
        }
    }
    
    public Optional<Order> getOrder(String orderId) {
        return orderRepository.findById(orderId);
    }
    
    public List<Order> getCustomerOrders(CustomerId customerId) {
        return orderRepository.findByCustomerId(customerId);
    }
}

public record OrderProcessingResult(boolean success, String orderId, String transactionId, String errorMessage) {
    public static OrderProcessingResult success(String orderId, String transactionId) {
        return new OrderProcessingResult(true, orderId, transactionId, null);
    }
    
    public static OrderProcessingResult failure(String errorMessage) {
        return new OrderProcessingResult(false, null, null, errorMessage);
    }
}

// Concrete implementations (can be swapped easily)
public class StripePaymentProcessor implements PaymentProcessor {
    @Override
    public PaymentResult processPayment(Order order, PaymentMethod paymentMethod) {
        // Simulate Stripe API call
        System.out.println("Processing payment via Stripe for order: " + order.getOrderId());
        System.out.println("Amount: " + order.calculateTotal());
        
        // Simulate some processing time and potential failure
        if (order.calculateTotal().amount().compareTo(new BigDecimal("10000")) > 0) {
            return PaymentResult.failure("Amount exceeds credit limit");
        }
        
        return PaymentResult.success("stripe_" + UUID.randomUUID().toString());
    }
}

public class DatabaseInventoryService implements InventoryService {
    private final Map<ProductId, Integer> inventory = new HashMap<>();
    private final Map<ProductId, Integer> reservations = new HashMap<>();
    
    public DatabaseInventoryService() {
        // Initialize with some sample inventory
        inventory.put(new ProductId("LAPTOP-001"), 50);
        inventory.put(new ProductId("MOUSE-001"), 100);
        inventory.put(new ProductId("KEYBOARD-001"), 75);
    }
    
    @Override
    public InventoryCheckResult checkAvailability(List<OrderItem> items) {
        Map<ProductId, Integer> availableQuantities = new HashMap<>();
        boolean allAvailable = true;
        
        for (OrderItem item : items) {
            int available = inventory.getOrDefault(item.productId(), 0);
            int reserved = reservations.getOrDefault(item.productId(), 0);
            int actuallyAvailable = available - reserved;
            
            availableQuantities.put(item.productId(), actuallyAvailable);
            
            if (actuallyAvailable < item.quantity()) {
                allAvailable = false;
            }
        }
        
        return new InventoryCheckResult(allAvailable, availableQuantities);
    }
    
    @Override
    public void reserveItems(List<OrderItem> items) {
        for (OrderItem item : items) {
            reservations.merge(item.productId(), item.quantity(), Integer::sum);
        }
        System.out.println("Reserved items: " + items);
    }
    
    @Override
    public void releaseReservation(List<OrderItem> items) {
        for (OrderItem item : items) {
            reservations.merge(item.productId(), -item.quantity(), Integer::sum);
            if (reservations.get(item.productId()) <= 0) {
                reservations.remove(item.productId());
            }
        }
        System.out.println("Released reservations for items: " + items);
    }
}

public class FedExShippingService implements ShippingService {
    @Override
    public ShippingQuote calculateShipping(Address address, List<OrderItem> items) {
        // Simulate shipping calculation
        BigDecimal baseCost = new BigDecimal("9.99");
        Money shippingCost = new Money(baseCost, "USD");
        return new ShippingQuote(shippingCost, 3);
    }
    
    @Override
    public ShippingLabel createShippingLabel(Order order) {
        String trackingNumber = "FEDEX" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String labelUrl = "https://fedex.com/labels/" + trackingNumber;
        System.out.println("Created FedEx shipping label: " + trackingNumber);
        return new ShippingLabel(trackingNumber, labelUrl);
    }
}

public class EmailNotificationService implements NotificationService {
    @Override
    public void sendOrderConfirmation(Order order) {
        System.out.println("Sending order confirmation email for order: " + order.getOrderId());
        System.out.println("Customer: " + order.getCustomerId().value());
        System.out.println("Total: " + order.calculateTotal());
    }
    
    @Override
    public void sendShippingNotification(Order order, String trackingNumber) {
        System.out.println("Sending shipping notification for order: " + order.getOrderId());
        System.out.println("Tracking number: " + trackingNumber);
    }
}

public class InMemoryOrderRepository implements OrderRepository {
    private final Map<String, Order> orders = new ConcurrentHashMap<>();
    
    @Override
    public void save(Order order) {
        orders.put(order.getOrderId(), order);
        System.out.println("Saved order: " + order.getOrderId());
    }
    
    @Override
    public Optional<Order> findById(String orderId) {
        return Optional.ofNullable(orders.get(orderId));
    }
    
    @Override
    public List<Order> findByCustomerId(CustomerId customerId) {
        return orders.values().stream()
                    .filter(order -> order.getCustomerId().equals(customerId))
                    .collect(Collectors.toList());
    }
}

// Example usage and testing
public class OrderProcessingExample {
    public static void main(String[] args) {
        // Compose the service with different implementations
        OrderProcessingService orderService = new OrderProcessingService(
            new StripePaymentProcessor(),
            new DatabaseInventoryService(),
            new FedExShippingService(),
            new EmailNotificationService(),
            new InMemoryOrderRepository()
        );
        
        // Create a sample order
        CustomerId customerId = new CustomerId("CUST-12345");
        Address shippingAddress = new Address(
            "123 Main St", "Anytown", "CA", "12345", "USA"
        );
        
        List<OrderItem> items = List.of(
            new OrderItem(
                new ProductId("LAPTOP-001"), 
                "Gaming Laptop", 
                1, 
                new Money(new BigDecimal("999.99"), "USD")
            ),
            new OrderItem(
                new ProductId("MOUSE-001"), 
                "Wireless Mouse", 
                2, 
                new Money(new BigDecimal("29.99"), "USD")
            )
        );
        
        Order order = new Order("ORD-" + UUID.randomUUID().toString(), customerId, items, shippingAddress);
        
        // Process the order
        PaymentMethod paymentMethod = new PaymentMethod("credit_card", "****-****-****-1234");
        OrderProcessingResult result = orderService.processOrder(order, paymentMethod);
        
        if (result.success()) {
            System.out.println("Order processed successfully!");
            System.out.println("Order ID: " + result.orderId());
            System.out.println("Transaction ID: " + result.transactionId());
        } else {
            System.out.println("Order processing failed: " + result.errorMessage());
        }
        
        // Demonstrate flexibility: easily swap implementations
        System.out.println("\n--- Using different implementations ---");
        
        OrderProcessingService alternativeService = new OrderProcessingService(
            new PayPalPaymentProcessor(), // Different payment processor
            new DatabaseInventoryService(),
            new UPSShippingService(), // Different shipping service
            new SMSNotificationService(), // Different notification method
            new InMemoryOrderRepository()
        );
        
        // Same order processing logic works with different implementations
        OrderProcessingResult alternativeResult = alternativeService.processOrder(order, paymentMethod);
        System.out.println("Alternative processing result: " + alternativeResult.success());
    }
}

// Alternative implementations to demonstrate flexibility
class PayPalPaymentProcessor implements PaymentProcessor {
    @Override
    public PaymentResult processPayment(Order order, PaymentMethod paymentMethod) {
        System.out.println("Processing payment via PayPal for order: " + order.getOrderId());
        return PaymentResult.success("paypal_" + UUID.randomUUID().toString());
    }
}

class UPSShippingService implements ShippingService {
    @Override
    public ShippingQuote calculateShipping(Address address, List<OrderItem> items) {
        Money shippingCost = new Money(new BigDecimal("12.99"), "USD");
        return new ShippingQuote(shippingCost, 2);
    }
    
    @Override
    public ShippingLabel createShippingLabel(Order order) {
        String trackingNumber = "UPS" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String labelUrl = "https://ups.com/labels/" + trackingNumber;
        System.out.println("Created UPS shipping label: " + trackingNumber);
        return new ShippingLabel(trackingNumber, labelUrl);
    }
}

class SMSNotificationService implements NotificationService {
    @Override
    public void sendOrderConfirmation(Order order) {
        System.out.println("Sending order confirmation SMS for order: " + order.getOrderId());
    }
    
    @Override
    public void sendShippingNotification(Order order, String trackingNumber) {
        System.out.println("Sending shipping SMS for order: " + order.getOrderId());
        System.out.println("Track at: " + trackingNumber);
    }
}
```

Notice how each component has a single responsibility and can be tested in isolation. The `OrderProcessingService` doesn't inherit from anything - it composes behavior from injected dependencies.

## 3. Mini Exercise

**Challenge**: Extend the e-commerce system with a new feature - **Order Cancellation with Refunds**.

Requirements:
1. Add a `RefundProcessor` interface and implementation
2. Create an `OrderCancellationService` that uses composition (not inheritance)
3. The service should:
   - Check if order can be cancelled (not yet shipped)
   - Process refund through the payment processor
   - Release inventory reservations
   - Update order status to CANCELLED
   - Send cancellation notification

**Guiding questions**: 
- How will you compose the cancellation service?
- What dependencies does it need?
- How can you make it testable?

Try implementing this before looking at the solution!

## 4. Solution with Line-by-Line Explanation

```java
// New interface for refund processing
public interface RefundProcessor {
    RefundResult processRefund(String transactionId, Money amount);
}

// Refund result value object
public record RefundResult(boolean success, String refundId, String errorMessage) {
    public static RefundResult success(String refundId) {
        return new RefundResult(true, refundId, null);
    }
    
    public static RefundResult failure(String errorMessage) {
        return new RefundResult(false, null, errorMessage);
    }
}

// Order cancellation service using composition
public class OrderCancellationService {
    private final OrderRepository orderRepository;           // Access to orders
    private final RefundProcessor refundProcessor;           // Process refunds
    private final InventoryService inventoryService;         // Release inventory
    private final NotificationService notificationService;   // Notify customer
    
    // Constructor injection - all dependencies injected
    public OrderCancellationService(
            OrderRepository orderRepository,
            RefundProcessor refundProcessor,
            InventoryService inventoryService,
            NotificationService notificationService) {
        
        this.orderRepository = orderRepository;
        this.refundProcessor = refundProcessor;
        this.inventoryService = inventoryService;
        this.notificationService = notificationService;
    }
    
    public CancellationResult cancelOrder(String orderId, String transactionId) {
        // Step 1: Retrieve the order
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            return CancellationResult.failure("Order not found: " + orderId);
        }
        
        Order order = orderOpt.get();
        
        // Step 2: Check if order can be cancelled
        if (!canBeCancelled(order)) {
            return CancellationResult.failure(
                "Order cannot be cancelled. Current status: " + order.getStatus()
            );
        }
        
        try {
            // Step 3: Process refund first (most critical operation)
            Money refundAmount = order.calculateTotal();
            RefundResult refundResult = refundProcessor.processRefund(transactionId, refundAmount);
            
            if (!refundResult.success()) {
                return CancellationResult.failure("Refund failed: " + refundResult.errorMessage());
            }
            
            // Step 4: Release inventory reservations
            inventoryService.releaseReservation(order.getItems());
            
            // Step 5: Update order status
            order.updateStatus(OrderStatus.CANCELLED);
            orderRepository.save(order);
            
            // Step 6: Notify customer
            notificationService.sendCancellationNotification(order, refundResult.refundId());
            
            return CancellationResult.success(orderId, refundResult.refundId());
            
        } catch (Exception e) {
            return CancellationResult.failure("Cancellation failed: " + e.getMessage());
        }
    }
    
    // Business rule: only pending or confirmed orders can be cancelled
    private boolean canBeCancelled(Order order) {
        return order.getStatus() == OrderStatus.PENDING || 
               order.getStatus() == OrderStatus.CONFIRMED;
    }
}

// Result object for cancellation operations
public record CancellationResult(boolean success, String orderId, String refundId, String errorMessage) {
    public static CancellationResult success(String orderId, String refundId) {
        return new CancellationResult(true, orderId, refundId, null);
    }
    
    public static CancellationResult failure(String errorMessage) {
        return new CancellationResult(false, null, null, errorMessage);
    }
}

// Add cancellation notification to NotificationService interface
public interface NotificationService {
    void sendOrderConfirmation(Order order);
    void sendShippingNotification(Order order, String trackingNumber);
    void sendCancellationNotification(Order order, String refundId); // New method
}

// Implementation of refund processor
public class StripeRefundProcessor implements RefundProcessor {
    @Override
    public RefundResult processRefund(String transactionId, Money amount) {
        System.out.println("Processing refund via Stripe");
        System.out.println("Transaction ID: " + transactionId);
        System.out.println("Refund amount: " + amount);
        
        // Simulate API call to Stripe
        if (transactionId.startsWith("stripe_")) {
            String refundId = "refund_" + UUID.randomUUID().toString();
            return RefundResult.success(refundId);
        } else {
            return RefundResult.failure("Invalid Stripe transaction ID");
        }
    }
}

// Update email notification service
public class EmailNotificationService implements NotificationService {
    @Override
    public void sendOrderConfirmation(Order order) {
        System.out.println("Sending order confirmation email for order: " + order.getOrderId());
    }
    
    @Override
    public void sendShippingNotification(Order order, String trackingNumber) {
        System.out.println("Sending shipping notification for order: " + order.getOrderId());
    }
    
    @Override
    public void sendCancellationNotification(Order order, String refundId) {
        System.out.println("Sending cancellation email for order: " + order.getOrderId());
        System.out.println("Refund ID: " + refundId);
        System.out.println("Refund amount: " + order.calculateTotal());
    }
}
```

**Line-by-line explanation:**

1. **Interface definition**: `RefundProcessor` follows the same pattern as other service interfaces - single responsibility, easy to mock/test
2. **Value object**: `RefundResult` provides type-safe success/failure handling
3. **Constructor injection**: All dependencies are injected, making the service completely configurable and testable
4. **Order retrieval**: We validate the order exists before proceeding
5. **Business rule check**: `canBeCancelled()` encapsulates the business logic for when cancellation is allowed
6. **Refund first**: We process the refund before changing any state - if refund fails, we don't want to modify the order
7. **Inventory release**: Free up the reserved items for other customers
8. **State update**: Change order status and persist the change
9. **Notification**: Inform the customer about the successful cancellation

**Why this design works:**
- **Single Responsibility**: Each service does one thing well
- **Testable**: You can easily mock each dependency to test different scenarios
- **Flexible**: Want to use a different refund processor? Just inject a different implementation
- **Maintainable**: Business logic is clear and separated from technical concerns

## 5. Diagnostic Question (MCQ)

**Question**: You're designing a document processing system that needs to handle PDFs, Word documents, and Excel files. Each document type needs parsing, validation, and conversion capabilities. A junior developer suggests this inheritance hierarchy:

```java
abstract class DocumentProcessor {
    abstract void parse();
    abstract void validate();
    abstract void convert();
}

class PDFProcessor extends DocumentProcessor { ... }
class WordProcessor extends DocumentProcessor { ... }
class ExcelProcessor extends DocumentProcessor { ... }
```

What's the main problem with this approach, and what composition-based solution would be better?

**A)** The inheritance is fine, but we should add more methods to the base class for better functionality

**B)** The problem is tight coupling - changes to DocumentProcessor affect all subclasses. Better to compose with separate Parser, Validator, and Converter interfaces

**C)** We should use multiple inheritance instead to get more flexibility

**D)** The abstract class should be concrete with default implementations

**Correct Answer: B**

**Explanation:**

**Why B is correct:**
- The inheritance approach creates tight coupling between the base class and all implementations
- If you need to change how parsing works, you affect all document types
- Testing becomes harder because you can't easily mock individual parsing/validation/conversion behaviors
- You can't easily reuse parsing logic across different document types
- Adding new document types requires inheriting the entire behavior set

**Better composition approach:**
```java
public class DocumentProcessor {
    private final Parser parser;
    private final Validator validator;
    private final Converter converter;
    
    public DocumentProcessor(Parser parser, Validator validator, Converter converter) {
        this.parser = parser;
        this.validator = validator;
        this.converter = converter;
    }
    
    public ProcessingResult process(Document document) {
        ParsedDocument parsed = parser.parse(document);
        ValidationResult validation = validator.validate(parsed);
        if (!validation.isValid()) {
            return ProcessingResult.failure(validation.getErrors());
        }
        ConvertedDocument converted = converter.convert(parsed);
        return ProcessingResult.success(converted);
    }
}
```

**Why other answers are wrong:**
- **A**: Adding more methods makes the coupling worse, not better
- **C**: Java doesn't support multiple inheritance, and even if it did, it would create more coupling problems
- **D**: Concrete implementations in base classes create hidden dependencies and make testing harder

The key insight: **Favor composition over inheritance when you have multiple concerns that vary independently**. In this case, parsing, validation, and conversion are separate concerns that should be composed together, not inherited as a bundle.

---

**Next lesson preview**: We'll dive into "Value Objects and Immutability with Records" - how to create bulletproof domain models that prevent bugs and make your code more expressive.

Ready for the next lesson? Reply with "next lesson" or pick another topic from the roadmap!
