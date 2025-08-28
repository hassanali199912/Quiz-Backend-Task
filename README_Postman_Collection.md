# Backend API Postman Collection

This Postman collection contains all the User and Announcement endpoints for your Backend API.

## 📁 Files

- `Backend_API_Collection.postman_collection.json` - The main Postman collection file
- `README_Postman_Collection.md` - This documentation file

## 🚀 How to Import

1. Open Postman
2. Click "Import" button
3. Drag and drop the `Backend_API_Collection.postman_collection.json` file
4. The collection will be imported with all endpoints organized

## 🔧 Environment Variables

The collection uses two environment variables that you need to set:

### 1. `base_url`
- **Default Value**: `http://localhost:8080`
- **Description**: The base URL where your API server is running
- **Update this** if your server runs on a different port or host

### 2. `auth_token`
- **Default Value**: `your_jwt_token_here`
- **Description**: JWT authentication token for protected endpoints
- **Update this** after logging in with a valid user account

## 🔐 Authentication

Most endpoints require JWT authentication. To get a token:

1. Use the **"User Login"** endpoint
2. Provide valid credentials (username/email and password)
3. Copy the `token` from the response
4. Update the `auth_token` environment variable with this token

## 📋 Available Endpoints

### 👥 Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/users/login` | User login (get JWT token) | ❌ No |
| `GET` | `/api/users` | Get all users | ✅ Yes (Admin) |
| `GET` | `/api/users/:id` | Get user by ID | ✅ Yes (Admin) |
| `GET` | `/api/users/filter` | Filter users by criteria | ✅ Yes (Admin) |
| `POST` | `/api/users` | Create new user | ✅ Yes (Admin) |
| `PUT` | `/api/users/:id` | Update user | ✅ Yes (Admin) |
| `DELETE` | `/api/users/:id` | Delete user | ✅ Yes (Admin) |

### 📢 Announcements

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/announcements` | Get all announcements | ❌ No |
| `GET` | `/api/announcements/:id` | Get announcement by ID | ❌ No |
| `GET` | `/api/announcements/filter` | Filter announcements | ❌ No |
| `POST` | `/api/announcements` | Create announcement | ✅ Yes (Admin) |
| `PUT` | `/api/announcements/:id` | Update announcement | ✅ Yes (Admin) |
| `DELETE` | `/api/announcements/:id` | Delete announcement | ✅ Yes (Admin) |

### 🧪 Test

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/test` | Test server connection | ❌ No |

## 🔑 User Roles

The system has two user roles:

- **CODEMODE** - Admin users (can access all endpoints)
- **CODEHASH** - Regular users (limited access)

## 📝 Request Examples

### User Login
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

### Create User (Admin only)
```json
{
  "fname": "John",
  "lname": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "role": "CODEHASH"
}
```

### Create Announcement (Admin only)
```json
{
  "title": "Important Course Update",
  "content": "The course schedule has been updated for next week.",
  "course": "Computer Science",
  "priority": "high",
  "category": "academic"
}
```

## 🔍 Filtering

### Users
- Filter by role: `?role=CODEHASH`
- Filter by email: `?email=user@example.com`

### Announcements
- Filter by course: `?course=Computer Science`
- Filter by priority: `?priority=high`
- Filter by category: `?category=academic`

## ⚠️ Important Notes

1. **Admin Access**: Most write operations (POST, PUT, DELETE) require admin privileges
2. **JWT Token**: Include `Authorization: Bearer <token>` header for protected endpoints
3. **Validation**: All requests are validated using middleware
4. **Error Handling**: The API returns structured error responses
5. **CORS**: The API supports cross-origin requests

## 🚀 Getting Started

1. **Start your server**: `npm run start:dev`
2. **Import the collection** into Postman
3. **Set environment variables**:
   - `base_url`: Your server URL
   - `auth_token`: Leave empty initially
4. **Test server connection** using the `/test` endpoint
5. **Login** using the User Login endpoint
6. **Update auth_token** with the received JWT token
7. **Start testing** other endpoints!

## 📞 Support

If you encounter any issues:
- Check that your server is running
- Verify the `base_url` is correct
- Ensure you have a valid JWT token for protected endpoints
- Check the server console for error logs

---

**Happy API Testing! 🎉**
