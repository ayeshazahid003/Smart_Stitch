# User API Documentation

This documentation provides details about the `User` API, including endpoints for updating user details, uploading profile pictures, managing measurements, and deleting user accounts.

---

## **1. Update User**

### **Endpoint:**  
`PUT /users/:id`

### **Description:**  
Allows updating user details such as name, email, role, and contact information.

### **Request Parameters:**
- **Path Parameter:**
```json
{
  "id": "string (User ID)"
}
```

### **Request Body:**
```json
{
  "name": "string (optional)",
  "email": "string (optional)",
  "role": "string (optional)",
  "contactInfo": "object (optional)"
}
```

### **Response:**
```json
{
  "success": true,
  "message": "User updated successfully.",
  "user": "Updated User object"
}
```

---

## **2. Delete User**

### **Endpoint:**  
`DELETE /users/:id`

### **Description:**  
Deletes a user account.

### **Request Parameters:**
- **Path Parameter:**
```json
{
  "id": "string (User ID)"
}
```

### **Response:**
```json
{
  "success": true,
  "message": "User account deleted successfully."
}
```

---

## **3. Get User by ID**

### **Endpoint:**  
`GET /users/:id`

### **Description:**  
Fetches a user's details using their ID.

### **Request Parameters:**
- **Path Parameter:**
```json
{
  "id": "string (User ID)"
}
```

### **Response:**
```json
{
  "success": true,
  "user": "User object"
}
```

---

## **4. Upload Profile Picture**

### **Endpoint:**  
`PUT /users/:id/profile-picture`

### **Description:**  
Uploads and updates a user's profile picture.

### **Request Parameters:**
- **Path Parameter:**
```json
{
  "id": "string (User ID)"
}
```

### **Request Body:**
```json
{
  "filePath": "string (Path to the image file)"
}
```

### **Response:**
```json
{
  "success": true,
  "message": "Profile picture updated.",
  "user": "Updated User object"
}
```

---

## **5. Add Measurements**

### **Endpoint:**  
`POST /users/:id/measurements`

### **Description:**  
Adds new measurements for a user.

### **Request Parameters:**
- **Path Parameter:**
```json
{
  "id": "string (User ID)"
}
```

### **Request Body:**
```json
{
  "height": "number",
  "chest": "number",
  "waist": "number",
  "hips": "number",
  "shoulder": "number",
  "wrist": "number",
  "sleeves": "number",
  "neck": "number",
  "lowerBody": {
    "length": "number",
    "waist": "number",
    "inseam": "number",
    "thigh": "number",
    "ankle": "number"
  }
}
```

### **Response:**
```json
{
  "success": true,
  "message": "Measurements added successfully.",
  "user": "Updated User object"
}
```

---

## **6. Update Measurements**

### **Endpoint:**  
`PUT /users/:id/measurements`

### **Description:**  
Updates existing measurements for a user.

### **Request Parameters:**
- **Path Parameter:**
```json
{
  "id": "string (User ID)"
}
```

### **Request Body:**
```json
{
  "height": "number (optional)",
  "chest": "number (optional)",
  "waist": "number (optional)",
  "hips": "number (optional)",
  "shoulder": "number (optional)",
  "wrist": "number (optional)",
  "sleeves": "number (optional)",
  "neck": "number (optional)",
  "lowerBody": {
    "length": "number (optional)",
    "waist": "number (optional)",
    "inseam": "number (optional)",
    "thigh": "number (optional)",
    "ankle": "number (optional)"
  }
}
```

### **Response:**
```json
{
  "success": true,
  "message": "Measurements updated successfully.",
  "user": "Updated User object"
}
```