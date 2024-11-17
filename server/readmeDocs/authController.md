### API Documentation for Authentication

This documentation provides details on the authentication endpoints, including user registration, login, and token verification.

---

### **User Registration**
**Endpoint**: `POST /signup`

**Description**: Registers a new user and generates a JWT token.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "password123",
  "role": "user"
}
```

**Response**:
- **201**: User created successfully with the following response:
  ```json
  {
    "message": "User created successfully.",
    "user": {
      "id": "64b9c8a4d4f5a2b6c8e6f99c",
      "name": "John Doe",
      "email": "johndoe@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1..."
  }
  ```
- **400**: All fields are required.
- **409**: Email is already registered.
- **500**: Server error.

---

### **User Login**
**Endpoint**: `POST /login`

**Description**: Authenticates a user and generates a JWT token.

**Request Body**:
```json
{
  "email": "johndoe@example.com",
  "password": "password123"
}
```

**Response**:
- **200**: Login successful with the following response:
  ```json
  {
    "message": "Login successful.",
    "user": {
      "id": "64b9c8a4d4f5a2b6c8e6f99c",
      "name": "John Doe",
      "email": "johndoe@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1..."
  }
  ```
- **400**: Email and password are required.
- **404**: User not found.
- **401**: Invalid credentials.
- **500**: Server error.

---

### **Verify Token**
**Endpoint**: `GET /verify-token`

**Description**: Verifies the validity of a JWT token.

**Headers**:
- **Authorization**: `Bearer <JWT_TOKEN>`

**Response**:
- **200**: Token is valid with the following response:
  ```json
  {
    "message": "Token is valid.",
    "user": {
      "id": "64b9c8a4d4f5a2b6c8e6f99c",
      "role": "user"
    }
  }
  ```
- **401**: Unauthorized. Token not valid.
- **500**: Server error.
