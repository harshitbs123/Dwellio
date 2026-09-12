# 🏨 Dwellio

**Dwellio** is a full-stack hotel and vacation rental web application inspired by platforms like Airbnb.

Users can browse available properties, view individual listings, while hosts can add new properties and manage existing listings.

## ✨ Features

* 🏠 Browse all available listings
* 🔍 View individual property details
* 🏨 Host/add new properties
* ✏️ Edit existing listings
* 🗑️ Delete listings
* 💾 MongoDB database integration
* ⚡ Express.js backend
* 🎨 EJS-based dynamic pages
* 🔄 RESTful CRUD operations
* 📱 Responsive UI
* 🖼️ Property images and listing information

## 🛠️ Tech Stack

**Frontend**

* HTML
* Tailwind CSS
* EJS
* Font Awesome

**Backend**

* Node.js
* Express.js

**Database**

* MongoDB
* Mongoose

**Other**

* Method Override
* REST APIs

## 📂 Project Structure

```text
Dwellio/
│
├── Models/
│   └── listing.js
│
├── views/
│   ├── home.ejs
│   ├── show.ejs
│   ├── host.ejs
│   └── edit.ejs
│
├── assets/
│   └── images/
│
├── app.js
├── package.json
└── README.md
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/dwellio.git
```

### 2. Navigate into the project

```bash
cd dwellio
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start MongoDB

Make sure MongoDB is installed and running locally.

The application currently connects to:

```text
mongodb://127.0.0.1:27017/rentora
```

### 5. Start the server

```bash
node app.js
```

Or, if you have nodemon installed:

```bash
nodemon app.js
```

The application will run at:

```text
http://localhost:3030
```

## 🔗 Routes

| Method | Route                | Description          |
| ------ | -------------------- | -------------------- |
| GET    | `/listings`          | Display all listings |
| GET    | `/listings/host`     | Host a new property  |
| POST   | `/listings`          | Create a new listing |
| GET    | `/listings/:id`      | View a listing       |
| GET    | `/listings/:id/edit` | Edit a listing       |
| PATCH  | `/listings/:id`      | Update a listing     |
| DELETE | `/listings/:id`      | Delete a listing     |

## 🗃️ Listing Model

Each property contains information such as:

```text
title
description
price
location
country
image
```

## 🔄 CRUD Operations

Dwellio implements the complete CRUD workflow:

**Create**
→ Hosts can add new properties.

**Read**
→ Users can browse and view property details.

**Update**
→ Hosts can edit existing property information.

**Delete**
→ Hosts can remove properties.

## 🎯 Project Goal

The goal of Dwellio is to practice building a complete backend-driven web application using the MERN-style ecosystem, while working with server-side rendering through EJS.

This project helped me understand:

* Express routing
* RESTful APIs
* CRUD operations
* MongoDB database operations
* Mongoose models and schemas
* EJS templating
* HTML forms
* Method overriding
* Express middleware
* Dynamic routes
* Server-side rendering

## 🔮 Future Improvements

* 🔐 User authentication
* 👤 Host and guest accounts
* ⭐ Reviews and ratings
* ❤️ Wishlist/favorites
* 🔎 Search and filtering
* 📍 Map integration
* 💳 Booking and payment system
* 📅 Property availability calendar
* ☁️ Cloud image storage
* 🚀 Deployment with a cloud MongoDB database

## 👨‍💻 Author

**Harshit Prakash**

Built as a full-stack web development project while learning Node.js, Express, MongoDB and EJS.

---

⭐ If you like the project, consider giving the repository a star!