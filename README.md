# 📚 Library Management System

A full-stack Library Management System built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) as a virtual internship project.

## 🚀 Features

- **Authentication** – JWT-based login with role-based access (Admin, Librarian, Member)
- **Book Management** – Add, Edit, Delete, Search books with inventory tracking
- **Member Management** – Register and manage library members with membership IDs
- **Transaction System** – Issue books, return books, auto fine calculation (₹5/day)
- **Dashboard** – Real-time stats (total books, members, issued books, overdue)
- **Validation** – Input validation on both frontend and backend

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT (JSON Web Tokens) + bcryptjs |
| Validation | express-validator |

## 📁 Project Structure

```
library-management-system/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Book.js
│   │   ├── Member.js
│   │   └── Transaction.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── books.js
│   │   ├── members.js
│   │   └── transactions.js
│   ├── middleware/
│   │   └── auth.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── Navbar.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Dashboard.js
    │   │   ├── Books.js
    │   │   ├── Members.js
    │   │   └── Transactions.js
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    └── package.json
```

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/library-management-system.git
cd library-management-system
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```
MONGO_URI=mongodb://localhost:27017/librarydb
JWT_SECRET=your_super_secret_key
PORT=5000
```

Start backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 4. Create First Admin User
Use Postman or Thunder Client to POST to `https://library-management-by-arjun.onrender.com/api/auth/register`:
```json
{
  "name": "Admin User",
  "email": "admin@library.com",
  "password": "admin123",
  "role": "admin"
}
```

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |

### Books
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/books | Get all books |
| GET | /api/books/:id | Get single book |
| POST | /api/books | Add new book |
| PUT | /api/books/:id | Update book |
| DELETE | /api/books/:id | Delete book |

### Members
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/members | Get all members |
| POST | /api/members | Add member |
| PUT | /api/members/:id | Update member |
| DELETE | /api/members/:id | Delete member |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/transactions | All transactions |
| POST | /api/transactions/issue | Issue a book |
| PUT | /api/transactions/return/:id | Return a book |
| GET | /api/transactions/overdue | Overdue books |

## ✅ Validation Rules

- Book: title, author, ISBN (unique), category, copies required
- Member: name, email (unique), phone required
- Auth: email format, password min 6 chars
- Transaction: checks available copies, member active status

## 📝 License

MIT License – Free for educational use.
