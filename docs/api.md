

### **Auth Routes** (backend/src/routes/auth.routes.js)

#### `POST /api/auth/register`
- **Request Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string",
    "indexNo": "string"
  }
  ```
- **Success Response:** `201 Created`
  ```json
  {
    "_id": "string",
    "name": "string",
    "email": "string",
    "token": "string",
    "indexNo": "string",
    "role": "user"
  }
  ```
- **Error Responses:**
  - `400 Bad Request` (User already exists / Index number already exists)
    ```json
    { "message": "User already exists" }
    ```
    ```json
    { "message": "Index number already exists" }
    ```
  - `500 Internal Server Error`
    ```json
    { "message": "Error message" }
    ```

#### `POST /api/auth/login`
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Success Response:** `200 OK`
  ```json
  {
    "_id": "string",
    "name": "string",
    "email": "string",
    "indexNo": "string",
    "role": "user",
    "token": "string"
  }
  ```
- **Error Responses:**
  - `400 Bad Request` (Invalid credentials)
    ```json
    { "message": "Invalid credentials" }
    ```
  - `500 Internal Server Error`
    ```json
    { "message": "Error message" }
    ```

---

### **User Routes** (backend/src/routes/user.routes.js)

#### `GET /api/users/profile`  
**(Requires Authorization header: `Bearer <token>`)**
- **Success Response:** `200 OK`
  ```json
  {
    "_id": "string",
    "name": "string",
    "indexNo": "string",
    "role": "string",
    "email": "string",
    "createdAt": "date",
    "updatedAt": "date"
  }
  ```
- **Error Responses:**
  - `401 Unauthorized` (No token or invalid token)
    ```json
    { "message": "No token provided" }
    ```
    ```json
    { "message": "Token is not valid" }
    ```
  - `404 Not Found`
    ```json
    { "message": "User not found" }
    ```
  - `500 Internal Server Error`
    ```json
    { "message": "Error message" }
    ```

---

### 1. Change Password

**Endpoint:**  
`POST /change-password`

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

**Success Response:**
```json
{
  "message": "Password changed successfully"
}
```

**Error Responses:**
- Incorrect current password:
  ```json
  {
    "message": "Current password is incorrect"
  }
  ```
- User not found:
  ```json
  {
    "message": "User not found"
  }
  ```

---

### 2. Change Email

**Endpoint:**  
`POST /change-email`

**Request Body:**
```json
{
  "newEmail": "newemail@example.com"
}
```

**Success Response:**
```json
{
  "message": "Email changed successfully"
}
```

**Error Response:**
```json
{
  "message": "User not found"
}
```

---

### 3. Change Name

**Endpoint:**  
`POST /change-name`

**Request Body:**
```json
{
  "newName": "New Name"
}
```

**Success Response:**
```json
{
  "message": "Name changed successfully"
}
```

**Error Response:**
```json
{
  "message": "User not found"
}
```

---
---

### 1. Change Password

**Endpoint:**  
`POST /change-password`

**Request Body:**
```json
{
  "currentPassword": "yourCurrentPassword",
  "newPassword": "yourNewPassword"
}
```

**Success Response:**
```json
{
  "message": "Password changed successfully"
}
```

**Error Responses:**
```json
{
  "message": "User not found"
}
```
or
```json
{
  "message": "Current password is incorrect"
}
```

---

### 2. Change Email

**Endpoint:**  
`POST /change-email`

**Request Body:**
```json
{
  "newEmail": "newemail@example.com"
}
```

**Success Response:**
```json
{
  "message": "Email changed successfully"
}
```

**Error Response:**
```json
{
  "message": "User not found"
}
```

---

### 3. Change Name

**Endpoint:**  
`POST /change-name`

**Request Body:**
```json
{
  "newName": "New Name"
}
```

**Success Response:**
```json
{
  "message": "Name changed successfully"
}
```

**Error Response:**
```json
{
  "message": "User not found"
}
```