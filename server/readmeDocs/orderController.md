## Overview
This README provides a detailed explanation of the available functions in the `OrderController` along with their expected inputs (`req.body` or `req.params`) and the format of the returned responses.

## **1. Create New Order**
**Route:** `POST /orders`  
**Description:** Creates a new order, uploads design media to Cloudinary, generates an invoice, and sends notifications and emails to the customer and tailor.

### **Input (`req.body`):**
```json
{
  "customerId": "string",
  "tailorId": "string",
  "status": "string (e.g., 'pending')",
  "design": {
    "designImage": ["string (local image path)", "..."],
    "customization": {
      "fabric": "string",
      "color": "string",
      "style": "string",
      "description": "string"
    },
    "media": [
      {
        "type": "string (e.g., 'video', 'voicenote')",
        "data": "string (local file path)",
        "description": "string"
      }
    ]
  },
  "measurement": {
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
  },
  "utilizedServices": [
    {
      "serviceId": "string",
      "serviceName": "string",
      "price": "number"
    }
  ],
  "extraServices": [
    {
      "serviceId": "string",
      "serviceName": "string",
      "price": "number"
    }
  ],
  "voucherId": "string"
}
```

### **Response:**
```json
{
  "success": true,
  "message": "Order created successfully.",
  "order": "Order object",
  "invoice": "Invoice object"
}
```

---

## **2. Get Order By ID**
**Route:** `GET /orders/:id`  
**Description:** Retrieves a specific order by its ID.

### **Input (`req.params`):**
```json
{
  "id": "string (Order ID)"
}
```

### **Response:**
```json
{
  "success": true,
  "order": "Order object"
}
```

---

## **3. Get All Orders**
**Route:** `GET /orders`  
**Description:** Fetches all orders.

### **Response:**
```json
{
  "success": true,
  "orders": ["Order objects"]
}
```

---

## **4. Get Orders By Customer**
**Route:** `GET /orders/customer/:customerId`  
**Description:** Fetches all orders for a specific customer.

### **Input (`req.params`):**
```json
{
  "customerId": "string (Customer ID)"
}
```

### **Response:**
```json
{
  "success": true,
  "orders": ["Order objects"]
}
```

---

## **5. Get Orders By Tailor**
**Route:** `GET /orders/tailor`  
**Description:** Fetches all orders assigned to the logged-in tailor.

### **Response:**
```json
{
  "success": true,
  "orders": ["Order objects"]
}
```

---

## **6. Update Order Status**
**Route:** `PUT /orders/:id/status`  
**Description:** Updates the status of an order and notifies the customer.

### **Input (`req.params` and `req.body`):**
```json
{
  "id": "string (Order ID)"
}
```
```json
{
  "status": "string (e.g., 'in progress', 'completed')"
}
```

### **Response:**
```json
{
  "success": true,
  "message": "Order status updated successfully.",
  "order": "Updated order object"
}
```

---

## **7. Generate Invoice For Order**
**Route:** `POST /orders/:id/invoice`  
**Description:** Generates an invoice for a specific order.

### **Input (`req.params`):**
```json
{
  "id": "string (Order ID)"
}
```

### **Response:**
```json
{
  "success": true,
  "message": "Invoice generated successfully.",
  "invoice": "Invoice object"
}
```

---

## **8. Get Order Summary By Customer**
**Route:** `GET /orders/customer/:customerId/summary`  
**Description:** Fetches the summary of orders for a specific customer, including total orders and total amount spent.

### **Input (`req.params`):**
```json
{
  "customerId": "string (Customer ID)"
}
```

### **Response:**
```json
{
  "success": true,
  "summary": {
    "totalOrders": "number",
    "totalAmountSpent": "number"
  }
}
```

---

## **9. Get Order Summary By Tailor**
**Route:** `GET /orders/tailor/summary`  
**Description:** Fetches the summary of orders for the logged-in tailor, including total orders and total earnings.

### **Response:**
```json
{
  "success": true,
  "summary": {
    "totalOrders": "number",
    "totalEarnings": "number"
  }
}
```

---

## **10. Get Orders By Status (Customer)**
**Route:** `GET /orders/customer/status/:status`  
**Description:** Fetches orders for a specific customer filtered by status.

### **Input (`req.params` and `req.query`):**
```json
{
  "status": "string (e.g., 'pending', 'completed')"
}
```
```json
{
  "customerId": "string (Customer ID)"
}
```

### **Response:**
```json
{
  "success": true,
  "orders": ["Order objects"]
}
```

---

## **11. Get Orders By Status (Tailor)**
**Route:** `GET /orders/tailor/status/:status`  
**Description:** Fetches orders for the logged-in tailor filtered by status.

### **Input (`req.params`):**
```json
{
  "status": "string (e.g., 'pending', 'completed')"
}
```

### **Response:**
```json
{
  "success": true,
  "orders": ["Order objects"]
}
```