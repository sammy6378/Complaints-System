
# 🛠️ ResolveIt Complaint Management System

## 📌 Introduction

**ResolveIt** is a robust, scalable platform designed to facilitate the streamlined lodging, management, and resolution of user complaints. Built using modern technologies like **NestJS**, **Node.js**, **TypeScript**, and **PostgreSQL**, the system offers distinct modules for **Admins** and **Users**, along with a clear and maintainable architecture.

This system empowers:

* 👥 **Users** to lodge complaints and track resolutions
* 🧑‍💼 **Admins** to manage categories, user feedback, and complaints effectively

This documentation outlines the stack, core functionalities, relationships, demos, and suggestions for future improvements.

---

## 🧱 Tech Stack

| Tech                 | Description                                  |
| -------------------- | -------------------------------------------- |
| 🧪 **NestJS**        | Backend framework for scalable architecture  |
| ⚙️ **NodeJS**        | Server runtime environment                   |
| ✨ **TypeScript**     | Typed superset of JavaScript                 |
| 🗄️ **PostgreSQL**   | Relational database management system        |
| 🐳 **Docker**        | Containerization for environment consistency |
| 🧠 **Redis**         | Caching layer for performance improvement    |
| 🛡 **CASL**          | Flexible and declarative authorization       |
| 🔐 **Helmet**        | Secures HTTP headers                         |
| 🚦 **Rate Limiting** | Prevents abuse and DoS attacks               |
| 🌐 **CORS**          | Enables secure cross-origin requests         |

---

## 🚀 Features Overview

### 👨‍💼 Admin Module

* 🗂 **Category Management**: Create, edit, delete complaint categories
* 🗂 **Subcategory Management**: Create, edit, delete complaint subcategories
* 🗺 **State Management**: Manage states associated with complaints
* 📋 **Complaint Management**: View complaints, update remarks, and manage status (Open/Closed)
* 👤 **User Management**: View, edit, and delete user records
* 📜 **User Logs**: Monitor user login/logout history and activities
* 📜 **Admin Logs**: View admin login/logout records
* 🔐 **Change Password**: Admins can update their passwords

---

### 🙋 User (Patient/Customer) Module

* 📝 **Registration**: Users can create accounts
* 🔐 **Forgot Password**: Password recovery via email ✅ Implemented
* 📢 **Lodge Complaint**: Submit complaints with category, subcategory, and state
* 📂 **Complaint History**: View submitted complaints and statuses
* ⚙️ **Profile Management**: Update profile details and change password
* 🔒 **Change Password**: Secure password update for users

---

## 🧪 Security & Middleware

* 🛡️ **Role-Based Authorization**: Fine-grained access control based on user roles ✅
* 🧱 **CASL Authorization**: Context-aware permission control using CASL ✅
* 🧠 **Helmet Integration**: Sets secure HTTP headers ✅
* 🚦 **Rate Limiting**: Prevents request flooding and abuse ✅
* 🌐 **CORS**: Configured for secure cross-origin communication ✅

---

## 🐳 DevOps & Deployment

* 🐳 **Dockerized Environment**: Fully containerized for seamless deployment ✅

---

## 📦 Demos

### 👥 User Actions

#### 📝 Create User (Register)

```http
POST /api/users
```

**Body:**

```json
{
    "full_name": "James Doe",
    "username": "Jamoy",
    "email": "jamesdoe254@gmail.com",
    "phone_number": "+254781234567",
    "password": "@James254.",
    "role": "user"
}
```

#### 🔐 Sign In

```http
POST /api/auth/signin
```

**Body:**

```json
{
  "email": "jamesdoe254@gmail.com",
  "password": "@James254."
}
```

#### 🔁 Reset Password

```http
POST /api/auth/resetPassword
```

**Body:**

```json
{
  "email": "jamesdoe254@gmail.com"
}
```

---

### 📢 Complaint Actions

#### ➕ Create Complaint

```http
POST /api/complaints
```

**Body:**

```json
{
  "title": "Internet not working",
  "description": "The connection has been down since morning.",
  "categoryId": "1",
  "subcategoryId": "3",
  "stateId": "2"
}
```

#### 📥 Get All Complaints

```http
GET /api/complaints
```

#### 📍 Check Complaint Status

```http
GET /api/complaints/status
```

**Example:**

```json
GET {{Url}}/complaints/qry?complaint_status=Pending&priority=High
Authorization: Bearer {{access_token}}
```

---

## 💡 Suggested Enhancements

These are upcoming or recommended features to make the system more powerful and user-friendly:

* 📩 **SMS & Email Notifications**: Inform users of complaint updates, resolutions, or actions needed
* ⏫ **Complaint Escalation**: Allow users to escalate complaints after a timeout
* 💬 **Feedback Mechanism**: Users can rate or provide feedback on complaint handling
* 🚦 **Priority Levels**: Assign Low, Medium, High priorities to complaints
* 📊 **Admin Analytics Dashboard**: Visual insights and reports for complaints based on categories, departments, or resolution status

---

## 🧩 Entity Relationships

(see entity relationship diagram at `../Resources/complaints-db.png`)

| 🧩 Entity   | 🔗 Related Entity | 🔢 Cardinality |
| ----------- | ----------------- | -------------- |
| Admin       | Admin Logs        | 1 to Many      |
| User        | Complaints        | 1 to Many      |
| User        | User Logs         | 1 to Many      |
| Complaint   | Category          | Many to 1      |
| Complaint   | Subcategory       | Many to 1      |
| Complaint   | State             | Many to 1      |
| Category    | Subcategories     | 1 to Many      |
| Category    | Complaints        | 1 to Many      |
| Subcategory | Category          | Many to 1      |
| Subcategory | Complaints        | 1 to Many      |
| State       | Complaints        | 1 to Many      |

---

## 🛡️ System Readiness

### ✅ Implemented

* 🔐 Authentication (Sign In, Sign Out)
* 🛡️ Role-based Access Control
* ✅ CASL Permissions
* 🔁 Reset Password via Email
* ⚠️ Error Handling
* 🔗 Entity Relationships
* 🌱 Database Seeding
* 🗄️ PostgreSQL Integration
* 🧰 Services Layer & Business Logic
* ✨ Redis Caching
* 🧱 Helmet, CORS, Rate Limiting
* 🐳 Dockerized for Deployment

---

## 📎 API Reference

Visit: [http://localhost:8000/api/docs](http://localhost:8000/api/docs)