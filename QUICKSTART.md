# GetItDone - Quick Start Guide

## 🚀 Running the Application Locally

### Step 1: Start the Backend Server

Open a terminal and run:

```bash
cd getitdone-backend
npm start
```

You should see:
```
✅ Connected to MongoDB Atlas
🚀 Server running on http://localhost:5000
```

### Step 2: Start the Frontend Server

Open a **NEW** terminal (keep backend running) and run:

```bash
cd getitdone-frontend
npm run dev
```

The frontend will be available at: **http://localhost:8080** (or the port shown in terminal)

### Step 3: Access the Application

Open your browser and go to: **http://localhost:8080**

## 👤 Test Users

You can create new accounts or use these test credentials (if created):

### User Account
- Email: `user@test.com`
- Password: `password`

### Helper Account
- Email: `helper@test.com`
- Password: `password`

### Admin Account
- Email: `admin@test.com`
- Password: `password`

## 📋 Testing the Full Flow

### As a User:
1. **Sign Up**: Go to signup page, select "User" role
2. **Login**: Use your credentials to login
3. **Create Task**: 
   - Click "Create Task" button
   - Fill in: Title, Description, Category, Location, Budget
   - Click "Post Task"
4. **View My Tasks**: Check the "My Tasks" page to see your created tasks
5. **Track Progress**: Watch as helpers accept and complete your tasks

### As a Helper:
1. **Sign Up**: Go to signup page, select "Helper" role
2. **Wait for Approval**: Your account will be "pending" initially
3. **Get Approved**: Admin must approve your account
4. **View Available Tasks**: Browse open tasks
5. **Accept Task**: Click "Accept" on any open task
6. **Start Task**: Begin working on accepted task
7. **Complete Task**: Mark task as completed when done

### As an Admin:
1. **Login**: Use admin credentials
2. **Approve Helpers**: Go to admin dashboard
3. **View Pending Helpers**: See helper applications
4. **Approve/Reject**: Manage helper approvals
5. **Monitor Platform**: View all tasks and users

## 🔧 Common Issues & Solutions

### Backend Won't Start
- **Check MongoDB Connection**: Verify MONGO_URI in `.env`
- **Port Already in Use**: Change PORT in `.env` or kill process on port 5000
- **Missing Dependencies**: Run `npm install` in backend folder

### Frontend Won't Start
- **Check Backend URL**: Verify VITE_API_BASE_URL in `.env` matches backend
- **Port Already in Use**: Vite will automatically use next available port
- **Missing Dependencies**: Run `npm install` in frontend folder

### Can't Login/Signup
- **CORS Error**: Check browser console, verify CORS settings in backend
- **Network Error**: Ensure backend is running on port 5000
- **Invalid Credentials**: Check error message, ensure email/password are correct

### Tasks Not Showing
- **Not Logged In**: Verify JWT token in localStorage
- **Empty Database**: Create some tasks first
- **Wrong Filter**: Check status filters in UI

### Helper Can't Accept Tasks
- **Pending Status**: Wait for admin approval
- **Already Accepted**: Task may have been accepted by another helper
- **Not Logged In**: Ensure you're logged in as helper

## 📊 Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: String,
  role: 'user' | 'helper' | 'admin',
  helperStatus: 'pending' | 'approved' | 'rejected'
}
```

### Tasks Collection
```javascript
{
  title: String,
  description: String,
  category: String,
  location: String,
  date: Date,
  budget: Number,
  status: 'open' | 'accepted' | 'in-progress' | 'completed' | 'cancelled',
  createdBy: ObjectId (ref: User),
  acceptedBy: ObjectId (ref: User)
}
```

## 🎯 Features Checklist

- ✅ User authentication (JWT)
- ✅ Role-based access control
- ✅ Task creation and management
- ✅ Task acceptance by helpers
- ✅ Task status tracking
- ✅ Helper approval workflow
- ✅ Admin dashboard
- ✅ Real-time task filtering
- ✅ Responsive UI with TailwindCSS
- ✅ MongoDB data persistence
- ✅ Secure password hashing
- ✅ CORS configuration
- ✅ Error handling
- ✅ Production-ready setup

## 🌐 Production Deployment Checklist

### Backend
- [ ] Set `NODE_ENV=production` in environment variables
- [ ] Set strong `JWT_SECRET`
- [ ] Configure `FRONTEND_URL` to production domain
- [ ] Whitelist IP in MongoDB Atlas
- [ ] Enable HTTPS
- [ ] Configure logging service
- [ ] Set up monitoring (e.g., PM2, monitoring tools)

### Frontend
- [ ] Update `VITE_API_BASE_URL` to production backend URL
- [ ] Build project: `npm run build`
- [ ] Deploy `dist` folder
- [ ] Configure custom domain
- [ ] Enable HTTPS
- [ ] Set up CDN (optional)

## 📞 Need Help?

- Check the main README.md for detailed documentation
- Review API endpoints documentation
- Check browser console for error messages
- Verify MongoDB connection string
- Ensure all environment variables are set correctly

---

**Happy Task Managing! 🎉**
