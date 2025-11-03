# 🚀 GetItDone - Local Services Marketplace

**GetItDone** is a comprehensive task management and service marketplace platform that connects task creators (users) with skilled helpers. The platform features a robust rating system, KYC verification, subscription management, and two-way reviews to ensure trust and quality service delivery.

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge)](https://getitdone.amjad.biz)
[![Backend](https://img.shields.io/badge/API-Live-blue?style=for-the-badge)](https://getitdone-backend-afcc.onrender.com)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [User Roles](#-user-roles)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎯 Core Features

- **Three User Roles:** Regular Users (Task Creators), Helpers, and Admins
- **Task Management:** Create, browse, accept, and complete tasks
- **Smart Matching:** Helpers can view tasks and tasker profiles before accepting
- **Two-Way Rating System:** Both taskers and helpers can rate each other
- **KYC Verification:** Helper application system with document upload
- **Email Notifications:** Automated emails for all critical actions
- **Subscription System:** Trial and paid subscription plans for helpers
- **Admin Dashboard:** Comprehensive helper application management
- **Payment Integration:** Razorpay integration for subscriptions
- **File Upload:** Cloudinary integration for KYC documents and attachments

### 👤 For Task Creators (Users)

- ✅ Create and manage tasks with detailed information
- ✅ Receive applications from verified helpers
- ✅ View helper profiles, ratings, and reviews before approval
- ✅ Approve/reject helper requests
- ✅ Rate and review helpers after task completion
- ✅ Email notifications with action links

### 🛠️ For Helpers

- ✅ Browse available tasks by category and location
- ✅ View tasker profiles and reviews before accepting
- ✅ Apply for tasks with one click
- ✅ KYC verification process with document upload
- ✅ Trial period (5 free tasks) then subscription required
- ✅ Rate and review task owners after completion
- ✅ Track earnings and completed tasks

### 👨‍💼 For Admins

- ✅ Review helper applications with KYC documents
- ✅ Approve/reject helper status
- ✅ View all helpers (pending, approved, rejected)
- ✅ Access KYC documents for verification
- ✅ System-wide oversight

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v6
- **UI Components:** Custom components with Shadcn/ui
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **HTTP Client:** Fetch API
- **State Management:** React Hooks
- **Deployment:** Vercel

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** Bcrypt
- **File Upload:** Multer + Cloudinary
- **Email Service:** Nodemailer (Gmail SMTP)
- **Payment Gateway:** Razorpay
- **Security:** Helmet, CORS, Rate Limiting
- **Deployment:** Render

### DevOps & Tools
- **Version Control:** Git & GitHub
- **CI/CD:** Automatic deployment via GitHub integration
- **Cloud Storage:** Cloudinary
- **Email Service:** Gmail SMTP
- **Database Hosting:** MongoDB Atlas

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│                   https://getitdone.amjad.biz               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  User    │  │  Helper  │  │  Admin   │  │  Auth    │   │
│  │Dashboard │  │Dashboard │  │Dashboard │  │  Pages   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │ REST API
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Express.js)                      │
│       https://getitdone-backend-afcc.onrender.com           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Auth    │  │  Tasks   │  │  Admin   │  │ Helpers  │   │
│  │  Routes  │  │  Routes  │  │  Routes  │  │  Routes  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                          │                                   │
│  ┌──────────────────────┼────────────────────┐             │
│  │     Middleware        │   Email Service    │             │
│  │  • Auth              │   • Nodemailer     │             │
│  │  • Rate Limiting     │   • Templates      │             │
│  │  • CORS              │                    │             │
│  └──────────────────────┴────────────────────┘             │
└─────────────────────────┬───────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌───────────────┐  ┌──────────┐  ┌──────────────┐
│   MongoDB     │  │Cloudinary│  │   Razorpay   │
│    Atlas      │  │  (Files) │  │  (Payments)  │
└───────────────┘  └──────────┘  └──────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account
- Cloudinary account
- Gmail account (for SMTP)
- Razorpay account (optional, for payments)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/prabhavalayam-02/getitdone.git
cd getitdone
```

2. **Install Backend Dependencies**
```bash
cd getitdone-backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../getitdone-frontend
npm install
```

4. **Set up Environment Variables**

Create `.env` files in both backend and frontend directories (see [Environment Variables](#-environment-variables) section)

5. **Start Development Servers**

**Backend:**
```bash
cd getitdone-backend
npm start
```
Backend runs on `http://localhost:5000`

**Frontend:**
```bash
cd getitdone-frontend
npm run dev
```
Frontend runs on `http://localhost:8080`

---

## 🔐 Environment Variables

### Backend (.env)

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/getitdone
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development

# Cloudinary (File Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Razorpay (Optional)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:8080
```

### Frontend (.env)

```env
# API Base URL
VITE_API_BASE_URL=http://localhost:5000

# App Configuration
VITE_APP_NAME=GetItDone
VITE_APP_URL=http://localhost:8080
```

### Production Environment Variables

**Render (Backend):**
- Set all backend environment variables
- Change `FRONTEND_URL` to your production domain
- Set `NODE_ENV=production`

**Vercel (Frontend):**
- Set `VITE_API_BASE_URL` to your production backend URL
- Set `VITE_APP_URL` to your production frontend URL

---

## 📦 Deployment

### Backend Deployment (Render)

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `cd getitdone-backend && npm install`
4. Set start command: `cd getitdone-backend && npm start`
5. Add all environment variables from Backend .env
6. Deploy!

### Frontend Deployment (Vercel)

1. Connect your GitHub repository to Vercel
2. Set root directory to `getitdone-frontend`
3. Framework preset: Vite
4. Add environment variables from Frontend .env
5. Deploy!

### Custom Domain Setup

- **Frontend:** Configure in Vercel DNS settings
- **Backend:** Configure in Render custom domain settings
- **CORS:** Backend is configured to accept requests from production domain

---

## 📡 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register          Register new user/helper
POST   /api/auth/login             Login user
GET    /api/auth/verify            Verify JWT token
GET    /api/auth/profile           Get user profile
PUT    /api/auth/profile/update    Update profile
```

### Task Endpoints

```
GET    /api/tasks                  Get all tasks (with filters)
GET    /api/tasks/:id              Get task by ID
POST   /api/tasks                  Create new task
PUT    /api/tasks/:id              Update task
DELETE /api/tasks/:id              Delete task
GET    /api/tasks/my-tasks         Get user's tasks
GET    /api/tasks/available        Get available tasks (for helpers)

POST   /api/tasks/:id/accept       Helper accepts task
POST   /api/tasks/:id/complete     Helper completes task
POST   /api/tasks/:id/approve-helper    Tasker approves helper
POST   /api/tasks/:id/reject-helper     Tasker rejects helper
POST   /api/tasks/:id/rate         Tasker rates helper
POST   /api/tasks/:id/rate-tasker  Helper rates tasker
```

### Admin Endpoints

```
GET    /api/admin/helpers          Get all helpers
GET    /api/admin/helpers/pending  Get pending applications
POST   /api/admin/helpers/:id/approve   Approve helper
POST   /api/admin/helpers/:id/reject    Reject helper
```

### Helper Endpoints

```
GET    /api/helpers/tasks          Get helper's tasks
PATCH  /api/helpers/:id/kyc        Upload KYC documents
```

### Review Endpoints

```
GET    /api/reviews/helper/:id     Get helper reviews
GET    /api/reviews/tasker/:id     Get tasker reviews
```

### Subscription Endpoints

```
GET    /api/subscription/status    Get subscription status
POST   /api/subscription/create-order    Create Razorpay order
POST   /api/subscription/verify-payment  Verify payment
```

---

## 👥 User Roles

### 1. Regular User (Task Creator)
- Create tasks with details (title, description, budget, location, date)
- Receive applications from helpers
- View helper profiles and reviews
- Approve or reject helper requests
- Rate and review helpers after task completion

### 2. Helper (Service Provider)
- Browse and filter available tasks
- View tasker profiles before accepting
- Accept tasks and complete them
- Upload KYC documents for verification
- Manage subscription (trial → paid)
- Rate and review task owners

### 3. Admin
- Review and approve/reject helper applications
- View KYC documents
- Manage system users
- Monitor platform activity

---

## 📸 Screenshots

### User Dashboard
Task creators can manage their tasks, view applications, and track completed work.

### Helper Dashboard
Helpers can browse available tasks, view earnings, and manage their profile.

### Admin Dashboard
Admins can review helper applications with KYC documents and manage approvals.

### Rating System
Two-way rating system ensures accountability and builds trust.

### Profile Pages
Detailed profile pages showing ratings, reviews, and completed tasks.

---

## 🔄 Workflow

### Task Creation Flow
1. User creates a task with details
2. Task appears in "Available Tasks" for helpers
3. Helper views tasker profile and reviews
4. Helper accepts the task
5. Task status changes to "Pending Approval"
6. Email sent to tasker with helper info

### Task Approval Flow
1. Tasker receives email with helper details
2. Tasker views helper profile and reviews
3. Tasker approves or rejects helper
4. If approved: Task status → "In Progress"
5. Email sent to helper with tasker contact info

### Task Completion Flow
1. Helper marks task as complete
2. Task status changes to "Completed"
3. Both tasker and helper receive emails
4. Both can rate and review each other
5. Ratings update user profiles

---

## 🎨 Key Features Explained

### Two-Way Rating System
- **Taskers rate helpers:** Helps other taskers find reliable helpers
- **Helpers rate taskers:** Helps helpers choose good task owners
- Ratings are visible on profile pages
- Review history shows all past feedback

### KYC Verification
- Helpers must upload identity documents
- Admins review and verify documents
- Only approved helpers can accept tasks
- Builds trust and safety

### Email Notifications
All critical actions trigger emails:
- Task accepted by helper
- Helper approved/rejected by tasker
- Task completed
- All emails include actionable links
- Production emails use custom domain links

### Subscription Model
- **Trial:** 5 free tasks for new helpers
- **After trial:** Subscription required
- Monthly and yearly plans available
- Integrated with Razorpay

---

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting on API endpoints
- Helmet.js for security headers
- Input validation and sanitization
- Secure file upload with size limits
- Environment variable protection

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Amjad**
- Website: [getitdone.amjad.biz](https://getitdone.amjad.biz)
- GitHub: [@prabhavalayam-02](https://github.com/prabhavalayam-02)

---

## 🙏 Acknowledgments

- React and Vite communities
- Express.js team
- MongoDB Atlas
- Cloudinary for file hosting
- Vercel and Render for hosting
- All open-source contributors

---

## 📞 Support

For support, email prabhavalayam@gmail.com or create an issue in the GitHub repository.

---

## 🗺️ Roadmap

- [ ] Real-time chat between taskers and helpers
- [ ] Mobile app (React Native)
- [ ] Advanced search with filters
- [ ] Task categories with specialized helpers
- [ ] In-app payment processing
- [ ] Helper badges and achievements
- [ ] Task scheduling and reminders
- [ ] Multi-language support
- [ ] Analytics dashboard for users

---

## 📊 Project Stats

- **Lines of Code:** 15,000+
- **Components:** 50+
- **API Endpoints:** 30+
- **Features:** 40+
- **Development Time:** Active development

---

<div align="center">

**Made with ❤️ by Amjad**

⭐ Star this repo if you found it helpful!

</div>
