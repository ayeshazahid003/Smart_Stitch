# Vouchers API Documentation

This documentation provides details about the `Vouchers` API, including endpoints for creating, updating, deleting, and retrieving vouchers.

---

## **1. Create Voucher**

### **Endpoint:**  
`POST /vouchers`

### **Description:**  
Allows a tailor to create a new voucher.

### **Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "discount": "number",
  "validFrom": "ISODate string",
  "validUntil": "ISODate string"
}
```

### **Response:**
- **201 Created:**
```json
{
  "success": true,
  "message": "Voucher created successfully.",
  "voucher": "Voucher object"
}
```
- **403 Forbidden:**
```json
{
  "success": false,
  "message": "Unauthorized. Only valid tailors can create vouchers."
}
```
- **500 Internal Server Error:**  
Error message and details.

---

## **2. Update Voucher**

### **Endpoint:**  
`PATCH /vouchers/:id`

### **Description:**  
Allows a tailor to update their voucher.

### **Request Parameters:**
- **Path Parameter:**
```json
{
  "id": "string (Voucher ID)"
}
```

### **Request Body:**
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "discount": "number (optional)",
  "validFrom": "ISODate string (optional)",
  "validUntil": "ISODate string (optional)"
}
```

### **Response:**
- **200 OK:**
```json
{
  "success": true,
  "message": "Voucher updated successfully.",
  "voucher": "Updated Voucher object"
}
```
- **403 Forbidden:**
```json
{
  "success": false,
  "message": "Unauthorized. You can only update your vouchers."
}
```
- **404 Not Found:**
```json
{
  "success": false,
  "message": "Voucher not found."
}
```
- **500 Internal Server Error:**  
Error message and details.

---

## **3. Delete Voucher**

### **Endpoint:**  
`DELETE /vouchers/:id`

### **Description:**  
Allows a tailor to delete their voucher.

### **Request Parameters:**
- **Path Parameter:**
```json
{
  "id": "string (Voucher ID)"
}
```

### **Response:**
- **200 OK:**
```json
{
  "success": true,
  "message": "Voucher deleted successfully."
}
```
- **403 Forbidden:**
```json
{
  "success": false,
  "message": "Unauthorized. You can only delete your vouchers."
}
```
- **404 Not Found:**
```json
{
  "success": false,
  "message": "Voucher not found."
}
```
- **500 Internal Server Error:**  
Error message and details.

---

## **4. Check if Voucher is Applicable**

### **Endpoint:**  
`GET /vouchers/:id/applicable`

### **Description:**  
Checks whether a voucher is valid and applicable at the current time.

### **Request Parameters:**
- **Path Parameter:**
```json
{
  "id": "string (Voucher ID)"
}
```

### **Response:**
- **200 OK:**
```json
{
  "success": true,
  "message": "Voucher is applicable.",
  "voucher": "Voucher object"
}
```
- **400 Bad Request:**
```json
{
  "success": false,
  "message": "Voucher is not applicable."
}
```
- **404 Not Found:**
```json
{
  "success": false,
  "message": "Voucher not found."
}
```
- **500 Internal Server Error:**  
Error message and details.

---

## **5. Get Single Voucher Details**

### **Endpoint:**  
`GET /vouchers/:id`

### **Description:**  
Fetches details of a single voucher by its ID.

### **Request Parameters:**
- **Path Parameter:**
```json
{
  "id": "string (Voucher ID)"
}
```

### **Response:**
- **200 OK:**
```json
{
  "success": true,
  "voucher": "Voucher object"
}
```
- **404 Not Found:**
```json
{
  "success": false,
  "message": "Voucher not found."
}
```
- **500 Internal Server Error:**  
Error message and details.

--- 

## Notes:
- Only users with the role `tailor` can create, update, or delete vouchers.
- Ensure the `validFrom` and `validUntil` dates are in ISO format when sending requests.