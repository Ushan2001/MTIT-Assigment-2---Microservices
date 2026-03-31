# Frontend API Integration Guide

This document provides a comprehensive guide for integrating with the microservices backend via the **API Gateway**.

## Base URL
All requests should be sent to the API Gateway:
**`http://localhost:5001`**

---

## 1. Customer Service
Manage customer registration, login, and profile operations. All profile-related paths under `/customers` require a JWT token.

### Register Customer
*   **Endpoint:** `POST /customers/register`
*   **Payload:**
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123",
      "phone": "0771234567",
      "address": "123 Main St, Colombo"
    }
    ```
*   **Response (201):** `{ "id": "...", "name": "John Doe", ... }`

### Login
*   **Endpoint:** `POST /customers/login`
*   **Payload:**
    ```json
    {
      "email": "john@example.com",
      "password": "password123"
    }
    ```
*   **Response (200):** `{ "token": "JWT_TOKEN_HERE", "id": "CUSTOMER_ID" }`

### Get All Customers
*   **Endpoint:** `GET /customers`
*   **Auth:** Bearer Token required
*   **Response (200):** `[ { "id": "...", "name": "...", ... }, ... ]`

### Update Profile
*   **Endpoint:** `PUT /customers/:id`
*   **Auth:** Bearer Token required
*   **Payload:**
    ```json
    {
      "address": "456 New St, Kandy",
      "phone": "0779876543"
    }
    ```
*   **Response (200):** `{ "msg": "Profile updated successfully", "customer": { ... } }`

### Delete Account
*   **Endpoint:** `DELETE /customers/:id`
*   **Auth:** Bearer Token required
*   **Response (200):** `{ "msg": "Account deleted successfully" }`

---

## 2. Restaurant Service
Manage restaurants and their menus.

### Get All Restaurants
*   **Endpoint:** `GET /restaurants`
*   **Response (200):** `[ { "id": "...", "name": "Pizza Hut", "cuisine": "Italian", ... } ]`

### Create Restaurant
*   **Endpoint:** `POST /restaurants`
*   **Payload:**
    ```json
    {
      "name": "Pizza Hut",
      "address": "Colombo 03",
      "cuisine": "Italian",
      "rating": 4.5
    }
    ```

### Get Menu
*   **Endpoint:** `GET /restaurants/:id/menu`
*   **Response (200):** `[ { "itemName": "Cheese Pizza", "price": 1500, ... } ]`

---

## 3. Order Service
Manage shopping carts and order placements.

### Add to Cart
*   **Endpoint:** `POST /orders/cart`
*   **Payload:**
    ```json
    {
      "customerId": "ID",
      "menuItemId": "ID",
      "qty": 2,
      "price": 1500
    }
    ```

### Get Cart
*   **Endpoint:** `GET /orders/cart/:customerId`
*   **Response (200):** `{ "items": [ ... ], "total": 3000 }`

### Place Order
*   **Endpoint:** `POST /orders`
*   **Payload:**
    ```json
    {
      "customerId": "ID",
      "restaurantId": "ID",
      "items": [
        { "menuItemId": "ID", "qty": 2, "price": 1500 }
      ]
    }
    ```
*   **Response (201):** `{ "orderId": "...", "status": "PENDING" }`

### Update Order Status
*   **Endpoint:** `PUT /orders/:orderId/status`
*   **Payload:** `{ "status": "CONFIRMED" }`
*   **Enums:** `PENDING`, `CONFIRMED`, `PREPARING`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`

---

## 4. Delivery Service
Manage delivery assignments and drivers.

### Create Delivery
*   **Endpoint:** `POST /deliveries`
*   **Payload:**
    ```json
    {
      "orderId": "ID",
      "pickupLocation": "Restaurant Address",
      "dropLocation": "Customer Address"
    }
    ```

### Update Delivery Status
*   **Endpoint:** `PUT /deliveries/:id/status`
*   **Payload:** `{ "status": "PICKED_UP" }`
*   **Enums:** `ASSIGNED`, `PICKED_UP`, `IN_TRANSIT`, `DELIVERED`, `FAILED`

### Register Driver
*   **Endpoint:** `POST /deliveries/drivers`
*   **Payload:** `{ "name": "Driver Name" }`

---

## Authentication Note
For any endpoint marked as **Auth required**, include the JWT token in the request header:
`Authorization: Bearer YOUR_TOKEN_HERE`
