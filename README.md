# Flipkart Clone — Full Stack E-Commerce App

A feature-rich e-commerce application replicating Flipkart's design and functionality, built with a **FastAPI** backend and **React (Vite)** frontend.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router DOM v6, Context API, Vanilla CSS |
| **Backend** | Python 3.11+, FastAPI, SQLAlchemy ORM, Pydantic v2 |
| **Database** | SQLite (local dev) → PostgreSQL (production via Railway) |
| **Auth** | JWT (python-jose), bcrypt password hashing (passlib) |
| **Deployment** | Railway (backend + DB), Vercel (frontend) |

---

## ✨ Features

- 🛍️ **Product Catalog** — 37 products across 5 categories (Mobiles, Fashion, Electronics, Home, Appliances)
- 🔍 **Live Search** — Partial/fuzzy search directly from the header bar
- 🗂️ **Category Filtering** — Click any category strip to filter; "All Offers" resets view
- 🖼️ **Multi-Image Gallery** — Each product has a thumbnail strip with hover-to-switch main image
- ❤️ **Wishlist** — Toggle heart icon; real-time red/grey feedback; full wishlist page
- 🛒 **Cart** — Add, remove, update quantity; persistent per user
- 🔐 **Auth** — Login (email or mobile + password), Register; JWT stored in localStorage
- 📦 **Orders** — Multi-step checkout with resilient failure handling (Backend survives mailer errors)
- 🎁 **Gift Delivery** — Choose to deliver to yourself (pre-filled) or someone else; supports localized addresses
- 📬 **Email Confirmation** — Integrated SendGrid support via `MAIL_API_KEY`; falls back to terminal logs if unconfigured
- 📱 **Responsive** — Works on mobile, tablet, and desktop

---

## 📁 Project Structure

```
scaler/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── database.py          # DB connection (SQLite/PostgreSQL auto-detect)
│   ├── models.py            # SQLAlchemy ORM models
│   ├── schemas.py           # Pydantic request/response schemas
│   ├── seed_db.py           # Database seeder (37 sample products)
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example         # Environment variable template
│   └── routers/
│       ├── users.py         # Auth: register, login, /me
│       ├── products.py      # Product listing, detail, similar
│       ├── cart.py          # Cart CRUD
│       ├── orders.py        # Order placement & history
│       └── wishlist.py      # Wishlist toggle & listing
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Routes
│   │   ├── context/
│   │   │   └── StoreContext.jsx  # Global state (auth, cart, wishlist)
│   │   ├── components/
│   │   │   └── Header.jsx   # Sticky header, search, user menu
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Product grid + category filter
│   │   │   ├── ProductDetail.jsx # Multi-image, stock, similar products
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx     # Multi-step checkout
│   │   │   ├── Login.jsx
│   │   │   ├── Orders.jsx
│   │   │   └── Wishlist.jsx
│   │   └── index.css        # All styles (no CSS framework)
│   ├── .env.example         # Frontend env template
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🗄️ Database Schema

```
users           — id, email, hashed_password
categories      — id, name
products        — id, title, description, price, image_url, stock, category_id
product_images  — id, product_id, url          (multi-image gallery)
carts           — id, user_id
cart_items      — id, cart_id, product_id, quantity
orders          — id, user_id, total_amount, customer_name, customer_phone,
                  shipping_address, pincode, status
order_items     — id, order_id, product_id, quantity, price
wishlist_items  — id, user_id, product_id
```

---

## 🚀 Local Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/flipkart-clone.git
cd flipkart-clone
```

### 2. Backend setup
```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate it
# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create your .env file
cp .env.example .env
# (No changes needed for local dev — SQLite is used by default)

# Seed the database with 37 sample products
python seed_db.py

# Start the backend server
uvicorn main:app --reload --port 8000
```

API docs available at: **http://localhost:8000/docs**

### 3. Frontend setup
```bash
cd frontend

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
# Default VITE_API_URL=http://localhost:8000 is correct for local dev

# Start the dev server
npm run dev
```

Frontend available at: **http://localhost:5173**

### 4. Default login credentials
```
Email:    user@flipkart.com
Password: password
```

---

## 🌐 Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full step-by-step Railway + Vercel deployment guide.

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | SQLite (local) |
| `SECRET_KEY` | JWT signing secret | `supersecretkey_changeme` |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token TTL | `10080` (7 days) |
| `FRONTEND_URL` | Vercel frontend URL for CORS | `http://localhost:5173` |
| `MAIL_API_KEY` | Email API key (optional) | logs to terminal if empty |

### Frontend (`frontend/.env`)
| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8000` |

---

## 📝 Assumptions

1. A single user account is pre-seeded (`user@flipkart.com`). Registration creates new users but they aren't linked to the seeded cart — users get their own fresh cart on first login.
2. Payment is simulated — no real payment gateway is integrated.
3. The email confirmation system supports SendGrid. If `MAIL_API_KEY` is not set, it gracefully logs the content to the backend terminal for debugging.
4. Wishlist and Cart state are synchronized globally using React Context, ensuring real-time UI updates across all pages.
5. Product images use Unsplash for primary visuals and placehold.co for secondary gallery angles.
