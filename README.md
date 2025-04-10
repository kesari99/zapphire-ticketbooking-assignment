# 🎟️ Seat Booking App

A dynamic seat booking system built with **Next.js 14 (App Router)**, **Prisma**, and **PostgreSQL**, with full **authentication**, **client-side UI**, and **cookie-based session handling**.

<br/>

## 🚀 Features

- 🔐 User authentication with **login/logout**
- 🍪 **JWT cookies** for secure session management
- 💺 Book 1-7 seats at once
- 🖥️ Visual seat layout with color indicators
- 🔁 Reset all seats (admin or demo usage)
- 📡 Axios-based API calls with **cookie credentials**
- 🌐 Responsive TailwindCSS design
- ⚙️ Prisma ORM with PostgreSQL

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: JWT stored in **HTTP-only cookies**
- **API**: RESTful APIs via Next.js Route Handlers
- **Frontend**: React with TailwindCSS
- **HTTP Client**: Axios with `withCredentials` enabled

---

# 1. Clone the repo
git clone https://github.com/your-username/seat-booking-app.git
cd seat-booking-app

# 2. Install dependencies
npm install

# 3. Setup database
npx prisma migrate dev --name init

# 4. Run the dev server
npm run dev


