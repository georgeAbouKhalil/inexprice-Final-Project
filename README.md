# InexPrice — Final College Project

InexPrice is a full-stack e-commerce web application built as a college final project.
The system includes a customer shopping experience, an admin management panel, MongoDB-based product data, real-time chat, order handling, reviews, wishlist, shopping cart logic, email notifications, and a collaborative filtering recommendation algorithm.

## Overview

InexPrice was developed using Angular on the client side, Node.js with TypeScript on the backend, and MongoDB as the database.
The application demonstrates a complete online store flow: browsing products, filtering by category, adding items to cart, placing orders, generating receipts, writing reviews, managing wishlist items, and allowing admins to manage products.

## Main Features

### Customer Side

* User authentication and authorization
* Product catalog loaded from MongoDB
* Product filtering by category and type
* Product details page
* Shopping cart
* Wishlist
* Order creation
* Receipt generation as a downloadable text file
* Receipt sending by email
* Product reviews
* Contact form with email notification
* Visa-style credit card checkout flow
* Real-time chat with an admin using Socket.IO
* Product recommendations using collaborative filtering

### Admin Side

* Add new products
* Edit existing products
* Delete products
* Manage store products
* Chat with users in real time

## Recommendation Algorithm

The project includes a collaborative filtering recommendation algorithm.
The algorithm is used to suggest products to users based on user behavior, product interactions, and similarity between users or products.

This feature was added to make the store experience more personalized and closer to real e-commerce platforms.

## Tech Stack

### Frontend

* Angular
* TypeScript
* HTML
* CSS / SCSS
* Bootstrap
* Angular Material
* Socket.IO Client

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* Socket.IO
* JSON Web Token
* Nodemailer
* CORS

### Database

* MongoDB
* Imported database data for products and store information

## Project Structure

```txt
inexprice-Final-Project/
│
├── backend/
│   ├── src/
│   │   ├── 01-utils/
│   │   ├── 02-middleware/
│   │   ├── 03-models/
│   │   ├── 04-dal/
│   │   ├── 05-bll/
│   │   ├── 06-controllers/
│   │   └── app.ts
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── client/
│   └── Angular client application
│
├── db/
│   └── InexPrice database files
│
└── README.md
```

## Backend API Modules

The backend is organized using controllers, models, business logic, middleware, and data access layers.

Main backend modules include:

* Products API
* Authentication API
* Carts API
* Cart Items API
* Orders API
* Categories API
* Credit Card API
* Wishlist API
* Messages / Chat API
* Mail API
* Reviews API

## Installation

Clone the repository:

```bash
git clone https://github.com/georgeAbouKhalil/inexprice-Final-Project.git
cd inexprice-Final-Project
```

### Backend Setup

```bash
cd backend
npm install
npm start
```

The backend runs with:

```bash
nodemon --exec ts-node src/app.ts
```

### Client Setup

```bash
cd client
npm install
npm start
```

The Angular client will usually run on:

```txt
http://localhost:4200
```

The backend server will run on the port configured in the backend configuration file.

## Environment Variables

Create a configuration file or environment variables according to the backend configuration.

Example values you may need:

```env
PORT=3000
MONGO_CONNECTION_STRING=mongodb://127.0.0.1:27017/InexPrice
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_password
```

Do not upload real passwords, API keys, email passwords, or secret tokens to GitHub.

## Database

The project uses MongoDB.
Before running the application, make sure MongoDB is installed and running locally, or use a MongoDB cloud connection string.

Database files are included inside the `db/InexPrice` folder.

## Important Notes

* This project was created as a college final project.
* The application contains many e-commerce features and backend modules.
* Payment functionality should be treated as a project/demo flow unless connected to a real payment provider.
* Make sure not to expose private credentials in the repository.

## Author

Developed by George Abou Khalil.

GitHub: [georgeAbouKhalil](https://github.com/georgeAbouKhalil)
