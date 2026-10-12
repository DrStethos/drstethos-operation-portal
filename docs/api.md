# Doctor Stethos Hospital Operations Portal - API Reference

Base URL: `/api`

All protected routes require an active JWT session cookie (`token`) or `Authorization: Bearer <token>`.

---

## 1. Authentication (`/api/auth`)

### `POST /api/auth/login`
- **Access**: Public
- **Body**:
  ```json
  {
    "email": "admin@drstethos.com",
    "password": "AdminPassword123!"
  }
  ```
- **Response (200)**:
  ```json
  {
    "message": "Logged in successfully",
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "email": "admin@drstethos.com",
      "role": "SUPER_ADMIN",
      "firstName": "System",
      "lastName": "Admin"
    }
  }
  ```

### `POST /api/auth/logout`
- **Access**: Public / Authenticated
- **Response (200)**:
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

### `GET /api/auth/me`
- **Access**: Authenticated
- **Response (200)**:
  ```json
  {
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "email": "admin@drstethos.com",
      "role": "SUPER_ADMIN"
    }
  }
  ```

---

## 2. Hospitals (`/api/hospitals`)

### `GET /api/hospitals`
- **Access**: Authenticated (`SUPER_ADMIN` or `MANAGER`)
- **Behavior**:
  - `SUPER_ADMIN`: Returns all hospitals.
  - `MANAGER`: Returns only hospitals assigned to the manager.
- **Response (200)**: Array of Hospital objects.

### `GET /api/hospitals/:id`
- **Access**: Authenticated (`SUPER_ADMIN` or assigned `MANAGER`)
- **Response (200)**: Single Hospital object.

### `POST /api/hospitals`
- **Access**: Authenticated
- **Body**:
  ```json
  {
    "name": "Apollo Hospitals",
    "location": "Jubilee Hills, Hyderabad",
    "contactNumber": "+91 40 2360 7777"
  }
  ```
- **Response (201)**: Created Hospital object.
- **Behavior**: If created by a `MANAGER`, automatically creates a `HospitalAccessAssignment`.

### `PUT /api/hospitals/:id`
- **Access**: Authenticated (`SUPER_ADMIN` or assigned `MANAGER`)
- **Body**: Updated hospital properties.
- **Response (200)**: Updated Hospital object.

### `DELETE /api/hospitals/:id`
- **Access**: Authenticated (`SUPER_ADMIN` or assigned `MANAGER`)
- **Response (204)**: No Content.

---

## 3. Invitations (`/api/invitations`)

### `POST /api/invitations`
- **Access**: `SUPER_ADMIN`
- **Body**:
  ```json
  {
    "email": "operations@drstethos.com",
    "role": "MANAGER"
  }
  ```
- **Response (201)**:
  ```json
  {
    "email": "operations@drstethos.com",
    "token": "..."
  }
  ```
- **Behavior**: Sends invitation email with activation link via SMTP.

### `GET /api/invitations`
- **Access**: `SUPER_ADMIN`
- **Response (200)**: List of pending invitations.

### `DELETE /api/invitations/:id`
- **Access**: `SUPER_ADMIN`
- **Response (200)**: Revokes and cancels an unaccepted invitation.

### `POST /api/invitations/:token/accept`
- **Access**: Public
- **Body**:
  ```json
  {
    "password": "NewSecurePassword123!"
  }
  ```
- **Response (200)**:
  ```json
  {
    "message": "Invitation accepted successfully",
    "user": {
      "id": "...",
      "email": "operations@drstethos.com",
      "role": "MANAGER"
    }
  }
  ```

---

## 4. Bulk Imports (`/api/imports`)

### `POST /api/imports/hospitals`
- **Access**: Authenticated (`SUPER_ADMIN` or `MANAGER`)
- **Content-Type**: `multipart/form-data`
- **Field**: `file` (Excel .xlsx file with columns `Hospital Name`, `Address`, `Phone Number`)
- **Response (202)**:
  ```json
  {
    "message": "Import started",
    "jobId": "..."
  }
  ```

---

## 5. Team Personnel Management (`/api/users`)

### `GET /api/users`
- **Access**: `SUPER_ADMIN`
- **Response (200)**: List of all active portal personnel (excluding password hashes).

### `DELETE /api/users/:id`
- **Access**: `SUPER_ADMIN`
- **Response (200)**: Removes a team member. (Admins cannot delete their own active account).

### `PATCH /api/users/:id/role`
- **Access**: `SUPER_ADMIN`
- **Body**: `{ "role": "MANAGER" | "SUPER_ADMIN" }`
- **Response (200)**: Updated user object.
