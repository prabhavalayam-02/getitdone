# GetItDone - Task Management Platform

A full-stack task management platform connecting users who need help with helpers who can complete tasks.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication for users, helpers, and admins
- **Task Management**: Create, view, accept, and complete tasks
- **Role-Based Access**: Different dashboards for users, helpers, and administrators
- **Real-time Updates**: Track task status from creation to completion
- **Helper Approval System**: Admin approval workflow for helpers
- **MongoDB Integration**: Persistent data storage with MongoDB Atlas

## 📁 Project Structure

```
getitdone/
├── getitdone-backend/          # Express.js backend
│   ├── config/                 # Configuration files
│   ├── middleware/             # Authentication & validation middleware
│   ├── models/                 # Mongoose models
│   ├── routes/                 # API routes
│   ├── .env                    # Environment variables
│   └── server.js               # Entry point
│
└── getitdone-frontend/         # React + TypeScript frontend
    ├── src/
    │   ├── components/         # Reusable UI components
    │   ├── pages/              # Page components
    │   ├── lib/                # API client & utilities
    │   └── hooks/              # Custom React hooks
    └── .env                    # Frontend environment variables
```

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - File uploads (KYC documents)
- **Helmet** & **CORS** - Security

### Frontend
- **React** + **TypeScript** - UI framework
- **React Router** - Navigation
- **TailwindCSS** - Styling
- **shadcn/ui** - Component library
- **Vite** - Build tool

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd getitdone-backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/getitdone?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
NODE_ENV=development
```

4. Start the backend server:
```bash
npm start         # Production
# or
npm run dev       # Development with nodemon
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd getitdone-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user/helper
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - Get all tasks (with filters)
- `GET /api/tasks/my-tasks` - Get user's created tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `POST /api/tasks/:id/accept` - Accept task (helper only)
- `POST /api/tasks/:id/start` - Start task (helper only)
- `POST /api/tasks/:id/complete` - Complete task (helper only)
- `DELETE /api/tasks/:id` - Delete task

### Admin
- `GET /api/admin/helpers` - Get helpers (with status filter)
- `POST /api/admin/helpers/:id/approve` - Approve helper
- `POST /api/admin/helpers/:id/reject` - Reject helper

## 👥 User Roles

### User
- Create tasks
- View own tasks
- Track task progress
- Delete own tasks

### Helper
- View available tasks
- Accept open tasks
- Start accepted tasks
- Complete in-progress tasks
- Must be approved by admin

### Admin
- View all users and tasks
- Approve/reject helper applications
- Delete any task
- Full platform access

## 🔐 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting on API routes
- CORS configuration
- Helmet for HTTP headers
- Input validation
- Role-based access control

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Set environment variables on hosting platform
2. Deploy from repository
3. Ensure MongoDB connection string is correct

### Frontend Deployment (Vercel/Netlify)

1. Update `VITE_API_BASE_URL` to production backend URL
2. Build the project: `npm run build`
3. Deploy the `dist` folder

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (.env)
```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify MONGO_URI format
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### CORS Errors
- Update CORS origin in backend server.js
- Ensure credentials are properly configured
- Check if FRONTEND_URL matches your domain

### Authentication Issues
- Verify JWT_SECRET is set
- Check token expiration (default 1h)
- Clear localStorage and login again

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please create an issue in the repository.
