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

Copy `backend/.env.example` to `backend/.env`, then set a private `JWT_SECRET`. For local MongoDB, keep the example `MONGO_URI`; for Atlas, use your Atlas connection string instead. Never commit `.env` or share its values.

Start the backend:
```
npm run dev
```

Create the first administrator by setting `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in `backend/.env`, then run this once:
```bash
npm run seed:admin
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

During local development the frontend uses `http://localhost:5000/api`. In production it uses the Render API URL below by default; set `REACT_APP_API_URL` in Vercel if your Render service uses a different URL.

### Deployment: Render, Vercel, and Atlas
- Render backend root directory: `backend`; build command: `npm install`; start command: `npm start`.
- Set Render environment variables `MONGO_URI` (Atlas connection string) and `JWT_SECRET` (a long, random secret). Render supplies `PORT` automatically.
- In MongoDB Atlas, create a database user and allow network access from the Render service. Use a strong database password in the connection string.
- Vercel frontend root directory: `frontend`; build command: `npm run build`; output directory: `build`.
- `frontend/vercel.json` provides the SPA fallback so direct links and page refreshes work with React Router.
- Set Vercel `REACT_APP_API_URL` to `https://library-management-by-arjun.onrender.com/api` (or the actual Render API URL), then redeploy the frontend.
- To create the initial production admin, run `npm run seed:admin` from `backend` with the production `MONGO_URI`, `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` set. The seed never replaces an existing account.

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
