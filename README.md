# 🛒 Local Grocery Store Platform

A modern full-stack grocery ordering and store management platform designed for **local grocery stores**.

The platform provides a simple shopping experience for customers while giving store owners a **non-technical, easy-to-use dashboard** for managing products, inventory, and orders.

---

## ✨ Features

### 👤 Customer

* Customer registration and login
* Browse grocery products
* Search products by name, brand, or category
* Filter products by category
* Sort products by price or name
* Add products to cart
* Increase/decrease product quantities
* Remove products from cart
* View cart total
* Generate and place grocery orders
* Choose between:

  * 🏠 Home Delivery
  * 🛍️ Takeaway from Store
* Select preferred delivery time
* View order information and status

### 🏪 Store Owner

* Secure owner login
* Owner dashboard
* View incoming orders
* Tap an order to view complete order details
* View:

  * Customer information
  * Ordered items
  * Quantities
  * Total amount
  * Delivery type
  * Preferred delivery time
* Update order status:

```text
Pending
   ↓
Accepted
   ↓
Preparing
   ↓
Ready
   ↓
Completed
```

* Add new products
* Edit existing products
* Delete products
* Update inventory quantity
* Set low-stock threshold
* Automatically determine:

```text
Available
Low Stock
Out of Stock
```

* Low-stock alerts for the owner

---

## 📦 Inventory Logic

Inventory is designed specifically for small local stores where stock changes frequently.

When a customer places an order:

> **Inventory is not reduced immediately.**

Inventory is updated only when the owner marks the order as:

```text
Completed
```

Example:

```text
Milk Stock: 20

Customer orders: 3

Order placed:
Stock = 20

Order completed:
Stock = 17
```

The system then automatically checks the stock level.

```text
Quantity > Low Stock Threshold
        ↓
Available

Quantity <= Low Stock Threshold
        ↓
Low Stock

Quantity = 0
        ↓
Out of Stock
```

The inventory update is handled on the backend so the database remains the source of truth.

---

## 🏗️ Architecture

```text
                 ┌──────────────────┐
                 │   React Frontend │
                 │   Customer UI    │
                 │   Owner UI       │
                 └────────┬─────────┘
                          │
                       Axios
                          │
                          ▼
                 ┌──────────────────┐
                 │ Node.js +        │
                 │ Express Backend  │
                 └────────┬─────────┘
                          │
                       Mongoose
                          │
                          ▼
                 ┌──────────────────┐
                 │ MongoDB Atlas    │
                 │                  │
                 │ users            │
                 │ products         │
                 │ orders           │
                 └──────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* CSS

### Backend

* Node.js
* Express.js
* Mongoose
* JWT Authentication
* bcryptjs
* CORS
* dotenv

### Database

* MongoDB Atlas
* MongoDB Compass

---

## 📁 Project Structure

```text
grocery-store/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── customer/
│   │   │   └── owner/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── productRoute.js
│   │   └── orderRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## 🔌 API Endpoints

### Products

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Orders

```text
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders
PUT    /api/orders/:id/status
```

---

## 🎯 Project Goals

This project focuses on solving practical problems faced by **small local grocery stores**, especially owners who may have little or no technical experience.

The goal is to provide:

* Simple inventory management
* Easy order processing
* Flexible delivery/takeaway options
* A clean customer shopping experience
* Automatic inventory updates
* Low-stock notifications

---

## 🔮 Future Improvements

Planned improvements include:

* Customer order history
* Real-time new-order notifications
* WhatsApp order notifications
* Bill/PDF generation
* Product image uploads
* Persistent authentication
* Better owner analytics
* Deployment of frontend and backend
* Mobile-friendly improvements
* Real-time order status updates

---

## 👩‍💻 Author

**Purva**

Built as a full-stack software engineering project using React, Node.js, Express, and MongoDB.

---

## ⭐ Project Status

🚧 **Currently under development**

The core frontend, product management, MongoDB integration, and order workflow are being developed incrementally.
