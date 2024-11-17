### API Documentation for Reviews Management

This documentation outlines the endpoints for managing reviews related to tailor profiles and orders.

---

#### **Add Review**
**Endpoint**: `POST /reviews`

**Description**: Allows a customer to add a review for a tailor based on an order.

**Request Body**:
```json
{
  "orderId": "64b9c8a4d4f5a2b6c8e6f99c",
  "tailorId": "64b9c8a4d4f5a2b6c8e6f99b",
  "rating": 4.5,
  "comment": "Great service and quality work!"
}
```

**Response**:
- **201**: Review added successfully.
- **403**: Customer does not have an order with the tailor.
- **404**: Tailor profile not found.
- **500**: Internal server error.

---

#### **Update Review**
**Endpoint**: `PUT /reviews/:id`

**Description**: Allows a customer to update their review.

**Request Body**:
```json
{
  "rating": 5,
  "comment": "Updated comment with excellent feedback!"
}
```

**Response**:
- **200**: Review updated successfully.
- **403**: Unauthorized to update this review.
- **404**: Review not found.
- **500**: Internal server error.

---

#### **Get Review**
**Endpoint**: `GET /reviews/:id`

**Description**: Retrieves a specific review by its ID.

**Response**:
- **200**: Returns the review.
- **404**: Review not found.
- **500**: Internal server error.

---

#### **Get All Reviews**
**Endpoint**: `GET /reviews`

**Description**: Retrieves all reviews. Optionally, filters reviews by a specific tailor.

**Query Parameters**:
- `tailorId` (string, optional): Filter reviews for a specific tailor.

**Response**:
- **200**: Returns a list of reviews.
- **500**: Internal server error.

---

#### **Delete Review**
**Endpoint**: `DELETE /reviews/:id`

**Description**: Allows a customer to delete their review.

**Response**:
- **200**: Review deleted successfully.
- **403**: Unauthorized to delete this review.
- **404**: Review not found.
- **500**: Internal server error.

