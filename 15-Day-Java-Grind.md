# 15-Day Java Core & OOP Grind Plan

**Goal:** Master Java fundamentals and OOP principles in 15 intensive days
**Daily Commitment:** 8 hours of focused coding and learning
**No shortcuts, no frameworks - just raw Java mastery**

---

## Days 1-3: Foundation Lock-In
**Objective:** Master the building blocks

### Day 1: Classes, Objects, Encapsulation
**Learning Goals:**
- Understand what objects really are
- Master private fields and public methods
- Write proper constructors with validation
- Create meaningful getters/setters

**Morning Session (3 hours):**
- Theory: Object-oriented thinking
- Practice: Basic class creation
- Exercises: Field access and method design

**Afternoon Project (4 hours):**
Create 5 complete classes with full encapsulation:
1. **Person** (name, age, email with validation)
2. **BankAccount** (balance, account number, owner)
3. **Car** (make, model, year, mileage)
4. **Book** (title, author, ISBN, availability)
5. **Student** (name, student ID, GPA, courses)

**Evening Review (1 hour):**
- Test all classes thoroughly
- Review encapsulation principles
- Plan tomorrow's challenges

**Success Criteria:**
- [ ] All fields are private
- [ ] Constructors validate input
- [ ] Methods protect object state
- [ ] Can create and use multiple objects

---

### Day 2: Methods & Parameters Deep Dive
**Learning Goals:**
- Methods that take objects as parameters
- Methods that return objects
- Method overloading mastery
- Understanding method signatures

**Morning Session (3 hours):**
- Theory: Method design principles
- Practice: Object parameter passing
- Exercises: Method overloading examples

**Afternoon Challenge (4 hours):**
Extend yesterday's classes with advanced methods:

**Person class methods:**
- `introduceYourself(Person other)`
- `isOlderThan(Person other)`
- `hasSameEmail(Person other)`
- `createFullName(String firstName, String lastName)` (static)

**BankAccount methods:**
- `transferTo(BankAccount recipient, double amount)`
- `compareBalance(BankAccount other)`
- `canAfford(double amount)`
- `calculateInterest(double rate, int years)`

**Method Overloading Challenge:**
Create 5 different versions of a `createStudent` method with different parameters

**Evening Review (1 hour):**
- Test all method interactions
- Review parameter passing
- Debug any issues

**Success Criteria:**
- [ ] Methods modify other objects correctly
- [ ] Proper return value handling
- [ ] Method overloading works
- [ ] Objects interact meaningfully

---

### Day 3: Object Relationships & Composition
**Learning Goals:**
- Objects containing other objects
- One-to-many relationships
- Managing collections of objects
- Complex object interactions

**Morning Session (3 hours):**
- Theory: Object composition vs inheritance
- Practice: Container classes
- Exercises: Managing object collections

**Afternoon Project (4 hours):**
Build a **School Management System:**

**Classes to create:**
1. **Student** (name, ID, grades, courses)
2. **Teacher** (name, subject, salary, students)
3. **Course** (name, code, teacher, enrolled students)
4. **Classroom** (room number, capacity, current course)
5. **School** (name, teachers, students, courses)

**Required Methods:**
- `School.addStudent(Student s)`
- `School.assignTeacher(Teacher t, Course c)`
- `Teacher.addStudent(Student s)`
- `Student.enrollInCourse(Course c)`
- `School.findStudentByID(String id)`

**Evening Review (1 hour):**
- Test complex object interactions
- Review composition principles
- Plan collections deep dive

**Success Criteria:**
- [ ] Objects contain other objects
- [ ] Bidirectional relationships work
- [ ] Can navigate object graph
- [ ] All relationships maintained correctly

---

## Days 4-6: Collections Mastery
**Objective:** Handle multiple objects like a pro

### Day 4: ArrayList Deep Dive
**Learning Goals:**
- ArrayList operations mastery
- Working with collections of custom objects
- Searching and sorting objects
- ArrayList best practices

**Morning Session (3 hours):**
- Theory: ArrayList internals
- Practice: Basic operations
- Exercises: Custom object manipulation

**Afternoon Grind (4 hours):**
Create a **Person Management System** with 20 different ArrayList operations:

**CRUD Operations:**
1. `addPerson(Person p)`
2. `removePerson(String name)`
3. `findPersonByName(String name)`
4. `updatePersonAge(String name, int newAge)`

**Search Operations:**
5. `findPeopleByAge(int age)`
6. `findPeopleOlderThan(int age)`
7. `findPeopleByEmailDomain(String domain)`
8. `getPeopleInAgeRange(int min, int max)`

**Sort Operations:**
9. `sortByName()`
10. `sortByAge()`
11. `sortByEmail()`
12. `customSort(Comparator<Person> comp)`

**Analysis Operations:**
13. `getAverageAge()`
14. `getOldestPerson()`
15. `getYoungestPerson()`
16. `countPeopleByAgeGroup()`

**Bulk Operations:**
17. `addMultiplePeople(List<Person> people)`
18. `removeAllByAge(int age)`
19. `updateAllEmails(String oldDomain, String newDomain)`
20. `cloneAllPeople()`

**Evening Review (1 hour):**
- Performance analysis
- Memory usage considerations
- Plan HashMap introduction

**Success Criteria:**
- [ ] All 20 operations work correctly
- [ ] Efficient searching and sorting
- [ ] Proper error handling
- [ ] Clean, readable code

---

### Day 5: HashMap & HashSet
**Learning Goals:**
- Key-value storage with objects
- Custom equals() and hashCode()
- Set operations and uniqueness
- When to use each collection type

**Morning Session (3 hours):**
- Theory: Hashing and equality
- Practice: equals() and hashCode()
- Exercises: HashMap operations

**Afternoon Project (4 hours):**
Build a **Student Grade Tracker:**

**Core Classes:**
- **Student** (with proper equals/hashCode)
- **Course** (course code, name, credits)
- **Grade** (student, course, grade value, date)
- **GradeTracker** (manages all data)

**HashMap Usage:**
- `Map<String, Student> studentRegistry` (ID -> Student)
- `Map<Student, List<Grade>> studentGrades`
- `Map<Course, List<Student>> courseEnrollments`
- `Map<String, Course> courseRegistry`

**Required Methods:**
- `addStudent(Student s)`
- `addCourse(Course c)`
- `recordGrade(String studentId, String courseCode, double grade)`
- `getStudentGPA(String studentId)`
- `getCourseAverage(String courseCode)`
- `getTopStudents(int count)`
- `getStudentsInCourse(String courseCode)`

**HashSet Usage:**
- Track unique email addresses
- Manage course prerequisites
- Store completed courses per student

**Evening Review (1 hour):**
- Test hash collision scenarios
- Review performance characteristics
- Debug equality issues

**Success Criteria:**
- [ ] Custom equals/hashCode implemented correctly
- [ ] HashMap operations efficient
- [ ] HashSet prevents duplicates
- [ ] Complex data relationships maintained

---

### Day 6: Advanced Collections
**Learning Goals:**
- LinkedList vs ArrayList trade-offs
- TreeSet and TreeMap for sorting
- Queue and Stack operations
- Choosing the right collection

**Morning Session (3 hours):**
- Theory: Collection performance characteristics
- Practice: Different collection types
- Exercises: Performance comparisons

**Afternoon Challenge (4 hours):**
**Collection Performance Lab:**

Create identical operations using different collections and measure performance:

**Test Data:** 10,000 Person objects

**Operations to benchmark:**
1. **Insertion** (ArrayList vs LinkedList)
2. **Random Access** (ArrayList vs LinkedList)
3. **Search** (ArrayList vs HashSet)
4. **Sorting** (ArrayList vs TreeSet)
5. **Iteration** (All collection types)

**Custom Collection Challenge:**
Implement your own simple collection class:
```java
public class SimplePersonList {
    private Person[] people;
    private int size;
    
    // Implement all basic operations
    public void add(Person p) { }
    public Person get(int index) { }
    public boolean remove(Person p) { }
    public int size() { }
    public boolean contains(Person p) { }
}
```

**Evening Review (1 hour):**
- Analyze benchmark results
- Document when to use each collection
- Plan inheritance deep dive

**Success Criteria:**
- [ ] Understand performance trade-offs
- [ ] Can choose appropriate collection
- [ ] Custom collection works correctly
- [ ] Benchmark results documented

---

## Days 7-9: OOP Principles Hardcore
**Objective:** Write professional-level object-oriented code

### Day 7: Inheritance Deep Dive
**Learning Goals:**
- Parent-child class relationships
- Method overriding vs overloading
- Super keyword mastery
- Inheritance hierarchies

**Morning Session (3 hours):**
- Theory: IS-A relationships
- Practice: Basic inheritance
- Exercises: Method overriding

**Afternoon Project (4 hours):**
Build a comprehensive **Animal Kingdom Hierarchy** (5 levels deep):

**Level 1: Animal** (abstract base)
```java
abstract class Animal {
    protected String name;
    protected int age;
    protected double weight;
    
    public abstract void makeSound();
    public abstract void move();
    public void sleep() { /* default implementation */ }
}
```

**Level 2: Categories**
- `Mammal extends Animal`
- `Bird extends Animal`
- `Fish extends Animal`
- `Reptile extends Animal`

**Level 3: Families**
- `Carnivore extends Mammal`
- `Herbivore extends Mammal`
- `Omnivore extends Mammal`
- `FlightlessBird extends Bird`

**Level 4: Species**
- `Lion extends Carnivore`
- `Wolf extends Carnivore`
- `Elephant extends Herbivore`
- `Bear extends Omnivore`

**Level 5: Specific Animals**
- `AfricanLion extends Lion`
- `AsianElephant extends Elephant`

**Advanced Features:**
- Each level adds specific behavior
- Override methods appropriately
- Use super() correctly
- Implement toString() at each level

**Evening Review (1 hour):**
- Test inheritance chain
- Review method resolution
- Plan polymorphism exercises

**Success Criteria:**
- [ ] 5-level hierarchy works correctly
- [ ] Method overriding implemented properly
- [ ] Super keyword used correctly
- [ ] Each level adds meaningful functionality

---

### Day 8: Polymorphism & Abstract Classes
**Learning Goals:**
- Runtime polymorphism
- Abstract methods and classes
- Interface vs abstract class decisions
- Dynamic method dispatch

**Morning Session (3 hours):**
- Theory: Polymorphism principles
- Practice: Abstract class design
- Exercises: Runtime type resolution

**Afternoon Grind (4 hours):**
Build a **Shape Calculation System:**

**Abstract Base:**
```java
abstract class Shape {
    protected String color;
    protected boolean filled;
    
    // Abstract methods
    public abstract double calculateArea();
    public abstract double calculatePerimeter();
    public abstract void draw();
    
    // Concrete methods
    public void setColor(String color) { this.color = color; }
    public String getInfo() { return "Shape: " + getClass().getSimpleName(); }
}
```

**Concrete Shapes:**
- `Circle extends Shape`
- `Rectangle extends Shape`
- `Triangle extends Shape`
- `Square extends Rectangle`
- `Ellipse extends Shape`
- `Polygon extends Shape` (for irregular shapes)

**Polymorphism Showcase:**
```java
public class ShapeCalculator {
    private List<Shape> shapes;
    
    public double calculateTotalArea() {
        // Use polymorphism to calculate area of all shapes
    }
    
    public void drawAllShapes() {
        // Polymorphic drawing
    }
    
    public List<Shape> findLargestShapes(int count) {
        // Sort by area using polymorphism
    }
}
```

**Advanced Challenge:**
Create a `ShapeFactory` that creates shapes based on parameters:
```java
public static Shape createShape(String type, double... params) {
    // Return appropriate shape based on type
}
```

**Evening Review (1 hour):**
- Test polymorphic behavior
- Review abstract class design
- Plan interface introduction

**Success Criteria:**
- [ ] All shapes calculate correctly
- [ ] Polymorphism works in collections
- [ ] Abstract class provides structure
- [ ] Factory pattern implemented

---

### Day 9: Interfaces & Multiple Inheritance
**Learning Goals:**
- Interface design principles
- Multiple interface implementation
- Interface vs abstract class decisions
- Contract-based programming

**Morning Session (3 hours):**
- Theory: Interface contracts
- Practice: Interface implementation
- Exercises: Multiple inheritance scenarios

**Afternoon Project (4 hours):**
Build a comprehensive **Vehicle System:**

**Core Interfaces:**
```java
interface Drivable {
    void start();
    void stop();
    void accelerate(double speed);
    double getCurrentSpeed();
}

interface Flyable {
    void takeOff();
    void land();
    double getAltitude();
    void setAltitude(double altitude);
}

interface Swimmable {
    void dive(double depth);
    void surface();
    double getCurrentDepth();
}

interface Electric {
    void charge();
    double getBatteryLevel();
    double getRange();
}

interface FuelPowered {
    void refuel(double amount);
    double getFuelLevel();
    double getMilesPerGallon();
}
```

**Vehicle Classes:**
- `Car implements Drivable, FuelPowered`
- `ElectricCar implements Drivable, Electric`
- `Airplane implements Drivable, Flyable, FuelPowered`
- `Helicopter implements Flyable, FuelPowered`
- `Submarine implements Swimmable, Electric`
- `AmphibiousCar implements Drivable, Swimmable, FuelPowered`
- `Drone implements Flyable, Electric`

**Management System:**
```java
public class TransportationManager {
    public void startAllVehicles(List<Drivable> vehicles) { }
    public void chargeAllElectric(List<Electric> vehicles) { }
    public void flyAllAircraft(List<Flyable> aircraft) { }
    public double calculateTotalRange(List<? extends Vehicle> vehicles) { }
}
```

**Evening Review (1 hour):**
- Test multiple inheritance scenarios
- Review interface design decisions
- Plan design patterns introduction

**Success Criteria:**
- [ ] Multiple interfaces implemented correctly
- [ ] Interface segregation principle followed
- [ ] Polymorphism works across interfaces
- [ ] Clean separation of concerns

---

## Days 10-12: Advanced OOP Patterns
**Objective:** Think like a senior developer

### Day 10: Design Patterns Basics
**Learning Goals:**
- Factory pattern for object creation
- Builder pattern for complex objects
- Singleton pattern for single instances
- When and why to use each pattern

**Morning Session (3 hours):**
- Theory: Design pattern principles
- Practice: Pattern implementation
- Exercises: Pattern recognition

**Afternoon Challenge (4 hours):**
Implement all 3 patterns with real-world examples:

**1. Factory Pattern - Database Connection:**
```java
public abstract class DatabaseConnection {
    public abstract void connect();
    public abstract void disconnect();
    public abstract void executeQuery(String query);
}

public class DatabaseConnectionFactory {
    public static DatabaseConnection createConnection(String type) {
        // Return MySQL, PostgreSQL, or Oracle connection
    }
}
```

**2. Builder Pattern - Computer Assembly:**
```java
public class Computer {
    private String processor;
    private int ram;
    private String storage;
    private String graphics;
    private boolean hasWifi;
    
    // Private constructor
    private Computer(ComputerBuilder builder) { }
    
    public static class ComputerBuilder {
        // Builder implementation
        public ComputerBuilder setProcessor(String processor) { return this; }
        public ComputerBuilder setRam(int ram) { return this; }
        // ... other setters
        public Computer build() { return new Computer(this); }
    }
}
```

**3. Singleton Pattern - Application Logger:**
```java
public class Logger {
    private static Logger instance;
    private List<String> logs;
    
    private Logger() { }
    
    public static Logger getInstance() {
        // Thread-safe singleton implementation
    }
    
    public void log(String message) { }
    public List<String> getLogs() { }
}
```

**Integration Challenge:**
Create a complete application that uses all three patterns together.

**Evening Review (1 hour):**
- Test all patterns thoroughly
- Review when to use each pattern
- Plan exception handling deep dive

**Success Criteria:**
- [ ] All patterns implemented correctly
- [ ] Understand when to use each pattern
- [ ] Patterns work together seamlessly
- [ ] Thread safety considered

---

### Day 11: Exception Handling Mastery
**Learning Goals:**
- Custom exception hierarchies
- Proper exception handling strategies
- Try-with-resources for cleanup
- Exception best practices

**Morning Session (3 hours):**
- Theory: Exception hierarchy
- Practice: Custom exceptions
- Exercises: Error handling strategies

**Afternoon Project (4 hours):**
Build a **Banking System** with comprehensive error handling:

**Custom Exception Hierarchy:**
```java
public class BankingException extends Exception {
    public BankingException(String message) { super(message); }
}

public class InsufficientFundsException extends BankingException {
    private double requestedAmount;
    private double availableAmount;
    // Constructor and getters
}

public class AccountNotFoundException extends BankingException { }
public class InvalidTransactionException extends BankingException { }
public class AccountClosedException extends BankingException { }
public class DailyLimitExceededException extends BankingException { }
```

**Banking Classes with Exception Handling:**
```java
public class BankAccount {
    public void withdraw(double amount) throws InsufficientFundsException, AccountClosedException {
        // Implementation with proper exception throwing
    }
    
    public void deposit(double amount) throws InvalidTransactionException {
        // Validate and handle errors
    }
}

public class Bank {
    public void transferMoney(String fromAccount, String toAccount, double amount) 
            throws AccountNotFoundException, InsufficientFundsException, InvalidTransactionException {
        // Complex operation with multiple exception possibilities
    }
    
    public BankAccount findAccount(String accountNumber) throws AccountNotFoundException {
        // Search with exception handling
    }
}
```

**Resource Management:**
```java
public class TransactionLogger implements AutoCloseable {
    private FileWriter writer;
    
    public TransactionLogger(String filename) throws IOException {
        writer = new FileWriter(filename, true);
    }
    
    public void logTransaction(String transaction) throws IOException {
        writer.write(transaction + "\n");
    }
    
    @Override
    public void close() throws IOException {
        if (writer != null) writer.close();
    }
}

// Usage with try-with-resources
public void performTransaction() {
    try (TransactionLogger logger = new TransactionLogger("transactions.log")) {
        // Perform banking operations
    } catch (IOException e) {
        // Handle logging errors
    }
}
```

**Evening Review (1 hour):**
- Test all exception scenarios
- Review resource cleanup
- Plan inner classes exploration

**Success Criteria:**
- [ ] Custom exception hierarchy works
- [ ] Proper exception propagation
- [ ] Resources cleaned up correctly
- [ ] Meaningful error messages

---

### Day 12: Inner Classes & Anonymous Classes
**Learning Goals:**
- Nested class relationships
- Inner class access rules
- Anonymous class implementations
- When to use each type

**Morning Session (3 hours):**
- Theory: Inner class types
- Practice: Nested class creation
- Exercises: Access modifier rules

**Afternoon Grind (4 hours):**
Build an **Event Handling System** using various inner class types:

**1. Static Nested Classes:**
```java
public class EventManager {
    private List<Event> events;
    
    // Static nested class for event building
    public static class EventBuilder {
        private String name;
        private Date date;
        private String location;
        
        public EventBuilder setName(String name) { this.name = name; return this; }
        public EventBuilder setDate(Date date) { this.date = date; return this; }
        public EventBuilder setLocation(String location) { this.location = location; return this; }
        
        public Event build() { return new Event(name, date, location); }
    }
}
```

**2. Inner Classes:**
```java
public class Conference {
    private String name;
    private List<Session> sessions;
    
    // Inner class with access to outer class
    public class Session {
        private String title;
        private String speaker;
        
        public void announceSession() {
            System.out.println("At " + Conference.this.name + ": " + title + " by " + speaker);
        }
        
        public Conference getConference() {
            return Conference.this;
        }
    }
    
    public Session createSession(String title, String speaker) {
        return new Session();
    }
}
```

**3. Local Classes:**
```java
public class EventProcessor {
    public void processEvents(List<Event> events, String criteria) {
        // Local class inside method
        class EventFilter {
            public boolean matches(Event event) {
                // Can access method parameters and outer class members
                return event.getDescription().contains(criteria);
            }
        }
        
        EventFilter filter = new EventFilter();
        for (Event event : events) {
            if (filter.matches(event)) {
                // Process matching events
            }
        }
    }
}
```

**4. Anonymous Classes:**
```java
public class EventScheduler {
    private List<EventListener> listeners = new ArrayList<>();
    
    public void addCustomListener() {
        // Anonymous class implementation
        listeners.add(new EventListener() {
            @Override
            public void onEventStart(Event event) {
                System.out.println("Event started: " + event.getName());
            }
            
            @Override
            public void onEventEnd(Event event) {
                System.out.println("Event ended: " + event.getName());
            }
        });
    }
    
    public void addQuickListener(String message) {
        listeners.add(new EventListener() {
            @Override
            public void onEventStart(Event event) {
                System.out.println(message + ": " + event.getName());
            }
            
            @Override
            public void onEventEnd(Event event) {
                // Can access final/effectively final local variables
            }
        });
    }
}
```

**Evening Review (1 hour):**
- Test all inner class types
- Review access rules
- Plan generics deep dive

**Success Criteria:**
- [ ] All inner class types implemented
- [ ] Understand access rules
- [ ] Anonymous classes work correctly
- [ ] Proper encapsulation maintained

---

## Days 13-15: Professional Java Skills
**Objective:** Production-quality code

### Day 13: Generics Deep Dive
**Learning Goals:**
- Generic classes and methods
- Bounded wildcards
- Type erasure understanding
- Generic best practices

**Morning Session (3 hours):**
- Theory: Generic type system
- Practice: Generic class creation
- Exercises: Wildcard usage

**Afternoon Project (4 hours):**
Create comprehensive **Generic Collection Classes:**

**1. Generic Container Class:**
```java
public class Container<T> {
    private List<T> items;
    private int maxSize;
    
    public Container(int maxSize) {
        this.maxSize = maxSize;
        this.items = new ArrayList<>();
    }
    
    public boolean add(T item) {
        if (items.size() < maxSize) {
            items.add(item);
            return true;
        }
        return false;
    }
    
    public T get(int index) { return items.get(index); }
    public int size() { return items.size(); }
    public boolean remove(T item) { return items.remove(item); }
}
```

**2. Generic Pair Class:**
```java
public class Pair<T, U> {
    private T first;
    private U second;
    
    public Pair(T first, U second) {
        this.first = first;
        this.second = second;
    }
    
    public T getFirst() { return first; }
    public U getSecond() { return second; }
    
    public void setFirst(T first) { this.first = first; }
    public void setSecond(U second) { this.second = second; }
    
    @Override
    public String toString() {
        return "(" + first + ", " + second + ")";
    }
}
```

**3. Generic Stack Implementation:**
```java
public class GenericStack<T> {
    private List<T> stack;
    
    public GenericStack() {
        stack = new ArrayList<>();
    }
    
    public void push(T item) { stack.add(item); }
    
    public T pop() {
        if (isEmpty()) throw new IllegalStateException("Stack is empty");
        return stack.remove(stack.size() - 1);
    }
    
    public T peek() {
        if (isEmpty()) throw new IllegalStateException("Stack is empty");
        return stack.get(stack.size() - 1);
    }
    
    public boolean isEmpty() { return stack.isEmpty(); }
    public int size() { return stack.size(); }
}
```

**4. Bounded Generics Example:**
```java
public class NumberContainer<T extends Number> {
    private List<T> numbers;
    
    public NumberContainer() {
        numbers = new ArrayList<>();
    }
    
    public void add(T number) { numbers.add(number); }
    
    public double getSum() {
        return numbers.stream().mapToDouble(Number::doubleValue).sum();
    }
    
    public double getAverage() {
        return getSum() / numbers.size();
    }
    
    public T getMax() {
        return numbers.stream().max((a, b) -> 
            Double.compare(a.doubleValue(), b.doubleValue())).orElse(null);
    }
}
```

**5. Wildcard Usage:**
```java
public class CollectionUtils {
    // Upper bounded wildcard
    public static double sumNumbers(List<? extends Number> numbers) {
        return numbers.stream().mapToDouble(Number::doubleValue).sum();
    }
    
    // Lower bounded wildcard
    public static void addNumbers(List<? super Integer> numbers) {
        for (int i = 1; i <= 10; i++) {
            numbers.add(i);
        }
    }
    
    // Unbounded wildcard
    public static void printList(List<?> list) {
        for (Object item : list) {
            System.out.println(item);
        }
    }
}
```

**Evening Review (1 hour):**
- Test all generic implementations
- Review type safety benefits
- Plan streams and lambdas

**Success Criteria:**
- [ ] Generic classes work with different types
- [ ] Bounded generics implemented correctly
- [ ] Wildcards used appropriately
- [ ] Type safety maintained

---

### Day 14: Streams & Lambda Expressions
**Learning Goals:**
- Functional programming concepts
- Stream operations (map, filter, reduce)
- Lambda expression syntax
- Method references

**Morning Session (3 hours):**
- Theory: Functional programming in Java
- Practice: Lambda expressions
- Exercises: Stream operations

**Afternoon Challenge (4 hours):**
**Rewrite Previous Projects Using Streams:**

**1. Person Management with Streams:**
```java
public class PersonManager {
    private List<Person> people;
    
    // Find people by criteria using streams
    public List<Person> findPeopleByAge(int age) {
        return people.stream()
                    .filter(person -> person.getAge() == age)
                    .collect(Collectors.toList());
    }
    
    public List<Person> findPeopleOlderThan(int age) {
        return people.stream()
                    .filter(person -> person.getAge() > age)
                    .collect(Collectors.toList());
    }
    
    public OptionalDouble getAverageAge() {
        return people.stream()
                    .mapToInt(Person::getAge)
                    .average();
    }
    
    public Map<Integer, List<Person>> groupByAge() {
        return people.stream()
                    .collect(Collectors.groupingBy(Person::getAge));
    }
    
    public List<String> getAllNames() {
        return people.stream()
                    .map(Person::getName)
                    .sorted()
                    .collect(Collectors.toList());
    }
}
```

**2. Advanced Stream Operations:**
```java
public class DataProcessor {
    // Complex filtering and transformation
    public List<String> processStudentData(List<Student> students) {
        return students.stream()
                      .filter(student -> student.getGPA() > 3.5)
                      .filter(student -> student.getAge() < 25)
                      .map(student -> student.getName().toUpperCase())
                      .sorted()
                      .limit(10)
                      .collect(Collectors.toList());
    }
    
    // Parallel processing
    public Map<String, Long> countByMajor(List<Student> students) {
        return students.parallelStream()
                      .collect(Collectors.groupingBy(
                          Student::getMajor,
                          Collectors.counting()
                      ));
    }
    
    // Custom collectors
    public String createReport(List<Student> students) {
        return students.stream()
                      .map(Student::toString)
                      .collect(Collectors.joining("\n", "=== STUDENT REPORT ===\n", "\n=== END REPORT ==="));
    }
}
```

**3. Functional Interfaces:**
```java
// Custom functional interfaces
@FunctionalInterface
public interface StudentValidator {
    boolean validate(Student student);
}

@FunctionalInterface
public interface GradeCalculator {
    double calculate(List<Double> grades);
}

public class StudentProcessor {
    public List<Student> filterStudents(List<Student> students, StudentValidator validator) {
        return students.stream()
                      .filter(validator::validate)
                      .collect(Collectors.toList());
    }
    
    public void processGrades(List<Student> students, GradeCalculator calculator) {
        students.forEach(student -> {
            double finalGrade = calculator.calculate(student.getGrades());
            student.setFinalGrade(finalGrade);
        });
    }
}

// Usage with lambdas
StudentProcessor processor = new StudentProcessor();

// Lambda expressions
List<Student> honorsStudents = processor.filterStudents(students, 
    student -> student.getGPA() > 3.5 && student.getCredits() > 60);

// Method references
processor.processGrades(students, this::calculateWeightedAverage);
```

**Evening Review (1 hour):**
- Compare stream vs traditional approaches
- Review performance implications
- Plan final project

**Success Criteria:**
- [ ] All previous projects converted to streams
- [ ] Lambda expressions used correctly
- [ ] Functional interfaces implemented
- [ ] Performance considerations understood

---

### Day 15: Code Quality & Best Practices
**Learning Goals:**
- Clean code principles
- Documentation standards
- Code review practices
- Professional development habits

**Morning Session (3 hours):**
- Theory: Clean code principles
- Practice: Code refactoring
- Exercises: Documentation writing

**Final Project (4 hours):**
**Build a Portfolio-Worthy Application:**

Create a **Library Management System** that showcases ALL concepts learned:

**Requirements:**
1. **Multiple classes with proper inheritance hierarchy**
2. **Interface implementations**
3. **Generic collections**
4. **Exception handling**
5. **Stream operations**
6. **Design patterns**
7. **Inner classes where appropriate**
8. **Comprehensive documentation**

**Class Structure:**
```java
// Abstract base class
public abstract class LibraryItem {
    protected String id;
    protected String title;
    protected LocalDate dateAdded;
    
    public abstract double calculateLateFee(LocalDate dueDate);
    public abstract boolean isAvailable();
}

// Concrete implementations
public class Book extends LibraryItem implements Borrowable, Reservable {
    private String author;
    private String isbn;
    private Genre genre;
    
    // Implementation with all OOP concepts
}

public class Magazine extends LibraryItem implements Borrowable {
    private int issueNumber;
    private YearMonth publication;
    
    // Implementation
}

public class DVD extends LibraryItem implements Borrowable, Reservable {
    private Duration runtime;
    private List<String> actors;
    
    // Implementation
}

// Generic management class
public class Library<T extends LibraryItem> {
    private Map<String, T> items;
    private List<Member> members;
    private TransactionLogger logger;
    
    // All CRUD operations with streams
    // Exception handling
    // Design patterns implementation
}

// Member management with inner classes
public class Member {
    private String memberId;
    private String name;
    private List<BorrowRecord> borrowHistory;
    
    // Inner class for borrow records
    public class BorrowRecord {
        private LibraryItem item;
        private LocalDate borrowDate;
        private LocalDate dueDate;
        private LocalDate returnDate;
        
        // Full implementation
    }
}
```

**Features to Implement:**
- [ ] Add/remove library items
- [ ] Member registration and management
- [ ] Borrowing and returning system
- [ ] Late fee calculation
- [ ] Search functionality with multiple criteria
- [ ] Reports generation using streams
- [ ] Data persistence (file-based)
- [ ] Reservation system
- [ ] Comprehensive error handling

**Evening Review (1 hour):**
- Code review session
- Documentation completion
- Final testing

**Success Criteria:**
- [ ] All 15 days of concepts integrated
- [ ] Clean, professional code
- [ ] Comprehensive documentation
- [ ] Full test coverage
- [ ] Portfolio-ready application

---

## Success Metrics

### Week 1 (Days 1-5): Foundation
- [ ] Can create any class with proper encapsulation
- [ ] Understands object relationships and composition
- [ ] Masters collection operations

### Week 2 (Days 6-10): Advanced OOP
- [ ] Can design inheritance hierarchies
- [ ] Implements polymorphism correctly
- [ ] Uses design patterns appropriately

### Week 3 (Days 11-15): Professional Skills
- [ ] Handles exceptions properly
- [ ] Uses generics and streams effectively
- [ ] Writes clean, documented code

### Final Portfolio:
- [ ] Complete library management system
- [ ] Demonstrates all learned concepts
- [ ] Professional code quality
- [ ] Ready for job interviews

---

## Daily Tracking

**Day 1:** ⬜ **Day 6:** ⬜ **Day 11:** ⬜  
**Day 2:** ⬜ **Day 7:** ⬜ **Day 12:** ⬜  
**Day 3:** ⬜ **Day 8:** ⬜ **Day 13:** ⬜  
**Day 4:** ⬜ **Day 9:** ⬜ **Day 14:** ⬜  
**Day 5:** ⬜ **Day 10:** ⬜ **Day 15:** ⬜  

---

**Remember:** This is an intensive 15-day grind. Stay committed, ask questions, and build something impressive every single day. Your future self will thank you for this dedication.
