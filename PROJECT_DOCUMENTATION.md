# DevFlow Backend - Project Documentation

## 📋 Project Overview

**DevFlow** is a Q&A (Question & Answer) platform backend API, similar to Stack Overflow. It allows developers to:
- Ask technical questions
- Provide answers to questions
- Vote on questions and answers
- Comment on questions and answers
- Manage user profiles with different roles (user, expert, admin)
- Pin questions (experts/admins only)
- Verify answers (experts/admins only)

---

## 🛠️ Technology Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework for building REST APIs
- **MongoDB** - NoSQL database for storing data
- **Mongoose** - MongoDB object modeling tool
- **JWT (JSON Web Tokens)** - For user authentication
- **bcryptjs** - For password hashing
- **dotenv** - For environment variable management

---

## 📁 Project Structure

```
devFlow-backend/
├── index.js                 # Main application entry point
├── package.json             # Project dependencies and scripts
├── .env                     # Environment variables (not in repo)
│
├── models/                  # Mongoose models (database collections)
│   ├── User.js
│   ├── Question.js
│   ├── Answer.js
│   ├── Comment.js
│   └── Vote.js
│
├── schema/                  # Mongoose schemas (data structure definitions)
│   ├── userSchema.js
│   ├── questionSchema.js
│   ├── answerSchema.js
│   ├── commentSchema.js
│   └── voteSchema.js
│
├── routes/                  # API route handlers
│   ├── auth.js             # Authentication routes (login, register)
│   ├── questions.js        # Question CRUD operations
│   ├── answers.js          # Answer CRUD operations
│   ├── comments.js         # Comment operations
│   ├── votes.js            # Voting operations
│   └── users.js            # User profile operations
│
├── utils/                   # Utility functions
│   └── auth.js             # JWT token generation and authentication middleware
│
└── scripts/                 # Utility scripts
    ├── seedData.js         # Script to populate database with sample data
    └── fixUsers.js         # Script to fix user passwords
```

---

## 📄 File-by-File Explanation

### Root Level Files

#### `index.js` - Main Application Entry Point
**Purpose**: This is the heart of your application. It:
- Sets up the Express server
- Connects to MongoDB database
- Configures CORS (Cross-Origin Resource Sharing) for frontend communication
- Loads all models and routes
- Starts the server on a specified port

**Key Responsibilities**:
- Server initialization
- Middleware configuration (CORS, JSON parsing)
- Database connection
- Route mounting
- Error handling (404 handler)

**Flow**:
1. Creates Express app
2. Sets up CORS to allow frontend requests
3. Connects to MongoDB
4. Loads all Mongoose models
5. Mounts all route handlers
6. Starts listening on PORT (from env or default 5000)

---

### 📂 `models/` Folder

**Purpose**: Contains Mongoose models that represent your database collections. These files import schemas and create models that you can use to interact with the database.

#### `models/User.js`
- Creates the User model from `userSchema`
- Used to create, read, update, delete users in the database
- Example: `User.findById()`, `User.create()`, `User.findOne()`

#### `models/Question.js`
- Creates the Question model from `questionSchema`
- Used for all question-related database operations
- Example: `Question.find()`, `Question.create()`, `Question.findByIdAndUpdate()`

#### `models/Answer.js`
- Creates the Answer model from `answerSchema`
- Used for answer-related database operations

#### `models/Comment.js`
- Creates the Comment model from `commentSchema`
- Used for comment-related database operations

#### `models/Vote.js`
- Creates the Vote model from `voteSchema`
- Used for vote-related database operations

**Note**: Models are the interface between your code and the database. They provide methods to query and manipulate data.

---

### 📂 `schema/` Folder

**Purpose**: Defines the structure and validation rules for your database documents. Schemas define what fields exist, their types, and constraints.

#### `schema/userSchema.js`
**Defines**:
- `username` - String, required, unique
- `email` - String, required, unique
- `password` - String, required (automatically hashed before saving)
- `bio` - Optional string for user biography
- `title` - Optional string for job title
- `location` - Optional string for location
- `reputation` - Number, defaults to 0
- `role` - Enum: 'user', 'expert', or 'admin' (default: 'user')
- `following` - Array of user IDs (for following other users)
- `createdAt` - Timestamp

**Special Features**:
- Pre-save hook: Automatically hashes passwords using bcrypt before saving
- Method: `matchPassword()` - Compares plain password with hashed password

#### `schema/questionSchema.js`
**Defines**:
- `title` - String, required
- `body` - String, required
- `asker` - Reference to User who asked the question
- `tags` - Array of strings (e.g., ['javascript', 'react'])
- `votes` - Number, defaults to 0
- `views` - Number, defaults to 0
- `answerCount` - Number, defaults to 0
- `acceptedAnswer` - Reference to accepted Answer
- `isPinned` - Boolean, defaults to false
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

#### `schema/answerSchema.js`
**Defines**:
- `questionId` - Reference to Question
- `answerer` - Reference to User who answered
- `body` - String, required (the answer text)
- `votes` - Number, defaults to 0
- `isAccepted` - Boolean, defaults to false
- `isVerified` - Boolean, defaults to false (verified by expert/admin)
- `verifiedBy` - Reference to User who verified
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

#### `schema/commentSchema.js`
**Defines**:
- `body` - String, required
- `author` - Reference to User who commented
- `targetType` - String: 'question' or 'answer'
- `targetId` - Reference to the question or answer being commented on
- `createdAt` - Timestamp

#### `schema/voteSchema.js`
**Defines**:
- `user` - Reference to User who voted
- `targetType` - String: 'question' or 'answer'
- `targetId` - Reference to the question or answer being voted on
- `value` - Number: 1 (upvote) or -1 (downvote)
- `createdAt` - Timestamp

**Note**: Schemas define the blueprint. Models use schemas to interact with the database.

---

### 📂 `routes/` Folder

**Purpose**: Contains route handlers that define API endpoints. Each file handles requests for a specific resource.

#### `routes/auth.js` - Authentication Routes
**Endpoints**:
- `POST /api/auth/register` - Create a new user account
  - Body: `{ username, email, password, role? }`
  - Returns: User data + JWT token
  
- `POST /api/auth/login` - Login existing user
  - Body: `{ email, password }`
  - Returns: User data + JWT token
  
- `GET /api/auth/me` - Get current logged-in user (protected)
  - Headers: `Authorization: Bearer <token>`
  - Returns: User data (without password)

**Purpose**: Handles user registration, login, and authentication.

#### `routes/questions.js` - Question Routes
**Endpoints**:
- `GET /api/questions` - Get all questions (with pagination, search, filtering)
- `GET /api/questions/:id` - Get single question with answers and comments
- `POST /api/questions` - Create new question (protected)
- `PUT /api/questions/:id` - Update question (protected - owner only)
- `DELETE /api/questions/:id` - Delete question (protected - owner or admin)
- `POST /api/questions/:id/upvote` - Upvote question (protected)
- `POST /api/questions/:id/downvote` - Downvote question (protected)
- `POST /api/questions/:id/pin` - Pin question (protected - expert/admin only)
- `POST /api/questions/:id/unpin` - Unpin question (protected - expert/admin only)

**Purpose**: Handles all question-related operations including CRUD, voting, and pinning.

#### `routes/answers.js` - Answer Routes
**Endpoints**:
- `POST /api/questions/:questionId/answers` - Create answer (protected)
- `PUT /api/questions/:questionId/answers/:answerId` - Update answer (protected - owner only)
- `PUT /api/questions/:questionId/answers/:answerId/accept` - Accept answer (protected - question asker only)
- `DELETE /api/questions/:questionId/answers/:answerId` - Delete answer (protected - owner or admin)

**Purpose**: Handles answer creation, updates, acceptance, and deletion.

#### `routes/comments.js` - Comment Routes
**Endpoints**:
- `POST /api/comments` - Create comment (protected)
  - Body: `{ body, targetType: 'question'|'answer', targetId }`
- `PUT /api/comments/:id` - Update comment (protected - owner only)
- `DELETE /api/comments/:id` - Delete comment (protected - owner or admin)

**Purpose**: Handles comments on questions and answers.

#### `routes/votes.js` - Vote Routes
**Endpoints**:
- `POST /api/votes` - Create or update vote (protected)
  - Body: `{ targetType: 'question'|'answer', targetId, value: 1|-1 }`
  - If vote exists: updates or removes it
  - If vote doesn't exist: creates new vote
- `GET /api/votes/:targetType/:targetId` - Get user's vote on a target (protected)

**Purpose**: Handles voting on questions and answers. Supports upvoting, downvoting, and vote removal.

#### `routes/users.js` - User Profile Routes
**Endpoints**:
- `GET /api/users/:id` - Get user profile (public)
- `PUT /api/users/:id` - Update user profile (protected - owner only)
- `PUT /api/users/:id/role` - Update user role (protected - admin or self)
- `GET /api/users/:id/questions` - Get user's questions (public, paginated)
- `GET /api/users/:id/answers` - Get user's answers (public, paginated)

**Purpose**: Handles user profile operations and user-related data retrieval.

---

### 📂 `utils/` Folder

**Purpose**: Contains reusable utility functions used across the application.

#### `utils/auth.js` - Authentication Utilities
**Exports**:
1. **`generateToken(userId)`** - Creates a JWT token for a user
   - Used after login/registration
   - Token expires in 30 days
   - Contains user ID

2. **`protect`** - Middleware to protect routes
   - Checks for JWT token in `Authorization: Bearer <token>` header
   - Verifies token validity
   - Attaches `userId` to `req.userId` if valid
   - Returns 401 if token is missing or invalid
   - Usage: `router.get('/protected', protect, handler)`

3. **`optionalAuth`** - Optional authentication middleware
   - Similar to `protect` but doesn't require token
   - If token exists and is valid, attaches `userId` to request
   - If token is missing or invalid, continues without error
   - Used for routes that work both for logged-in and anonymous users

**Purpose**: Provides authentication and authorization utilities for securing routes.

---

### 📂 `scripts/` Folder

**Purpose**: Contains utility scripts for database management and setup.

#### `scripts/seedData.js` - Database Seeding Script
**Purpose**: Populates the database with sample data for development/testing.

**What it does**:
1. Connects to MongoDB
2. Clears all existing data (users, questions, answers, comments, votes)
3. Creates sample users (admin, experts, regular users)
4. Creates sample questions with tags
5. Creates sample answers
6. Creates sample comments
7. Creates sample votes
8. Prints summary and login credentials

**Usage**: `node scripts/seedData.js`

**Note**: Passwords are automatically hashed by the userSchema pre-save hook.

#### `scripts/fixUsers.js` - User Password Fix Script
**Purpose**: Utility script to fix user passwords if they were double-hashed.

**What it does**:
1. Deletes all existing users
2. Recreates users with properly hashed passwords
3. Useful if passwords were incorrectly hashed during seeding

**Usage**: `node scripts/fixUsers.js`

---

## 🔄 How Everything Works Together

### Request Flow Example: Creating a Question

1. **Frontend** sends `POST /api/questions` with JWT token in header
2. **index.js** receives request and routes it to `routes/questions.js`
3. **routes/questions.js** uses `protect` middleware from `utils/auth.js`
4. **protect** middleware verifies JWT token and attaches `userId` to request
5. **Route handler** extracts question data from request body
6. **Question model** (from `models/Question.js`) creates new question in database
7. **Response** sent back to frontend with created question data

### Authentication Flow Example: User Login

1. **Frontend** sends `POST /api/auth/login` with email and password
2. **routes/auth.js** finds user by email using `User` model
3. **User model** uses `matchPassword()` method from schema to verify password
4. **utils/auth.js** `generateToken()` creates JWT token
5. **Response** sent back with user data and JWT token
6. **Frontend** stores token and uses it for authenticated requests

---

## 🔐 Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt before storage
2. **JWT Authentication**: Secure token-based authentication
3. **Protected Routes**: Routes use `protect` middleware to require authentication
4. **Role-Based Access**: Different roles (user, expert, admin) have different permissions
5. **CORS Configuration**: Only allows requests from specified origins

---

## 📊 Database Relationships

- **User** → has many **Questions** (asker)
- **User** → has many **Answers** (answerer)
- **User** → has many **Comments** (author)
- **User** → has many **Votes** (voter)
- **Question** → has many **Answers** (questionId)
- **Question** → has one **acceptedAnswer** (Answer)
- **Answer** → belongs to one **Question** (questionId)
- **Answer** → can be verified by one **User** (verifiedBy)
- **Comment** → belongs to **Question** or **Answer** (targetType, targetId)
- **Vote** → belongs to **Question** or **Answer** (targetType, targetId)

---

## 🚀 API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Questions
- `GET /api/questions` - List questions (with filters)
- `GET /api/questions/:id` - Get question details
- `POST /api/questions` - Create question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question
- `POST /api/questions/:id/upvote` - Upvote question
- `POST /api/questions/:id/downvote` - Downvote question
- `POST /api/questions/:id/pin` - Pin question
- `POST /api/questions/:id/unpin` - Unpin question

### Answers
- `POST /api/questions/:questionId/answers` - Create answer
- `PUT /api/questions/:questionId/answers/:answerId` - Update answer
- `PUT /api/questions/:questionId/answers/:answerId/accept` - Accept answer
- `DELETE /api/questions/:questionId/answers/:answerId` - Delete answer

### Comments
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

### Votes
- `POST /api/votes` - Create/update/remove vote
- `GET /api/votes/:targetType/:targetId` - Get user's vote

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `PUT /api/users/:id/role` - Update user role
- `GET /api/users/:id/questions` - Get user's questions
- `GET /api/users/:id/answers` - Get user's answers

### Health Check
- `GET /api/test` - Check if server is running

---

## 🔑 Environment Variables Required

Create a `.env` file with:
```
MONGODB_URI=mongodb://your-mongodb-connection-string
JWT_SECRET=your-secret-key-for-jwt-tokens
PORT=5000 (optional, defaults to 5000)
NODE_ENV=production (or development)
```

---

## 📝 Key Concepts

### Models vs Schemas
- **Schema**: Defines the structure and validation rules
- **Model**: Uses schema to interact with database (create, read, update, delete)

### Middleware
- Functions that run between receiving request and sending response
- `protect`: Requires authentication
- `optionalAuth`: Optional authentication
- `express.json()`: Parses JSON request bodies

### Protected Routes
- Routes that require authentication
- Use `protect` middleware
- Access `req.userId` to get current user ID

### Role-Based Access
- **user**: Regular user, can ask/answer questions
- **expert**: Can pin their own questions, verify answers
- **admin**: Full access, can do everything

---

## 🎯 Quick Reference

**To add a new route**:
1. Create handler in appropriate `routes/` file
2. Add `protect` middleware if route needs authentication
3. Use models to interact with database
4. Return JSON response

**To add a new field to a model**:
1. Update schema in `schema/` folder
2. Model automatically uses updated schema
3. Existing documents won't have new field until updated

**To add a new model**:
1. Create schema in `schema/` folder
2. Create model in `models/` folder
3. Require model in `index.js` (optional, for initialization)
4. Use model in routes

---

This documentation should help you understand the codebase structure and how each component works together! 🚀

