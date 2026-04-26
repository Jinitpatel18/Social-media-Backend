# 🚀 Social Media Backend

A production-ready REST API for a social media application built with Node.js, Express, and MongoDB.

## 🌐 Live URL
https://social-media-backend-vbgi.onrender.com

## 🛠️ Tech Stack
- **Runtime** — Node.js
- **Framework** — Express.js
- **Database** — MongoDB + Mongoose
- **Authentication** — JWT (Access + Refresh Tokens)
- **File Upload** — Multer + Cloudinary
- **Security** — Helmet, CORS, Rate Limiting
- **Password** — bcrypt

## ✨ Features
- ✅ User Authentication — Register, Login, Logout
- ✅ JWT Access + Refresh Token Rotation
- ✅ File Upload — Avatar, Cover Image, Post Images
- ✅ Role Based Access Control — Admin + User
- ✅ Post CRUD — Create, Read, Update, Delete
- ✅ Like / Unlike System
- ✅ Comment System
- ✅ Follow / Unfollow System
- ✅ Pagination + Search
- ✅ API Security — Helmet, CORS, Rate Limiting
- ✅ Global Error Handling

## 📁 Project Structure
src/
├── Controllers/
│   ├── user.controller.js
│   ├── admin.controller.js
│   ├── post.controller.js
│   ├── comment.controller.js
│   └── follow.controller.js
├── Models/
│   ├── user.model.js
│   ├── post.model.js
│   ├── comment.model.js
│   └── follow.model.js
├── Routes/
│   ├── user.route.js
│   ├── admin.route.js
│   ├── post.route.js
│   ├── comment.route.js
│   └── follow.route.js
├── Middleware/
│   ├── auth.middleware.js
│   └── multer.middleware.js
└── Utils/
├── ApiError.js
├── ApiResponse.js
├── asyncHandler.js
├── cloudinary.js
└── rateLimits.js

## 🔑 Environment Variables
MONGODB_URI=
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRES=7d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CORS_ORIGIN=
NODE_ENV=production

## 📡 API Endpoints

### Auth Routes — /api/v1/users
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /register | No | Register user |
| POST | /login | No | Login user |
| POST | /logout | Yes | Logout user |
| POST | /refresh-token | No | Refresh access token |
| POST | /change-password | Yes | Change password |
| GET | /profile | Yes | Get profile |
| PATCH | /update-profile | Yes | Update profile |
| PATCH | /update-avatar | Yes | Update avatar |
| PATCH | /update-cover-image | Yes | Update cover image |

### Post Routes — /api/v1/posts
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | / | Yes | Create post |
| GET | / | No | Get all posts |
| GET | /:id | No | Get single post |
| PATCH | /:id | Yes | Update post |
| DELETE | /:id | Yes | Delete post |
| POST | /:id/like | Yes | Like/Unlike post |

### Comment Routes — /api/v1/comment
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /:postId/comments | Yes | Create comment |
| GET | /:postId/comments | No | Get all comments |
| DELETE | /:postId/comments/:commentId | Yes | Delete comment |

### Follow Routes — /api/v1/follow
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /:userId | Yes | Follow/Unfollow |
| GET | /:userId/followers | No | Get followers |
| GET | /:userId/following | No | Get following |

### Admin Routes — /api/v1/admin
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /users | Admin | Get all users |
| DELETE | /user/:id | Admin | Delete user |
| PATCH | /user/:id/role | Admin | Change role |

## 🚀 Local Setup
```bash
# Clone karo
git clone https://github.com/Jinitpatel18/Social-media-Backend.git

# Install karo
npm install

# .env banao
cp .env.example .env

# Run karo
npm run dev
```

## 👨‍💻 Developer
**Jinit Patel**
GitHub — https://github.com/Jinitpatel18
