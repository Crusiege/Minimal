# Minimal Blog

**A modern, clean MERN stack blog application with user authentication, post creation, and interactive features.**

-----

## Table of Contents

1.  [Key Features](https://www.google.com/search?q=%23key-features)
2.  [Tech Stack](https://www.google.com/search?q=%23tech-stack)
3.  [Project Structure](https://www.google.com/search?q=%23project-structure)
4.  [Getting Started](https://www.google.com/search?q=%23getting-started)
      * [Prerequisites](https://www.google.com/search?q=%23prerequisites)
      * [Installation & Setup](https://www.google.com/search?q=%23installation--setup)
      * [Running the Application](https://www.google.com/search?q=%23running-the-application)
5.  [API Endpoints](https://www.google.com/search?q=%23api-endpoints)
6.  [Testing](https://www.google.com/search?q=%23testing)
7.  [Deployment](https://www.google.com/search?q=%23deployment)

-----

## Key Features

### Authentication

  - User registration and login with JWT.
  - Secure password hashing with `bcrypt`.
  - Protected routes and persistent user sessions.

### Blog Functionality

  - Full CRUD (Create, Read, Update, Delete) functionality for posts.
  - Like/unlike posts with real-time updates.
  - Post view count tracking.
  - Rich text editor for creating engaging content.
  - User-specific post management dashboard.

### Modern UI/UX

  - Clean, minimal, and content-focused design.
  - Fully responsive, mobile-first layout.
  - Dark theme with professional typography.
  - Smooth animations and page transitions.
  - Floating action button for quick post creation.

### Security

  - Server-side input validation and sanitization.
  - Cross-Site Scripting (XSS) protection.
  - API rate limiting to prevent abuse.
  - MongoDB query sanitization to prevent injection attacks.
  - Secure HTTP headers with `Helmet.js`.

-----

## Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React, CSS3 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose |
| **Authentication** | JSON Web Tokens (JWT), bcrypt |
| **Deployment** | Vercel (Frontend), Heroku/Railway (Backend) |

-----

## Project Structure

```
minimal/
├── backend/                 # Node.js/Express API
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .gitignore
│   ├── package.json
│   ├── seeder.js
│   └── server.js
├── frontend/               # React application
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

-----

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

Make sure you have the following software installed:

  * [Node.js](https://nodejs.org/) (v14 or higher)
  * [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
  * [MongoDB](https://www.mongodb.com/try/download/community) (local installation or a cloud instance from [MongoDB Atlas](https://www.mongodb.com/atlas))

### Installation & Setup

1.  **Clone the Repository**

    ```bash
    git clone <your-repo-url>
    cd minimal
    ```

2.  **Set Up the Backend**

    ```bash
    # Navigate to the backend directory
    cd backend

    # Install dependencies
    npm install

    # Create a .env file for environment variables
    touch .env
    ```

    Add the following configuration to the `.env` file you just created:

    ```env
    # Server Configuration
    NODE_ENV=development
    PORT=5000

    # Database (replace with your MongoDB connection string)
    MONGODB_URI=mongodb://localhost:27017/minimal-blog

    # JWT Configuration
    JWT_SECRET=your-super-secure-jwt-secret-key-change-this-in-production
    JWT_EXPIRE=7d
    JWT_COOKIE_EXPIRE=7

    # Client URL (for CORS)
    CLIENT_URL=http://localhost:3000
    ```

3.  **Set Up the Frontend**

    ```bash
    # Navigate to the frontend directory from the root
    cd ../frontend

    # Install dependencies
    npm install
    ```

### Running the Application

You'll need two separate terminal windows to run the frontend and backend servers concurrently.

**Terminal 1: Start the Backend Server**

```bash
cd backend
npm run dev
# Server will be running on http://localhost:5000
```

**Terminal 2: Start the Frontend Application**

```bash
cd frontend
npm start
# App will be running on http://localhost:3000
```

-----

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Log in a user | No |
| `POST` | `/api/auth/logout` | Log out the current user | Yes |
| `GET` | `/api/auth/me` | Get current user's details | Yes |
| `PUT` | `/api/auth/updatedetails` | Update user profile info | Yes |
| `PUT` | `/api/auth/updatepassword`| Update user password | Yes |

### Posts

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/posts` | Get all posts | No |
| `GET` | `/api/posts/search` | Search posts by keyword | No |
| `GET` | `/api/posts/popular` | Get popular posts | No |
| `GET` | `/api/posts/:id` | Get a single post | No |
| `GET` | `/api/posts/user/:userId`| Get all posts by a user | No |
| `POST`| `/api/posts` | Create a new post | Yes |
| `PUT` | `/api/posts/:id` | Update an existing post | Yes (Owner) |
| `DELETE`| `/api/posts/:id` | Delete a post | Yes (Owner) |
| `PUT` | `/api/posts/:id/like` | Like or unlike a post | Yes |
| `PUT` | `/api/posts/:id/view` | Increment the view count | No |

-----
