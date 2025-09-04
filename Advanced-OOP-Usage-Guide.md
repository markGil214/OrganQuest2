# Advanced OOP Usage Guide: When to Use What

**A practical guide to using OOP concepts correctly in real-world scenarios**

---

## 1. Interfaces: When and How to Use

### **Use Interfaces When:**
- You need multiple classes to implement the same behavior differently
- You want to define a contract that classes must follow
- You need multiple inheritance of behavior (Java doesn't allow multiple class inheritance)
- You want to achieve loose coupling between classes

### **Don't Use Interfaces When:**
- You only have one implementation (YAGNI - You Aren't Gonna Need It)
- You need to share common code (use abstract classes instead)
- All methods would have identical implementations

### **Real-World Examples:**

#### **Payment Processing System**
```java
// Good use of interface - multiple payment methods, same contract
interface PaymentProcessor {
    boolean processPayment(double amount);
    String getTransactionId();
    void refund(String transactionId);
}

class CreditCardProcessor implements PaymentProcessor {
    private String cardNumber;
    private String securityCode;
    
    @Override
    public boolean processPayment(double amount) {
        // Credit card specific logic
        System.out.println("Processing $" + amount + " via Credit Card");
        // Validate card, contact bank, etc.
        return true;
    }
    
    @Override
    public String getTransactionId() {
        return "CC-" + System.currentTimeMillis();
    }
    
    @Override
    public void refund(String transactionId) {
        // Credit card refund logic
        System.out.println("Refunding transaction: " + transactionId);
    }
}

class PayPalProcessor implements PaymentProcessor {
    private String email;
    private String apiKey;
    
    @Override
    public boolean processPayment(double amount) {
        // PayPal specific logic
        System.out.println("Processing $" + amount + " via PayPal");
        // Connect to PayPal API, authenticate, etc.
        return true;
    }
    
    @Override
    public String getTransactionId() {
        return "PP-" + System.currentTimeMillis();
    }
    
    @Override
    public void refund(String transactionId) {
        // PayPal refund logic
        System.out.println("PayPal refunding: " + transactionId);
    }
}

// Usage - polymorphism in action
class CheckoutService {
    public void processOrder(PaymentProcessor processor, double amount) {
        if (processor.processPayment(amount)) {
            String txnId = processor.getTransactionId();
            System.out.println("Order completed. Transaction ID: " + txnId);
        }
    }
}
```

#### **File Operations System**
```java
interface FileProcessor {
    void read(String filename);
    void write(String filename, String content);
    boolean supports(String fileType);
}

class PDFProcessor implements FileProcessor {
    @Override
    public void read(String filename) {
        System.out.println("Reading PDF with special PDF library");
        // Use PDF-specific libraries
    }
    
    @Override
    public void write(String filename, String content) {
        System.out.println("Writing PDF with formatting");
        // Convert to PDF format and write
    }
    
    @Override
    public boolean supports(String fileType) {
        return fileType.equalsIgnoreCase("pdf");
    }
}

class TextProcessor implements FileProcessor {
    @Override
    public void read(String filename) {
        System.out.println("Reading plain text file");
        // Simple file reading
    }
    
    @Override
    public void write(String filename, String content) {
        System.out.println("Writing plain text");
        // Direct text writing
    }
    
    @Override
    public boolean supports(String fileType) {
        return fileType.equalsIgnoreCase("txt");
    }
}
```

---

## 2. Abstract Classes: When and How to Use

### **Use Abstract Classes When:**
- You want to share common code among related classes
- You have some methods that all subclasses should implement the same way
- You have some methods that must be implemented differently by each subclass
- You want to provide a partial implementation

### **Don't Use Abstract Classes When:**
- You don't have any common code to share
- You need multiple inheritance
- All methods would be abstract (use interface instead)

### **Real-World Examples:**

#### **Game Character System**
```java
abstract class Character {
    protected String name;
    protected int health;
    protected int maxHealth;
    protected int level;
    
    public Character(String name, int maxHealth) {
        this.name = name;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.level = 1;
    }
    
    // Common behavior - same for all characters
    public void takeDamage(int damage) {
        health -= damage;
        if (health < 0) health = 0;
        System.out.println(name + " takes " + damage + " damage. Health: " + health);
    }
    
    public void heal(int amount) {
        health += amount;
        if (health > maxHealth) health = maxHealth;
        System.out.println(name + " heals " + amount + ". Health: " + health);
    }
    
    public boolean isAlive() {
        return health > 0;
    }
    
    // Abstract methods - must be implemented by subclasses
    public abstract void attack(Character target);
    public abstract void useSpecialAbility(Character target);
    public abstract String getCharacterType();
}

class Warrior extends Character {
    private int armor;
    
    public Warrior(String name) {
        super(name, 150); // Warriors have high health
        this.armor = 10;
    }
    
    @Override
    public void attack(Character target) {
        int damage = 25;
        System.out.println(name + " swings sword at " + target.name);
        target.takeDamage(damage);
    }
    
    @Override
    public void useSpecialAbility(Character target) {
        int damage = 40;
        System.out.println(name + " uses Shield Bash!");
        target.takeDamage(damage);
    }
    
    @Override
    public String getCharacterType() {
        return "Warrior";
    }
    
    @Override
    public void takeDamage(int damage) {
        int reducedDamage = Math.max(1, damage - armor);
        super.takeDamage(reducedDamage);
    }
}

class Mage extends Character {
    private int mana;
    private int maxMana;
    
    public Mage(String name) {
        super(name, 80); // Mages have low health
        this.maxMana = 100;
        this.mana = maxMana;
    }
    
    @Override
    public void attack(Character target) {
        if (mana >= 10) {
            mana -= 10;
            int damage = 30;
            System.out.println(name + " casts Magic Missile!");
            target.takeDamage(damage);
        } else {
            System.out.println(name + " is out of mana!");
        }
    }
    
    @Override
    public void useSpecialAbility(Character target) {
        if (mana >= 30) {
            mana -= 30;
            int damage = 60;
            System.out.println(name + " casts Fireball!");
            target.takeDamage(damage);
        } else {
            System.out.println(name + " doesn't have enough mana for Fireball!");
        }
    }
    
    @Override
    public String getCharacterType() {
        return "Mage";
    }
}
```

#### **Document Processing System**
```java
abstract class Document {
    protected String filename;
    protected String content;
    protected Date createdDate;
    
    public Document(String filename) {
        this.filename = filename;
        this.createdDate = new Date();
    }
    
    // Common functionality
    public String getFilename() {
        return filename;
    }
    
    public Date getCreatedDate() {
        return createdDate;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public String getContent() {
        return content;
    }
    
    // Template method - defines the workflow
    public final void processDocument() {
        open();
        validateContent();
        save();
        System.out.println("Document processing completed: " + filename);
    }
    
    // Abstract methods that subclasses must implement
    public abstract void open();
    public abstract void save();
    public abstract String getFileExtension();
    
    // Default implementation that can be overridden
    protected void validateContent() {
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalStateException("Document content cannot be empty");
        }
    }
}

class PDFDocument extends Document {
    public PDFDocument(String filename) {
        super(filename);
    }
    
    @Override
    public void open() {
        System.out.println("Opening PDF with PDF reader");
        // PDF-specific opening logic
    }
    
    @Override
    public void save() {
        System.out.println("Saving as PDF with compression");
        // PDF-specific saving logic
    }
    
    @Override
    public String getFileExtension() {
        return ".pdf";
    }
    
    @Override
    protected void validateContent() {
        super.validateContent();
        // Additional PDF-specific validation
        if (content.length() > 10000) {
            System.out.println("Warning: Large PDF content may affect performance");
        }
    }
}

class WordDocument extends Document {
    public WordDocument(String filename) {
        super(filename);
    }
    
    @Override
    public void open() {
        System.out.println("Opening Word document with formatting");
        // Word-specific opening logic
    }
    
    @Override
    public void save() {
        System.out.println("Saving Word document with metadata");
        // Word-specific saving logic
    }
    
    @Override
    public String getFileExtension() {
        return ".docx";
    }
}
```

---

## 3. Inheritance: When and How to Use

### **Use Inheritance When:**
- You have a clear "is-a" relationship
- Subclasses are specialized versions of the parent class
- You want to reuse code and add specific behavior
- The relationship is stable and unlikely to change

### **Don't Use Inheritance When:**
- You just want to reuse some methods (use composition instead)
- The relationship is "has-a" rather than "is-a"
- You might need to inherit from multiple classes
- The hierarchy becomes more than 3 levels deep

### **Real-World Examples:**

#### **Vehicle System (Good Inheritance)**
```java
class Vehicle {
    protected String make;
    protected String model;
    protected int year;
    protected double fuelLevel;
    protected boolean isRunning;
    
    public Vehicle(String make, String model, int year) {
        this.make = make;
        this.model = model;
        this.year = year;
        this.fuelLevel = 100.0;
        this.isRunning = false;
    }
    
    public void start() {
        if (!isRunning && fuelLevel > 0) {
            isRunning = true;
            System.out.println(make + " " + model + " started");
        }
    }
    
    public void stop() {
        isRunning = false;
        System.out.println(make + " " + model + " stopped");
    }
    
    public void refuel(double amount) {
        fuelLevel += amount;
        if (fuelLevel > 100) fuelLevel = 100;
        System.out.println("Refueled. Fuel level: " + fuelLevel + "%");
    }
    
    public String getInfo() {
        return year + " " + make + " " + model;
    }
}

class Car extends Vehicle {
    private int numberOfDoors;
    private boolean hasAirConditioning;
    
    public Car(String make, String model, int year, int doors) {
        super(make, model, year);
        this.numberOfDoors = doors;
        this.hasAirConditioning = true;
    }
    
    public void drive(double distance) {
        if (isRunning && fuelLevel > 0) {
            double fuelUsed = distance * 0.1; // 0.1% fuel per unit distance
            fuelLevel -= fuelUsed;
            if (fuelLevel < 0) fuelLevel = 0;
            System.out.println("Drove " + distance + " units. Fuel remaining: " + fuelLevel + "%");
        } else {
            System.out.println("Cannot drive. Check if car is running and has fuel.");
        }
    }
    
    public void honk() {
        System.out.println("Beep beep!");
    }
    
    @Override
    public String getInfo() {
        return super.getInfo() + " (" + numberOfDoors + " doors)";
    }
}

class Motorcycle extends Vehicle {
    private boolean hasSidecar;
    
    public Motorcycle(String make, String model, int year, boolean hasSidecar) {
        super(make, model, year);
        this.hasSidecar = hasSidecar;
    }
    
    public void ride(double distance) {
        if (isRunning && fuelLevel > 0) {
            double fuelUsed = distance * 0.05; // More fuel efficient
            fuelLevel -= fuelUsed;
            if (fuelLevel < 0) fuelLevel = 0;
            System.out.println("Rode " + distance + " units. Fuel remaining: " + fuelLevel + "%");
        }
    }
    
    public void wheelie() {
        if (isRunning) {
            System.out.println("Performing wheelie!");
        }
    }
    
    @Override
    public String getInfo() {
        return super.getInfo() + (hasSidecar ? " (with sidecar)" : "");
    }
}
```

---

## 4. Composition: When and How to Use

### **Use Composition When:**
- You have a "has-a" relationship
- You want to reuse functionality from multiple classes
- You need flexibility to change behavior at runtime
- You want to avoid deep inheritance hierarchies

### **Don't Use Composition When:**
- You have a clear "is-a" relationship
- The contained object doesn't make sense independently
- You're just trying to avoid inheritance for no good reason

### **Real-World Examples:**

#### **Computer System (Good Composition)**
```java
class Processor {
    private String brand;
    private double speed; // GHz
    
    public Processor(String brand, double speed) {
        this.brand = brand;
        this.speed = speed;
    }
    
    public void execute(String task) {
        System.out.println(brand + " processor executing: " + task + " at " + speed + "GHz");
    }
    
    public String getSpecs() {
        return brand + " " + speed + "GHz";
    }
}

class Memory {
    private int capacity; // GB
    private String type;
    
    public Memory(int capacity, String type) {
        this.capacity = capacity;
        this.type = type;
    }
    
    public void store(String data) {
        System.out.println("Storing data in " + capacity + "GB " + type + " memory");
    }
    
    public String getSpecs() {
        return capacity + "GB " + type;
    }
}

class Storage {
    private int capacity; // GB
    private String type;
    
    public Storage(int capacity, String type) {
        this.capacity = capacity;
        this.type = type;
    }
    
    public void save(String file) {
        System.out.println("Saving " + file + " to " + capacity + "GB " + type);
    }
    
    public String getSpecs() {
        return capacity + "GB " + type;
    }
}

class Computer {
    private String brand;
    private Processor processor;
    private Memory memory;
    private Storage storage;
    private boolean isOn;
    
    public Computer(String brand, Processor processor, Memory memory, Storage storage) {
        this.brand = brand;
        this.processor = processor;
        this.memory = memory;
        this.storage = storage;
        this.isOn = false;
    }
    
    public void powerOn() {
        isOn = true;
        System.out.println(brand + " computer powering on...");
        processor.execute("Boot sequence");
        memory.store("Operating system");
    }
    
    public void powerOff() {
        if (isOn) {
            storage.save("Current session data");
            isOn = false;
            System.out.println(brand + " computer shutting down...");
        }
    }
    
    public void runProgram(String program) {
        if (isOn) {
            processor.execute(program);
            memory.store(program + " data");
        } else {
            System.out.println("Computer is off. Please power on first.");
        }
    }
    
    public void saveFile(String filename) {
        if (isOn) {
            storage.save(filename);
        }
    }
    
    public String getSpecs() {
        return brand + " Computer:\n" +
               "  Processor: " + processor.getSpecs() + "\n" +
               "  Memory: " + memory.getSpecs() + "\n" +
               "  Storage: " + storage.getSpecs();
    }
    
    // Ability to upgrade components (flexibility of composition)
    public void upgradeMemory(Memory newMemory) {
        this.memory = newMemory;
        System.out.println("Memory upgraded to: " + newMemory.getSpecs());
    }
}
```

#### **Order System with Composition**
```java
class Customer {
    private String name;
    private String email;
    private String address;
    
    public Customer(String name, String email, String address) {
        this.name = name;
        this.email = email;
        this.address = address;
    }
    
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getAddress() { return address; }
}

class Product {
    private String id;
    private String name;
    private double price;
    
    public Product(String id, String name, double price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
    
    public String getId() { return id; }
    public String getName() { return name; }
    public double getPrice() { return price; }
}

class OrderItem {
    private Product product;
    private int quantity;
    
    public OrderItem(Product product, int quantity) {
        this.product = product;
        this.quantity = quantity;
    }
    
    public double getSubtotal() {
        return product.getPrice() * quantity;
    }
    
    public Product getProduct() { return product; }
    public int getQuantity() { return quantity; }
    
    @Override
    public String toString() {
        return quantity + "x " + product.getName() + " @ $" + product.getPrice() + 
               " = $" + getSubtotal();
    }
}

class Order {
    private String orderId;
    private Customer customer;
    private List<OrderItem> items;
    private Date orderDate;
    
    public Order(String orderId, Customer customer) {
        this.orderId = orderId;
        this.customer = customer;
        this.items = new ArrayList<>();
        this.orderDate = new Date();
    }
    
    public void addItem(Product product, int quantity) {
        items.add(new OrderItem(product, quantity));
    }
    
    public double getTotal() {
        return items.stream().mapToDouble(OrderItem::getSubtotal).sum();
    }
    
    public void printOrder() {
        System.out.println("Order ID: " + orderId);
        System.out.println("Customer: " + customer.getName());
        System.out.println("Date: " + orderDate);
        System.out.println("Items:");
        for (OrderItem item : items) {
            System.out.println("  " + item);
        }
        System.out.println("Total: $" + getTotal());
    }
    
    public Customer getCustomer() { return customer; }
    public List<OrderItem> getItems() { return items; }
}
```

---

## 5. Polymorphism: When and How to Use

### **Use Polymorphism When:**
- You want to treat different objects the same way
- You have multiple implementations of the same interface
- You want to add new types without changing existing code
- You want runtime behavior selection

### **Real-World Examples:**

#### **Shape Drawing System**
```java
abstract class Shape {
    protected String color;
    
    public Shape(String color) {
        this.color = color;
    }
    
    public abstract double getArea();
    public abstract double getPerimeter();
    public abstract void draw();
    
    public String getColor() {
        return color;
    }
}

class Circle extends Shape {
    private double radius;
    
    public Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }
    
    @Override
    public double getArea() {
        return Math.PI * radius * radius;
    }
    
    @Override
    public double getPerimeter() {
        return 2 * Math.PI * radius;
    }
    
    @Override
    public void draw() {
        System.out.println("Drawing a " + color + " circle with radius " + radius);
    }
}

class Rectangle extends Shape {
    private double width, height;
    
    public Rectangle(String color, double width, double height) {
        super(color);
        this.width = width;
        this.height = height;
    }
    
    @Override
    public double getArea() {
        return width * height;
    }
    
    @Override
    public double getPerimeter() {
        return 2 * (width + height);
    }
    
    @Override
    public void draw() {
        System.out.println("Drawing a " + color + " rectangle " + width + "x" + height);
    }
}

// Polymorphism in action
class DrawingCanvas {
    private List<Shape> shapes;
    
    public DrawingCanvas() {
        shapes = new ArrayList<>();
    }
    
    public void addShape(Shape shape) {
        shapes.add(shape);
    }
    
    public void drawAll() {
        System.out.println("Drawing all shapes:");
        for (Shape shape : shapes) {
            shape.draw(); // Polymorphic call - different behavior for each shape
        }
    }
    
    public double getTotalArea() {
        return shapes.stream().mapToDouble(Shape::getArea).sum();
    }
    
    public void printStatistics() {
        System.out.println("Canvas Statistics:");
        System.out.println("Total shapes: " + shapes.size());
        System.out.println("Total area: " + getTotalArea());
        
        for (Shape shape : shapes) {
            System.out.println("  " + shape.getClass().getSimpleName() + 
                             " - Area: " + shape.getArea() + 
                             ", Perimeter: " + shape.getPerimeter());
        }
    }
}
```

---

## 6. When to Use What: Decision Tree

### **Step 1: Define the Relationship**
- **"Is-a" relationship** → Consider Inheritance or Abstract Classes
- **"Has-a" relationship** → Use Composition
- **"Can-do" relationship** → Use Interfaces

### **Step 2: Consider Code Sharing**
- **Need to share implementation** → Abstract Classes or Inheritance
- **Need multiple behavior contracts** → Interfaces
- **Need to reuse existing objects** → Composition

### **Step 3: Consider Flexibility**
- **Need runtime behavior changes** → Interfaces + Composition
- **Fixed hierarchy** → Inheritance
- **Multiple inheritance needed** → Interfaces

### **Step 4: Consider Future Changes**
- **Likely to add new types** → Interfaces + Polymorphism
- **Stable hierarchy** → Inheritance
- **Need to swap components** → Composition

---

## 7. Common Anti-Patterns to Avoid

### **❌ Wrong: Using Inheritance for Code Reuse**
```java
// BAD - Car doesn't "is-a" Engine
class Car extends Engine {
    public void drive() {
        start(); // Inheriting just to reuse methods
    }
}
```

### **✅ Right: Using Composition**
```java
// GOOD - Car "has-a" Engine
class Car {
    private Engine engine;
    
    public Car(Engine engine) {
        this.engine = engine;
    }
    
    public void drive() {
        engine.start();
    }
}
```

### **❌ Wrong: Interface with One Implementation**
```java
// BAD - Only one implementation, interface is unnecessary
interface UserService {
    void createUser(String name);
}

class UserServiceImpl implements UserService {
    // Only implementation
}
```

### **✅ Right: Direct Class**
```java
// GOOD - Simple class when only one implementation exists
class UserService {
    public void createUser(String name) {
        // Implementation
    }
}
```

---

## 8. Real-World Application: E-commerce System

Here's how to combine all concepts properly:

```java
// Interface for payment processing
interface PaymentProcessor {
    boolean processPayment(double amount);
    String getPaymentType();
}

// Concrete implementations
class CreditCardProcessor implements PaymentProcessor {
    // Implementation
}

class PayPalProcessor implements PaymentProcessor {
    // Implementation
}

// Abstract class for common product behavior
abstract class Product {
    protected String id;
    protected String name;
    protected double price;
    
    // Common implementation
    public abstract String getCategory();
    public abstract double getShippingCost();
}

// Inheritance for specific product types
class PhysicalProduct extends Product {
    private double weight;
    private String dimensions;
    
    @Override
    public String getCategory() {
        return "Physical";
    }
    
    @Override
    public double getShippingCost() {
        return weight * 0.5; // Based on weight
    }
}

class DigitalProduct extends Product {
    private String downloadUrl;
    
    @Override
    public String getCategory() {
        return "Digital";
    }
    
    @Override
    public double getShippingCost() {
        return 0.0; // No shipping for digital products
    }
}

// Composition for order management
class Order {
    private Customer customer;           // Composition
    private List<OrderItem> items;       // Composition
    private PaymentProcessor processor;  // Interface reference
    
    // Order manages relationships between objects
}

// Polymorphism in action
class OrderProcessor {
    public void processOrders(List<Order> orders) {
        for (Order order : orders) {
            // Polymorphic calls - different behavior for each product type
            for (OrderItem item : order.getItems()) {
                Product product = item.getProduct();
                double shipping = product.getShippingCost(); // Polymorphic
                String category = product.getCategory();     // Polymorphic
            }
        }
    }
}
```

---

## Summary: The OOP Decision Matrix

| **Scenario** | **Use This** | **Why** |
|--------------|--------------|---------|
| Multiple classes need same behavior differently | **Interface** | Contract-based polymorphism |
| Share code + enforce some abstract methods | **Abstract Class** | Partial implementation sharing |
| Clear "is-a" relationship | **Inheritance** | Specialization of parent |
| "Has-a" relationship | **Composition** | Object collaboration |
| Need runtime behavior switching | **Interface + Composition** | Flexibility and polymorphism |
| Need to treat different objects the same | **Polymorphism** | Uniform interface |

**Remember:** Start simple, refactor when patterns emerge. Don't over-engineer from the beginning.
