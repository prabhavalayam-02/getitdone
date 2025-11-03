# 🚀 Production Deployment Guide

## Pre-Deployment Checklist

### Backend Configuration

1. **Environment Variables** (`.env` file):
```env
# Server
PORT=5000

# Database
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_secure_jwt_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

# Razorpay (optional)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# IMPORTANT: Frontend URL for email links
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend Configuration

1. **Environment Variables** (`.env` file):
```env
# Backend API URL
VITE_API_BASE_URL=https://your-backend-domain.com

# App configuration
VITE_APP_NAME=GetItDone
VITE_APP_URL=https://your-frontend-domain.com
```

---

## Email Service Configuration

### Issue: Email Links Pointing to Localhost

**Problem**: Email buttons (Approve/Reject/Rate) redirect to localhost instead of production URL.

**Solution**: Update `FRONTEND_URL` in backend `.env`:

```env
# Backend .env
FRONTEND_URL=https://getitdone.amjad.biz  # Your actual domain
```

**Email Service Files**:
- `getitdone-backend/utils/emailService.js`
- Uses `process.env.FRONTEND_URL` for all email links
- Defaults to `http://localhost:8080` if not set

**Links Generated**:
- Approve Helper: `${FRONTEND_URL}/user/approve-helper/:taskId`
- Reject Helper: `${FRONTEND_URL}/user/reject-helper/:taskId`
- Rate Task: `${FRONTEND_URL}/user/rate-task/:taskId`

---

## Common Production Issues & Fixes

### 1. Task Creator Name Not Showing

**Issue**: Task card shows ID instead of user name in "created by" field.

**Cause**: Backend not populating `createdBy` field properly.

**Fix**: ✅ Already fixed in `routes/tasks.js`:
```javascript
const tasks = await Task.find(filter)
  .populate("createdBy", "name email")  // ✅ Populates name and email
  .populate("acceptedBy", "name email")
  .sort({ createdAt: -1 });
```

**Frontend Check**: Ensure TaskCard component displays:
```typescript
task.createdBy?.name || 'Unknown User'
```

### 2. User Profile Not Fetching Data

**Issue**: User profile shows default values instead of real data.

**Cause**: API endpoint not returning data or frontend not updating state properly.

**Fix**: ✅ Already implemented in `UserProfilePage.tsx`:
```typescript
const fetchUserData = async () => {
  const token = localStorage.getItem('jwt');
  const response = await fetch(API_ENDPOINTS.users(userId), {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  // Updates state with real data
};
```

### 3. Email Not Sending in Production

**Possible Causes**:
1. **Gmail App Password Not Set**: Use Gmail App Password, not regular password
2. **Environment Variables Not Loaded**: Check if .env file is read properly
3. **SMTP Blocked**: Some hosting providers block port 587/465

**How to Generate Gmail App Password**:
1. Go to Google Account Settings
2. Security → 2-Step Verification (enable if not enabled)
3. App Passwords → Generate new
4. Copy 16-character password
5. Use in `EMAIL_PASSWORD` env variable (remove spaces)

**Test Email Service**:
```bash
cd getitdone-backend
node test-email.js
```

### 4. CORS Errors

**Issue**: Frontend can't connect to backend API.

**Fix**: Update backend `server.js`:
```javascript
app.use(cors({
  origin: [
    'http://localhost:8080',
    'https://getitdone.amjad.biz',  // Add your domain
    'https://your-frontend-domain.com'
  ],
  credentials: true
}));
```

### 5. MongoDB Connection Issues

**Check**:
- MongoDB Atlas IP Whitelist (allow 0.0.0.0/0 for all IPs or specific hosting IPs)
- Connection string is correct
- Database user has read/write permissions

---

## Deployment Steps

### Backend (Node.js)

**Option 1: Render**
1. Create new Web Service
2. Connect GitHub repo
3. Set Build Command: `npm install`
4. Set Start Command: `npm start`
5. Add environment variables
6. Deploy

**Option 2: Railway**
1. Connect GitHub repo
2. Add service → Backend
3. Configure environment variables
4. Deploy

**Option 3: Heroku**
```bash
heroku create your-app-name
heroku config:set MONGO_URI=your_connection_string
heroku config:set JWT_SECRET=your_secret
# ... set all env vars
git push heroku main
```

### Frontend (React + Vite)

**Option 1: Netlify**
1. Connect GitHub repo
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variable: `VITE_API_BASE_URL`
5. Deploy

**Option 2: Vercel**
1. Import project from GitHub
2. Framework Preset: Vite
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add environment variables
6. Deploy

**Option 3: Static Hosting (any)**
```bash
npm run build
# Upload 'dist' folder to your hosting
```

---

## Post-Deployment Checklist

### Backend
- [ ] MongoDB connection working
- [ ] All env variables set correctly
- [ ] `FRONTEND_URL` points to production domain
- [ ] Email service working (test with task acceptance)
- [ ] CORS configured for production domain
- [ ] API endpoints accessible

### Frontend
- [ ] `VITE_API_BASE_URL` set to backend URL
- [ ] App loads without errors
- [ ] Login/Signup working
- [ ] Task creation working
- [ ] Profile page loads with real data
- [ ] Task cards show creator names (not IDs)

### Email System
- [ ] Task acceptance email sends
- [ ] Approve/Reject buttons link to production URL
- [ ] Helper approval email sends
- [ ] Task completion email sends
- [ ] Rate task email link works

### Testing Flow
1. **Create Account** → Register as user
2. **Create Task** → Post a new task
3. **Switch to Helper** → Apply KYC, get approved
4. **Accept Task** → Check tasker receives email
5. **Email Links** → Click Approve button, should go to production URL
6. **Complete Task** → Check tasker receives completion email
7. **Rate Helper** → Click rate link in email

---

## Environment Variable Reference

### Backend Required:
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=supersecretkey
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
EMAIL_USER=your@gmail.com
EMAIL_PASSWORD=app_password_16_chars
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend Required:
```
VITE_API_BASE_URL=https://your-backend-domain.com
VITE_APP_NAME=GetItDone
VITE_APP_URL=https://your-frontend-domain.com
```

---

## Troubleshooting

### Email Links Still Going to Localhost

1. **Check Backend .env**:
```bash
cat .env | grep FRONTEND_URL
```
Should show: `FRONTEND_URL=https://your-production-domain.com`

2. **Restart Backend Server** (changes only apply after restart)

3. **Test Email Service**:
```bash
cd getitdone-backend
node test-email.js
```

### Profile Not Loading

1. **Check Network Tab**: Look for failed API calls
2. **Verify Token**: Check if JWT token in localStorage
3. **Check Backend Logs**: See if `/api/users/:id` endpoint is hit
4. **CORS**: Ensure frontend domain is in CORS whitelist

### Task Creator Showing ID

1. **Backend**: Verify `.populate("createdBy", "name email")` is used
2. **Frontend**: Check TaskCard uses `task.createdBy?.name`
3. **Data**: Verify users have `name` field in database

---

## Quick Fix Commands

### Update Frontend for Production:
```bash
cd getitdone-frontend
echo "VITE_API_BASE_URL=https://your-backend.com" > .env
npm run build
```

### Update Backend for Production:
```bash
cd getitdone-backend
echo "FRONTEND_URL=https://your-frontend.com" >> .env
npm start
```

### Test Email Service:
```bash
cd getitdone-backend
cat > test-email-quick.js << 'EOF'
require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER,
  subject: 'Test Email',
  html: `
    <h2>Email Service Test</h2>
    <p>FRONTEND_URL: ${process.env.FRONTEND_URL || 'NOT SET'}</p>
    <a href="${process.env.FRONTEND_URL}/test">Test Link</a>
  `,
}, (err, info) => {
  if (err) console.error('Error:', err);
  else console.log('Email sent!', info);
  process.exit(0);
});
EOF
node test-email-quick.js
```

---

## Your Current Setup

Based on your code:

**Frontend Domain**: `https://getitdone.amjad.biz`  
**Backend Domain**: `https://getitdone-backend-afcc.onrender.com`

### Required Changes:

1. **Backend `.env`**:
```env
FRONTEND_URL=https://getitdone.amjad.biz
```

2. **Frontend `.env`** (Production):
```env
VITE_API_BASE_URL=https://getitdone-backend-afcc.onrender.com
```

3. **Restart Both Servers** after changing env files

---

**Last Updated**: November 3, 2025  
**Status**: Production-Ready Configuration
