### API Documentation for Tailor Profile Management

This documentation outlines the endpoints for managing tailor profiles, services, portfolios, and related functionalities.

---

#### **Create Tailor Profile**
**Endpoint**: `POST /tailor/profile-creation`

**Description**: Creates a tailor profile with shop details and sends a verification email.

**Request Body**:
```json
{
  "shopName": "Example Shop",
  "shopImages": ["/path/to/image1.jpg", "/path/to/image2.jpg"],
  "shopLocation": {
    "address": "123 Example St",
    "coordinates": { "latitude": 12.34, "longitude": 56.78 }
  },
  "bio": "Description of the shop."
}
```

**Response**:
- **201**: Profile created successfully, verification email sent.
- **400**: Missing required fields.
- **500**: Internal server error.

---

#### **Verify Tailor Profile**
**Endpoint**: `POST /tailor/verify-profile`

**Description**: Verifies a tailor profile via a token.

**Query Parameters**:
- `token` (string): The verification token.
- `tailorId` (string): ID of the tailor.

**Response**:
- **200**: Email verified successfully.
- **400**: Invalid or expired token.
- **500**: Internal server error.

---

#### **Add Service**
**Endpoint**: `POST /tailor/add-service`

**Description**: Adds a service to the tailor's service rates.

**Request Body**:
```json
{
  "type": "Custom Suit",
  "description": "Tailored suits with premium fabric.",
  "price": 200,
  "image": "/path/to/image.jpg"
}
```

**Response**:
- **200**: Service added successfully.
- **400**: Missing or invalid fields.
- **500**: Internal server error.

---

#### **Update Service**
**Endpoint**: `PUT /tailor/service/:serviceId`

**Description**: Updates a specific service by its ID.

**Request Body**:
```json
{
  "type": "Updated Service Type",
  "description": "Updated description.",
  "price": 250,
  "image": "/path/to/new-image.jpg"
}
```

**Response**:
- **200**: Service updated successfully.
- **404**: Service not found.
- **500**: Internal server error.

---

#### **Remove Service**
**Endpoint**: `DELETE /tailor/service/:serviceId`

**Description**: Removes a specific service by its ID.

**Response**:
- **200**: Service removed successfully.
- **404**: Service not found.
- **500**: Internal server error.

---

#### **Add Portfolio Entry**
**Endpoint**: `POST /tailor/add-portfolio`

**Description**: Adds a new portfolio entry to the tailor profile.

**Request Body**:
```json
{
  "name": "Portfolio Name",
  "images": ["/path/to/image1.jpg", "/path/to/image2.jpg"],
  "description": "Description of the portfolio entry.",
  "date": "2024-01-01"
}
```

**Response**:
- **200**: Portfolio entry added successfully.
- **400**: Missing required fields.
- **500**: Internal server error.

---

#### **Remove Portfolio Entry**
**Endpoint**: `DELETE /tailor/portfolio/:portfolioId`

**Description**: Removes a specific portfolio entry by its ID.

**Response**:
- **200**: Portfolio entry removed successfully.
- **404**: Portfolio entry not found.
- **500**: Internal server error.

---

#### **Get Tailor Profile**
**Endpoint**: `GET /tailors/:tailorId`

**Description**: Retrieves a tailor's profile by their ID.

**Response**:
- **200**: Returns the tailor profile.
- **404**: Tailor profile not found.
- **500**: Internal server error.

---

#### **Get All Tailors**
**Endpoint**: `GET /tailors`

**Description**: Retrieves a paginated list of all tailor profiles.

**Query Parameters**:
- `page` (integer, optional): Page number (default: 1).
- `limit` (integer, optional): Number of tailors per page (default: 10).

**Response**:
- **200**: Returns a list of tailors.
- **500**: Internal server error.

---

#### **Update Tailor Profile**
**Endpoint**: `PUT /tailors/profile`

**Description**: Updates the tailor's profile details.

**Request Body**:
```json
{
  "shopName": "Updated Shop Name",
  "bio": "Updated bio.",
  "shopLocation": {
    "address": "Updated address",
    "coordinates": { "latitude": 98.76, "longitude": 54.32 }
  }
}
```

**Response**:
- **200**: Profile updated successfully.
- **404**: Tailor profile not found.
- **500**: Internal server error.

---

#### **Delete Tailor Profile**
**Endpoint**: `DELETE /tailors/profile`

**Description**: Deletes the authenticated tailor's profile.

**Response**:
- **200**: Profile deleted successfully.
- **404**: Tailor profile not found.
- **500**: Internal server error.

---

#### **Search Tailors**
**Endpoint**: `GET /tailors/search`

**Description**: Searches for tailors by shop name or service type.

**Query Parameters**:
- `query` (string): Search query.

**Response**:
- **200**: Returns matching tailors.
- **500**: Internal server error.

---

#### **Get List of Services**
**Endpoint**: `GET /tailor/services`

**Description**: Retrieves all services offered by the authenticated tailor.

**Response**:
- **200**: Returns a list of services.
- **404**: Tailor profile not found.
- **500**: Internal server error.

---

#### **Get List of Extra Services**
**Endpoint**: `GET /tailor/extra-services`

**Description**: Retrieves all extra services offered by the authenticated tailor.

**Response**:
- **200**: Returns a list of extra services.
- **404**: Tailor profile not found.
- **500**: Internal server error.

---

#### **Get Portfolio**
**Endpoint**: `GET /tailor/portfolio`

**Description**: Retrieves all portfolio entries for the authenticated tailor.

**Response**:
- **200**: Returns the portfolio.
- **404**: Tailor profile not found.
- **500**: Internal server error.

---

#### **Search Tailors by Service**
**Endpoint**: `GET /tailors/search/service`

**Description**: Searches for tailors offering a specific service.

**Query Parameters**:
- `serviceName` (string): Service name to search.

**Response**:
- **200**: Returns matching tailors.
- **400**: Service name is required.
- **500**: Internal server error.

---

#### **Get All Services by Search**
**Endpoint**: `GET /services`

**Description**: Retrieves all services matching the search query.

**Query Parameters**:
- `search` (string, optional): Search query for service types.

**Response**:
- **200**: Returns matching services.
- **500**: Internal server error.

