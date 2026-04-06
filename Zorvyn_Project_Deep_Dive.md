# Zorvyn Finance Project - The Ultimate Deep Dive & Exhaustive Glossary

This document is an exhaustive, line-by-line masterclass of the **Zorvyn Finance Backend**. We leave nothing behind. Below is an incredibly granular, textbook-level breakdown of **every single predefined keyword, core Java class, Spring Boot annotation, and network method** used across the entire application. 

It explains *What it is*, *Where it is used*, *When to use it*, and *Why we depend on it*.

---

## Part 1: Core Java Keywords & Basics

Even before Spring Boot, our codebase relies on foundational Java architecture keywords.

### 1. Access Modifiers: `public`, `private`, `protected`
*   **What they are:** Keywords that restrict who can see or alter a piece of code.
*   **Where Used:** Literally every file (`public class AuthService`, `private final JwtService`).
*   **Why/When:** We mark variables like `secretKey` as `private` to mathematically guarantee no other Java class can accidentally read or overwrite it. We use `protected` in `doFilterInternal` because Spring Security explicitly requires that the method is only callable by internal Spring subsystems.
*   **Real Life:** `private` is a locked safe in a bank. `public` is the front door.

### 2. Structural Keywords: `class`, `interface`, `extends`, `implements`
*   **What they are:** The building blocks of Object-Oriented Programming (OOP).
*   **Where Used:** `public interface UserRepository extends JpaRepository`, `public class CustomUserDetails implements UserDetails`.
*   **Why/When:** 
    *   **`extends`:** Used to inherit tools from a parent container. By typing `extends JpaRepository`, we instantly inherit thousands of lines of raw SQL code.
    *   **`implements`:** A strict contract. By typing `implements UserDetails`, we promise the Java compiler that we will provide specific required methods (like `getPassword()`) or the app will refuse to build.

### 3. Stability Keywords: `final`, `static`, `void`, `var`
*   **What they are:** Modifiers determining mutability.
*   **Where Used:** `public void addCorsMappings`, `private final PasswordEncoder`.
*   **Why/When:**
    *   **`final`:** Used heavily in Services. It locks a variable so it can NEVER be changed after it is created. This protects the backend from memory corruption during millions of network requests.
    *   **`void`:** Tells Java a method performs an action but returns absolutely nothing (e.g., `updateUserRole`).
    *   **`var`:** A modern Java shortcut. Instead of writing `User user = User.builder()...`, we just write `var user`. Output is inferred automatically!

---

## Part 2: Primitives & Core Advanced Java Classes

### 1. `String`, `Long`, `boolean`, `byte[]`
*   **What they are:** Raw computational memory blocks.
*   **Where Used:** Throughout DTOs and Entities.
*   **Why/When:** We use `Long` for Database IDs because MySQL tables can hold billions of rows, exceeding the standard Java `int` limit. We use `byte[]` in `Keys.hmacShaKeyFor` because cryptography requires pure mathematical 0s and 1s, not formatted readable letters.

### 2. `java.util.List<T>` & `java.util.Collection<T>`
*   **What they are:** Dynamic memory containers.
*   **Where Used:** `public List<User> getAllUsers()`.
*   **Why/When:** Standard arrays (`String[]`) cannot magically grow in size. When querying the database, we might get 5 rows or 50,000. `List` handles infinite dynamic memory expansion smoothly.

### 3. `java.math.BigDecimal`
*   **What it is:** High-precision numerical computing class.
*   **Where Used:** Exclusively for `amount`, `totalIncome`, and `netBalance`.
*   **Why/When:** Java natively uses `double` for decimals, which inherently causes floating-point mathematical drift (e.g., $100.00 might internally save as $99.999999). `BigDecimal` completely fixes this, perfectly aligning our application with Wall Street financial software standards.

### 4. `java.util.Optional<T>`
*   **What it is:** A safety wrapper class preventing `NullPointerExceptions`.
*   **Where Used:** `userRepository.findByEmail(request.getEmail()).orElseThrow()`
*   **Why/When:** If a user logs in with an email that doesn't exist, Java natively throws a terrifying crash. By wrapping the database lookup in an `Optional`, Java forces us to safely deal with the "missing data scenario" via `.orElseThrow()`.

### 5. `java.time.LocalDateTime` & `java.util.Date`
*   **What they are:** Temporal clock synchronizers.
*   **Where Used:** Timestamping errors in `GlobalExceptionHandler` and expiring JWT tokens in `JwtService`.
*   **Why/When:** `LocalDateTime.now()` reaches directly into the operating system's CPU clock to grab exact nanoseconds for your MySQL database. `Date` is the older format strictly required by the JWT library for math-based expiration calculations.

### 6. `java.util.stream.Collectors` & `java.util.function.Function`
*   **What they are:** Advanced Java 8 Lambda engine classes.
*   **Where Used:** `GlobalExceptionHandler.java` and `JwtService.java`.
*   **Why/When:** `Function<Claims, T>` allows us to literally pass an *action/method* dynamically. Streams allow us to run through 10 errors at insane speeds, map their outputs into strings, and `.collect(Collectors.joining(", "))` neatly glues them into one perfect sentence, avoiding slow, messy `for` loops.

---

## Part 3: Controller & Web Network Framework

### 1. `jakarta.servlet.http.HttpServletRequest` & `HttpServletResponse`
*   **What they are:** Core HTTP network protocol raw wrappers.
*   **Where Used:** Inside `JwtAuthenticationFilter`.
*   **Why/When:** These contain the raw text bits arriving over the TCP network. `request.getHeader("Authorization")` allows us to sift exactly what the user's browser sent globally. `response` allows us to force network blockades (like a 403 Forbidden intercept).

### 2. `@RestController` & `@RequestMapping`
*   **What they are:** Spring MVC core routing annotations.
*   **Where Used:** Top of all Controllers.
*   **Why/When:** This transforms a normal Java class into an Internet Web Server. The `@RestController` specifically ensures every single return value is heavily formatted into JSON. If we just used `@Controller`, Spring would assume we wanted to return a visual HTML page! `@RequestMapping("/api/auth")` handles the global prefix mapping so we don't have to rewrite it.

### 3. `@PostMapping`, `@GetMapping`, `@PutMapping`, `@DeleteMapping`
*   **What they are:** REST Action Handlers.
*   **Where Used:** Above every API endpoint method.
*   **Why/When:** If you try to run your "Delete Record" java method by sending a Postman "GET" (read) request, this annotation instantly blocks it. It enforces the strict architecture of the internet protocols natively.

### 4. `@RequestBody` & `@PathVariable`
*   **What they are:** Parameter injectors.
*   **Where Used:** Controller method parameters.
*   **Why/When:** `@RequestBody` uses the Jackson library to ingest an enormous block of dynamic JSON text and surgically inject it directly into a Java object (`AuthRequest`). `@PathVariable Long id` intercepts URLs like `/api/records/45` and rips the "45" out dynamically for our logic!

### 5. `ResponseEntity<T>` & `HttpStatus`
*   **What they are:** HTTP Network Envelopes.
*   **Where Used:** Every Controller and Exception Handler.
*   **Why/When:** While we could just return `UserDto`, wrapping it in `ResponseEntity.status(HttpStatus.CREATED).body(dto)` gives us ultimate granular control over the network. We define the payload *and* command the browser to register exact network flags like `200`, `201`, `400`, `403`, `500`.

---

## Part 4: Data Validation & Persistence (JPA/MySQL)

### 1. `@Valid`, `@NotNull`, `@NotBlank`, `@Positive`
*   **What they are:** Jakarta Bean Validation frameworks.
*   **Where Used:** DTO definitions (`FinancialRecordDto`).
*   **Why/When:** Before a request even hits our Java logic, the `@Valid` trigger activates these annotations. `.@NotBlank` ensures no one sends a JSON consisting of spaces (`"   "`). `@Positive` explicitly blocks negative deposits using advanced backend boundary-checks, saving you hundreds of lines of `if (amount <= 0)` code.

### 2. `@Entity`, `@Table`, `@Id`, `@GeneratedValue`
*   **What they are:** Hibernate ORM (Object-Relational Mapping).
*   **Where Used:** `User.java` and `FinancialRecord.java`.
*   **Why/When:** Java doesn't understand SQL tables, and SQL doesn't understand Java Objects. `@Entity` fuses them. `@GeneratedValue(strategy = GenerationType.IDENTITY)` hooks into MySQL's "Auto Increment" native function, proving our app fully synchronizes with database engine-level mechanics perfectly.

### 3. `@Enumerated(EnumType.STRING)`
*   **What it is:** Database Type Converter.
*   **Where Used:** On enums like `RecordType` and `Role`.
*   **Why/When:** If you save a Java enum `Role.ADMIN` to a database natively, MySQL saves it as the number `1`. This ruins the database's readability. This annotation forces serialization strictly into human-readable strings.

### 4. `org.springframework.data.jpa.repository.JpaRepository`
*   **What it is:** The supreme Database interaction library.
*   **Where Used:** `UserRepository` extends it.
*   **Why/When:** By extending this natively provided interface, Spring Boot dynamically types up an invisible class at boot time containing raw optimized SQL statements for `INSERT INTO`, `SELECT * FROM`, `DELETE`, bypassing raw unsecure JDBC database connections totally.

### 5. `@Query`
*   **What it is:** JPQL Custom Executor.
*   **Where Used:** `DashboardRepository` aggregation logic.
*   **Why/When:** When predefined tools aren't enough, we use `@Query("SELECT SUM(f.amount)...")` to force the database engine to do complex math. Doing `findAll()` and adding it in Java would overload your RAM servers. The `@Query` runs strictly inside MySQL's processing core for flawless speed.

---

## Part 5: Lombok Auto-Generation Framework

### 1. `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`
*   **What they are:** Bytecode Injectors.
*   **Where Used:** Top of DTOs and Entities.
*   **Why/When:** Without `@Data`, Java requires 50+ lines of explicit `getAmount()`, `setAmount()` boilerplate. Lombok invisibly rewrites your bytecode immediately before compilation to attach all these perfectly.

### 2. `@Builder`
*   **What it is:** Object Creational Pattern.
*   **Where Used:** In Services (`User.builder().username(x).build()`).
*   **Why/When:** Instead of `new User("Bob", "bob@123.com", "pass", "ADMIN")` where you might accidentally mix up arguments, the Builder forces explicit chaining logic, radically reducing architectural construction bugs.

### 3. `@RequiredArgsConstructor`
*   **What it is:** Dependency Injector.
*   **Where Used:** Services and Controllers.
*   **Why/When:** Rather than writing `@Autowired` everywhere or creating giant constructors manually, this examines any variable declared `private final` and strictly wires them together into memory upon boot time!

---

## Part 6: Core Security (The `security` Package)

### 1. `@EnableWebSecurity` & `@EnableMethodSecurity`
*   **What they are:** The primary gateway alarms.
*   **Where Used:** `SecurityConfig.java`.
*   **Why/When:** Alerts the Spring engine to completely sever its default security algorithms and exclusively utilize our Custom Filter Chain map. `@EnableMethodSecurity` officially arms our internal `@PreAuthorize` method annotations.

### 2. `SecurityFilterChain` & `HttpSecurity`
*   **What they are:** Network Pipeline Directors.
*   **Where Used:** Inside `SecurityConfig.java`.
*   **Why/When:** When the internet traffic comes in, `HttpSecurity` puts them in a strict physical line (a "Chain"). We mathematically define `.requestMatchers("/api/auth/**").permitAll()` to allow login access, but definitively force `.anyRequest().authenticated()` for strict perimeter access control for anything else.

### 3. `SessionCreationPolicy.STATELESS`
*   **What it is:** A memory architecture doctrine.
*   **Where Used:** Configuration line for the session management.
*   **Why/When:** By default, Web Servers build a "Session" inside RAM for every browser, holding data like `isLoggedIn = true`. If 10 million users hit your site, your server crashes. By choosing `STATELESS`, your backend forgets the user instantly after the response is sent. The burden of proof strictly falls on the user to send their JWT Token securely every single time.

### 4. `CorsConfiguration`, `WebMvcConfigurer`, `CorsRegistry`
*   **What they are:** Browser Protocol Enforcement.
*   **Where Used:** `CorsConfig.java`.
*   **Why/When:** Browsers physically block frontend HTML (like a React page on localhost:3000) from talking to backends (localhost:8080) natively unless permission is explicitly given. We implement `WebMvcConfigurer` to dynamically overwrite the `CorsRegistry` map, stating `.allowedOriginPatterns("*")` and explicitly permitting `GET`, `POST`, `OPTIONS` network actions via an authorized handshake sequence.

### 5. `OncePerRequestFilter` & `FilterChain.doFilter(...)`
*   **What they are:** Middleware Pipeline components.
*   **Where Used:** `JwtAuthenticationFilter.java`.
*   **Why/When:** During an internal request, Spring Security may accidentally traverse its own filters multiple times. Enforcing `OncePerRequestFilter` guarantees our custom JWT parsing code operates flawlessly *one time exclusively*. If a user provides a bad token, we call `filterChain.doFilter(request, response)` to bypass our success logic and let the native engine bounce them out.

### 6. `UserDetailsService` & `UserDetails`
*   **What they are:** The Global Identification Interface.
*   **Where Used:** `CustomUserDetails.java` & Database Security hook.
*   **Why/When:** The `UserDetails` interface is mathematically required for Spring Security to function at all. It requires strictly named boolean methods like `.isAccountNonExpired()`, `.isAccountNonLocked()`, `.isCredentialsNonExpired()`, and `.isEnabled()`. We logically map these onto our own custom boolean flags (like `user.isActive()`) so the raw security system can accurately freeze or ban accounts at a systemic level. 

### 7. `GrantedAuthority` & `SimpleGrantedAuthority`
*   **What they are:** Permission Container Objects.
*   **Where Used:** User authentication extraction.
*   **Why/When:** Spring does not understand string literals like `"ADMIN"`. We must mathematically wrap strings inside a `SimpleGrantedAuthority("ROLE_ADMIN")` class. This allows the `@PreAuthorize` engine to quickly compute Boolean evaluations to either authorize or reject function calls deep inside the code!

### 8. `AuthenticationManager` & `UsernamePasswordAuthenticationToken`
*   **What they are:** The Authentication Engine.
*   **Where Used:** `AuthService.java` & the Filter.
*   **Why/When:** `UsernamePasswordAuthenticationToken` is the official "Badge". During a login request, we wrap the raw email & password into this badge and dynamically hand it to the `AuthenticationManager.authenticate()` function. The manager interfaces with the massive backend database, automatically hashes the typed password, mathematically compares it to the database's hashed password, and generates an official success or `BadCredentialsException` seamlessly.

### 9. `SecurityContextHolder.getContext().setAuthentication(...)`
*   **What it is:** The Global Thread Memory Vault.
*   **Where Used:** End of the JWT Filter success check.
*   **Why/When:** Because we are completely stateless, we need a way for the Controller to know who sent the request once the Filter is finished processing. `SecurityContextHolder` places the authenticated User Badge into the exact literal Java Thread executing the request!

---

## Part 7: Encryption & Advanced Cryptography Layer

### 1. `PasswordEncoder` & `BCryptPasswordEncoder`
*   **What they are:** Real-world Hashing Algorithms.
*   **Where Used:** Injected identically in Configs and `AuthService`.
*   **Why/When:** It ensures the payload `$2a$10$wT8K...` is mathematically scrambled using salts so heavily that even if a hacker accessed the raw MySQL `.db` files, they could never reverse-engineer the original passwords. 

### 2. `io.jsonwebtoken.Jwts` & `io.jsonwebtoken.Claims`
*   **What they are:** Third-Party JSON Web Token utilities.
*   **Where Used:** `JwtService.java`.
*   **Why/When:** `Jwts.builder()` crafts a mathematical JSON structure holding our User ID (`Claims`). We inject an Expiration Time and fire `.compact()` to transform the heavy Object into a tiny `eyJhb...` verifiable string for the internet. `Jwts.parserBuilder()` works identically in reverse to prove it was untouched by an attacker. 

### 3. `io.jsonwebtoken.security.Keys` & `io.jsonwebtoken.io.Decoders`
*   **What they are:** Raw Security Cryptography Encoders.
*   **Where Used:** `getSignInKey()`.
*   **Why/When:** Pure text strings (like `my-secret-key`) are natively weak in server processing. `Decoders.BASE64.decode(secretKey)` shreds our `application.properties` secret text into raw binary bit arrays. `Keys.hmacShaKeyFor(byte[])` converts those bits directly into a mathematical Cryptographic Key optimized solely for backend processing structures.

### 4. `SignatureAlgorithm.HS256`
*   **What it is:** Hashing Protocol.
*   **Where Used:** inside `.signWith()`.
*   **Why/When:** Dictates exactly which globally recognized algorithm the server should use to mathematically stamp the token. HS256 is the absolute industry-standard protocol for high-efficiency symmetric locking systems.

---

## Part 8: The Global Interceptors (The Exception Package)

### 1. `@ControllerAdvice`
*   **What it is:** The Global Interceptor Firewall.
*   **Where Used:** `GlobalExceptionHandler.java`.
*   **Why/When:** Instils an application-wide interception logic structure directly over every single Controller in RAM. If the database crashes, or a user sends malformed data, it never throws a Tomcat Error Page. It lands safely within this invisible barrier.

### 2. `@ExceptionHandler(...)`
*   **What it is:** The Conditional Error Matcher.
*   **Where Used:** Preceding every method in `GlobalExceptionHandler`.
*   **Why/When:** Tells the application: "If ANY component globally throws a `BadCredentialsException`, completely bypass normal error throwing, drag the exception here, and allow me to elegantly wrap it into an `ErrorResponse.java`." This ensures the frontend *exclusively* receives organized JSON payloads.

### 3. `MethodArgumentNotValidException` & `ex.getBindingResult().getFieldErrors()`
*   **What they are:** The automated Form Rejection mechanisms.
*   **Why/When:** Generated uniquely when `@Valid` flags a JSON as dangerous. Rather than logging "Request Failed", this extracts extreme granularity: it fetches the `.getBindingResult()` to literally rip outward the precise database field (`getFieldError().getDefaultMessage()`) allowing maximum debugging insight natively returned to the caller automatically. 

---
*(Zorvyn Finance Framework Architecture Breakdown Complete)*
