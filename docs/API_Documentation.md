# ReClaim REST API Documentation

This document provides complete documentation for the REST API endpoints exposed through the **API Gateway** (`http://localhost:8080`).

---

## 1. Authentication Service (`/api/auth`)

### 1.1 Register User
- **Method:** `POST`
- **URL:** `/api/auth/register`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "name": "Aarav Sharma",
    "email": "aarav@college.edu",
    "password": "Password@123",
    "role": "User"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "User registered successfully"
  }
  ```
- **Error (400 Bad Request):**
  ```json
  {
    "error": "Email already exists"
  }
  ```

### 1.2 Login User
- **Method:** `POST`
- **URL:** `/api/auth/login`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "aarav@college.edu",
    "password": "Password@123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "67098192a8e1b23456789abc",
      "name": "Aarav Sharma",
      "email": "aarav@college.edu",
      "role": "User"
    }
  }
  ```
- **Error (400 Bad Request):**
  ```json
  {
    "error": "Invalid credentials"
  }
  ```

### 1.3 Get Current Profile
- **Method:** `GET`
- **URL:** `/api/auth/profile`
- **Auth Required:** Yes (`Bearer <token>`)
- **Response (200 OK):**
  ```json
  {
    "_id": "67098192a8e1b23456789abc",
    "name": "Aarav Sharma",
    "email": "aarav@college.edu",
    "role": "User",
    "createdAt": "2026-10-10T12:00:00.000Z"
  }
  ```
- **Error (401 Unauthorized):**
  ```json
  {
    "error": "Access denied"
  }
  ```

---

## 2. Item Service (`/api/items`)

### 2.1 Report Item (Lost or Found)
- **Method:** `POST`
- **URL:** `/api/items`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body:**
  ```json
  {
    "type": "Lost",
    "category": "Electronics",
    "name": "Dell Inspiron Laptop",
    "description": "Silver laptop with blue sticker",
    "location": "Central Library",
    "date": "2026-10-10T14:30:00.000Z",
    "color": "Silver",
    "brand": "Dell"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "Lost item reported successfully",
    "item": {
      "_id": "6709820fa8e1b23456789abd",
      "reporterId": "67098192a8e1b23456789abc",
      "type": "Lost",
      "category": "Electronics",
      "name": "Dell Inspiron Laptop",
      "status": "Active"
    }
  }
  ```

### 2.2 Browse / Search Items
- **Method:** `GET`
- **URL:** `/api/items?type=Lost&category=Electronics&keyword=Dell`
- **Auth Required:** No
- **Response (200 OK):** Array of Item objects.

### 2.3 Get Item by ID
- **Method:** `GET`
- **URL:** `/api/items/:id`
- **Auth Required:** No
- **Response (200 OK):** Single Item object.
- **Error (404 Not Found):** `{"error": "Item not found"}`

### 2.4 Update Item Status
- **Method:** `PUT`
- **URL:** `/api/items/:id/status`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body:** `{"status": "Resolved"}`
- **Response (200 OK):** Updated item object.

---

## 3. Matching Service (`/api/matches`)

### 3.1 Get Smart Matches for an Item
- **Method:** `GET`
- **URL:** `/api/matches/:itemId`
- **Auth Required:** No (or Optional)
- **Response (200 OK):**
  ```json
  [
    {
      "_id": "67098310a8e1b23456789abe",
      "lostItemId": "6709820fa8e1b23456789abd",
      "foundItemId": "6709825ba8e1b23456789abf",
      "score": 90,
      "reasons": [
        "Category Match: Yes",
        "Location Match: Yes",
        "Color Match: Yes",
        "Brand Match: Yes"
      ],
      "status": "Pending"
    }
  ]
  ```

---

## 4. Claim Service (`/api/claims`)

### 4.1 Submit Claim
- **Method:** `POST`
- **URL:** `/api/claims`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body:**
  ```json
  {
    "itemId": "6709825ba8e1b23456789abf",
    "proofDescription": "Serial number ends in 8492. Has a scratch on left hinge."
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "Claim submitted successfully",
    "claim": {
      "_id": "67098412a8e1b23456789ac0",
      "itemId": "6709825ba8e1b23456789abf",
      "claimerId": "67098192a8e1b23456789abc",
      "status": "PENDING"
    }
  }
  ```

### 4.2 Get My Claims
- **Method:** `GET`
- **URL:** `/api/claims/my-claims`
- **Auth Required:** Yes (`Bearer <token>`)
- **Response (200 OK):** Array of user's submitted claims.

### 4.3 Update Claim Status
- **Method:** `PUT`
- **URL:** `/api/claims/:id/status`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body:** `{"status": "APPROVED"}`
- **Response (200 OK):** Updated claim.

---

## 5. Notification Service (`/api/notifications`)

### 5.1 Get My Notifications
- **Method:** `GET`
- **URL:** `/api/notifications`
- **Auth Required:** Yes (`Bearer <token>`)
- **Response (200 OK):**
  ```json
  [
    {
      "_id": "67098550a8e1b23456789ac1",
      "userId": "67098192a8e1b23456789abc",
      "title": "Claim Status Updated",
      "message": "Your claim status is now: APPROVED",
      "isRead": false,
      "createdAt": "2026-10-10T17:15:00.000Z"
    }
  ]
  ```

### 5.2 Mark Notification as Read
- **Method:** `PUT`
- **URL:** `/api/notifications/:id/read`
- **Auth Required:** Yes (`Bearer <token>`)
- **Response (200 OK):**
  ```json
  {
    "message": "Notification marked as read",
    "notification": { "_id": "...", "isRead": true }
  }
  ```

---

## 6. System Health Endpoints (`/health`)

- **Method:** `GET`
- **URL:** `/health`
- **Auth Required:** No
- **Response (200 OK):**
  ```json
  {
    "status": "UP",
    "service": "api-gateway",
    "timestamp": "2026-10-11T12:00:00.000Z",
    "uptime": 3600
  }
  ```
