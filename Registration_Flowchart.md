# 🛣️ Registration API Request Lifecycle
**Endpoint:** `POST /api/auth/register`

Whenever you click "Send" in Postman, the JSON payload physically travels through 12 different logic stages to be converted from a raw network request into a secured MySQL database entry.

### 📊 The Exact File Flowchart

```text
Postman sends HTTP POST with JSON Data
        ↓
Embedded Tomcat Server captures HTTP packet
        ↓
CorsConfig.java verifies origin permissions
        ↓
SecurityConfig.java grants anonymous passage to /api/auth/**
        ↓
AuthController.java receives JSON body
        ↓
Jackson framework maps JSON into RegisterRequest.java DTO
        ↓
AuthService.java hashes password and executes registration logic
        ↓
AuthService processes User.java Entity modeling the database table
        ↓
UserRepository.save(user)
        ↓
Hibernate intercepts to execute persistence context
        ↓
Native MySQL INSERT query is dynamically generated
        ↓
Data is stored permanently in MySQL Database
        ↓
CustomUserDetails.java is loaded for Token configuration
        ↓
JwtService.java utilizes seckret.key to generate Bearer JWT
        ↓
AuthResponse.java DTO encapsulates final tokens
        ↓
AuthController returns 200 OK Response
        ↓
Postman displays final JSON payload
```

---

### 📂 Detailed File Breakdown
If you are asked how the architecture connects, here is the exact file-by-file journey:

1. **`CorsConfig.java`**: Immediately intercepts the request as it enters Spring Boot. It checks if the origin (Postman/Localhost) is allowed to talk to the backend.
2. **`SecurityConfig.java`**: The Spring Security Filter Chain catches it. It sees the URL matches `/api/auth/register`. Because we configured this as `permitAll()`, it bypasses the JWT lock and lets it proceed.
3. **`AuthController.java`**: The `@PostMapping("/register")` annotation catches the payload.
4. **`RegisterRequest.java`**: Spring Boot uses Jackson to magically deserialize your raw Postman JSON (`{"username": "adminUser"...}`) into a heavily structured Java Data Transfer Object (DTO).
5. **`AuthService.java`**: The absolute core brain. The Controller hands the DTO to this service. The service hashes the password via `BCryptPasswordEncoder` and prepares the data.
6. **`User.java`**: The service builds this Entity model utilizing the `@Builder` pattern, tagging the requested `"ADMIN"` role.
7. **`UserRepository.java`**: The Service calls `.save(user)` on this interface.
8. **MySQL Database**: `Hibernate` (the tool powering your Repository) automatically translates the Java Object into a native MySQL `INSERT INTO users (...)` query and permanently saves it to your hard drive.
9. **`CustomUserDetails.java`**: The Service extracts the newly created User from the database and maps it cleanly to Spring Security's UserDetails interface so we can securely grant permissions.
10. **`JwtService.java`**: Mathematical cryptography happens here. We inject the CustomUserDetails into the JJWT library alongside your `secret.key` to forge a brand new Bearer Token.
11. **`AuthResponse.java`**: The Service bundles the new Token, Email, and Role into this final DTO.
12. **`AuthController.java` (Return)**: Converts the `AuthResponse` DTO back into JSON and fires a `200 OK HTTP Response` directly back to your Postman screen!
