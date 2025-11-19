# Node.js RBAC System

A production-quality **Role-Based Access Control (RBAC)** system built using **Node.js**, **Express.js**, and **MongoDB (Mongoose)**. This project includes Role Management, User Management, Authentication, Access Control, and Bulk Update Operations.

---

## 🚀 Features

### **1. Role Module (CRUD)**

* Create, Read, Update, Delete roles
* Fields:

  * `roleName`
  * `accessModules` (unique values only)
  * `createdAt`
  * `isActive`
* Add/remove access modules
* Search functionality (case-insensitive)
* Prevent modifying/deleting system roles (`Admin`, `Super Admin`)

### **2. User Module (CRUD)**

* Fields: firstName, lastName, email, password, role
* Password hashing with bcrypt
* Populate only `roleName` and `accessModules` in list API
* Search functionality (case-insensitive)
* Soft delete using `isActive`
* Prevent modifying Admin/Super Admin accounts
* Prevent self-role downgrade or deletion

### **3. Authentication**

* Signup API
* Login API
* JWT access + refresh tokens
* Block login if user or assigned role is inactive

### **4. Access Control (RBAC)**

* Validate allowed roles
* Validate dynamic module permissions
* Middleware:

  * `auth` (JWT check)
  * `authorize` (role-based)
  * `checkAccess` (module-based)
  * `protectSystemRole` (protect Admin/Super Admin)

### **5. Bulk Update Operations**

* Update multiple users with **same** data (`updateMany`)
* Update multiple users with **different** data (`bulkWrite`)
* Security restrictions:

  * Cannot assign Admin/Super Admin roles in bulk
  * Cannot update inactive users
  * Cannot change own role in bulk

---

## 📁 Project Structure

```
project-root/
│-- src/
│   │-- controllers/
│   │-- models/
│   │-- routes/
│   │-- middlewares/
│   │-- utils/
│   │-- config/
│   │-- docs/
│-- index.js
│-- package.json
```

---

## 🛠 Installation & Setup

### **1. Clone the repository**

```bash
git clone <repo-url>
cd project-root
```

### **2. Install dependencies**

```bash
npm install
```

### **3. Configure environment variables**

Create a `.env` file:

```
NODE_ENV=development
PORT=8000
ALLOW_ORIGIN=*
SERVER_URL=http://localhost:8000
DB_URI=mongodb+srv://<username>:<password>@cluster-url/rbac_system?retryWrites=true&w=majority
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_EXPIRES=7d

```

### **4. Start server**

```bash
npm start
```

Server will run at: **http://localhost:8000**

API Documentation (Swagger UI): **http://localhost:8000/docs**


---

## 📘 API Documentation

A full Postman collection includes:

* Role CRUD APIs
* User CRUD APIs
* Authentication (Signup/Login)
* Check Access API
* Bulk Update APIs

### **Search Example**

```
GET /users?search=A
```

Returns users such as: `Aman`, `Alice`, `Admin`, etc.

---

## 🎯 Key Functionalities

### **Role Access Update**

* Unique module validation
* Add/remove modules dynamically

### **Check Access API**

Validate if the logged-in user has permission for a specific module.

Example:

```
GET /auth/checkAccess?module=users
```

### **Bulk Updates**

* Same update for all users
* Different updates for each user
* Full RBAC & security applied

---

## 📝 Notes

* Proper error handling across all APIs
* Strong Joi validations for every request
* Soft delete logic implemented
* Fully secure RBAC implementation
* Swagger documentation integrated

---

## 🤝 Contribution

Feel free to fork and submit PRs.

---

## 📄 License

This project is for educational and assessment purposes.
