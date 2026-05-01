

# 📚 Mango — Digital Book Borrowing Platform

🔗 **Live Application:** [https://ornate-brigadeiros-38b3d8.netlify.app/books](https://ornate-brigadeiros-38b3d8.netlify.app/books)

---

## 🧭 Product Overview

**Mango** is a scalable web application that modernizes the traditional library system into a seamless digital experience. It enables users to explore book collections, access detailed metadata, and interact with a structured borrowing interface.

The system is designed with a **modular architecture, performance-first mindset, and extensibility**, making it suitable for production-grade evolution.

---

## ✨ Core Capabilities

* **Catalog Exploration** — Structured browsing of available books
* **Dynamic Routing** — Dedicated detail pages for each book
* **Component-Driven UI** — Reusable and maintainable frontend architecture
* **Responsive Interface** — Optimized for desktop and mobile devices
* **Scalable Foundation** — Designed for backend and authentication integration

---

## 🏗️ System Architecture

The project follows a **frontend-first modular architecture**, with clear separation of concerns:

* **Presentation Layer** — UI components and layout
* **Routing Layer** — Page-based navigation (Next.js App Router)
* **Data Layer (Mock)** — Static dataset simulating API responses

This structure enables smooth transition into a **full-stack system** with minimal refactoring.

---

## 🧱 Technology Stack

| Layer       | Technology                  |
| ----------- | --------------------------- |
| Frontend    | Next.js (App Router), React |
| Styling     | Tailwind CSS                |
| Data Source | Local static dataset (mock) |
| Deployment  | Netlify                     |

---

## 📂 Project Structure

```
/src
 ├── app
 │   ├── page.jsx                # Landing page
 │   ├── books/page.jsx         # Book listing interface
 │   ├── books/[id]/page.jsx    # Dynamic book detail page
 │   ├── profile/page.jsx       # User profile (UI scaffold)
 │
 ├── components
 │   ├── Navbar.jsx             # Global navigation
 │
 ├── data
 │   ├── books.js               # Mock data source
```

---

## ⚙️ Local Development

### 1. Clone Repository



### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Application runs on: `http://localhost:3000`

---

## 🚀 Production Roadmap

To elevate Mango into a **production-grade system**, the following upgrades are critical:

### Backend & Data

* Integrate **MongoDB** with schema design
* Build **REST or GraphQL API**
* Replace mock data with persistent storage

### Authentication & Security

* Implement **JWT / BetterAuth**
* Role-based access control (User / Admin)

### Core Business Logic

* Book borrowing & return workflows
* Availability tracking system
* Transaction history

### Performance & Scaling

* Server-side rendering optimization
* API caching strategies
* Pagination & filtering

### Admin Capabilities

* Book inventory management
* User management dashboard

---

## 📈 Engineering Value

This project demonstrates:

* Scalable **folder and routing architecture**
* Clean **component abstraction**
* Understanding of **real-world product structure**
* Readiness for **full-stack expansion**

---

## 👤 Author

**Nabil**

* Focus: Scalable web systems & high-performance applications
* Trajectory: Full-stack engineering → Top-tier tech companies

