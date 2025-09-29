# commerce
# ME25 Commerce Backend

This is the backend service for the **MENTORSHIP-25 Commerce Platform**.  
It powers the e-commerce system with APIs for users, products, orders, payments, authentication, background jobs, and more.  

Built with **Node.js, Express, and TypeScript**.

## 🚀 Features
- User authentication & authorization (in progress, JWT-based)
- Email notifications
- Background jobs & queues (Bull)
- Modular service-based architecture
- Request validation using DTOs
- Logging and error handling middleware

## 🛠 Tech Stack
- **Runtime**: Node.js (TypeScript)
- **Framework**: Express.js
- **Database**: MongoDB 
- **ORM/ODM**: Mongoose
- **Queues**: Bull (Redis-backed)
- **Services**: Email, Auth, System, User

## 📦 Project Structure
src/
├─ config/ # Configurations (env, db, redis, zepto)
├─ controllers/ # Route handlers (request/response)
├─ dtos/ # Data transfer objects (validation)
├─ mappers/ # Entity/data mappers
├─ middleware/ # Middlewares (auth, logging)
├─ models/ # Database models
├─ queues/ # Bull queues, workers, jobs
├─ repositories/ # DB access layer
├─ routes/ # Route definitions
├─ services/ # Business logic (auth, user, email)
├─ utils/ # Utility functions
├─ views/ # template
├─ logs/ # Application logs
└─ server.ts # App entry point

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/your-username/me25-commerce-backend.git
cd me25-commerce-backend

npm install
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=

# JWT
JWT_SECRET=
JWT_EXPIRY=

# Redis (for Bull queues)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Email
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

npm run dev



