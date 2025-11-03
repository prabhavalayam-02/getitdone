# 🚀 GetItDone - Quick Start Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (already configured)
- Gmail account (for email notifications)
- Razorpay account (for payments)

---

## ⚡ Quick Setup (5 Minutes)

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd getitdone-backend
npm install

# Install frontend dependencies (if needed)
cd ../getitdone-frontend
npm install
```

### Step 2: Configure Email Notifications

1. Go to your Google Account: https://myaccount.google.com/
2. Enable 2-Factor Authentication
3. Generate App Password:
   - Visit: https://myaccount.google.com/apppasswords
   - Select app: "Mail"
   - Select device: "Other" (name it "GetItDone")
   - Copy the 16-character password

4. Update `.env` in `getitdone-backend`:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # Your app password
```

### Step 3: Configure Razorpay (Payment Gateway)

1. Sign up at: https://razorpay.com/
2. Go to Settings → API Keys
3. Generate Test API Keys (for development)
4. Copy Key ID and Key Secret

5. Update `.env` in `getitdone-backend`:
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxx
```

6. Update `SubscriptionPage.tsx` (line 75):
```typescript
key: 'rzp_test_xxxxxxxxxxxxx', // Your Razorpay Key ID
```

### Step 4: Start the Application

```bash
# Terminal 1 - Start Backend
cd getitdone-backend
npm run dev

# Terminal 2 - Start Frontend
cd getitdone-frontend
npm run dev
```

### Step 5: Test the Application

1. **Open**: http://localhost:5173
2. **Sign up** as a new user
3. **Create a task** (as user/tasker)
4. **Apply as helper** (upload KYC docs)
5. **Approve helper** (use admin account)
6. **Accept task** (as helper - uses free trial)
7. **Complete task** (check your email!)
8. **Rate helper** (as tasker)

---

## 🎯 Feature Testing Guide

### Test Email Notifications:
1. Accept a task as helper
2. Check tasker's email inbox
3. Complete the task
4. Check tasker's email again for completion notification

### Test Free Trial:
1. Register as helper
2. Get approved by admin
3. Accept and complete 5 tasks
4. Try accepting 6th task → Should prompt for subscription

### Test Subscription:
1. Go to `/helper/subscription`
2. Click "Subscribe Monthly" or "Subscribe Yearly"
3. Use Razorpay test card: `4111 1111 1111 1111`
4. CVV: Any 3 digits, Expiry: Any future date
5. Complete payment
6. Should now be able to accept unlimited tasks

### Test Rating System:
1. Complete a task as helper
2. Login as the tasker who created the task
3. Go to "My Tasks"
4. Find the completed task
5. Click "Rate" button (if visible)
6. Give 1-5 stars and optional review
7. Check helper's profile - rating should update

### Test Location Filtering:
1. Create tasks in different locations
2. Go to `/helper/available-tasks`
3. Use location dropdown filter
4. Should see only tasks from selected location

### Test Mobile View:
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device (iPhone, Pixel, etc.)
4. Check hamburger menu appears
5. Test all navigation items work
6. Verify logout button is present

---

## 🔑 Test Accounts

### Admin Account (Already Created):
- Email: `admin@test.com`
- Password: `admin123`

Create these for testing:

### Test User (Tasker):
- Sign up normally through UI
- Role: User

### Test Helper:
- Sign up normally through UI
- Upload KYC docs
- Approve using admin account
- Role: Helper

---

## 📧 Razorpay Test Cards

### Successful Payment:
```
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
```

### Failed Payment:
```
Card Number: 4000 0000 0000 0002
CVV: Any 3 digits
Expiry: Any future date
```

---

## 🐛 Troubleshooting

### Email Not Sending:
- Check `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`
- Ensure 2FA is enabled on Gmail
- Use App Password, not regular password
- Check backend console for error messages

### Payment Not Working:
- Verify Razorpay credentials in `.env`
- Update Razorpay Key ID in `SubscriptionPage.tsx`
- Use test card numbers provided above
- Check browser console for errors

### Subscription Not Working:
- Check MongoDB connection
- Verify user has helper role
- Check backend console for API errors
- Clear browser cache and localStorage

### Mobile Menu Not Working:
- Clear browser cache
- Check if running latest code
- Try different mobile device size
- Check browser console for errors

---

## 📂 Important Files

### Backend:
- `models/User.js` - User schema with subscription fields
- `models/Task.js` - Task schema with rating fields
- `routes/tasks.js` - Task endpoints with email notifications
- `routes/subscription.js` - Payment and subscription endpoints
- `utils/emailService.js` - Email notification functions
- `.env` - Environment variables (DON'T COMMIT!)

### Frontend:
- `pages/helper/SubscriptionPage.tsx` - Subscription UI
- `pages/user/MyTasksPage.tsx` - Rating functionality
- `components/layout/Navbar.tsx` - Mobile responsive navbar
- `components/ui/RatingDialog.tsx` - Rating dialog component

---

## 🔄 Currency Note

All amounts are now in **Indian Rupees (₹)**:
- Monthly Subscription: ₹499
- Yearly Subscription: ₹4,999
- Task budgets display in ₹
- Earnings display in ₹

---

## 📞 Need Help?

### Check These First:
1. Are both backend and frontend running?
2. Is MongoDB connected? (Check backend console)
3. Are environment variables set correctly?
4. Did you install all dependencies?

### Common Commands:
```bash
# Check backend logs
cd getitdone-backend
npm run dev

# Check frontend logs
cd getitdone-frontend
npm run dev

# Reinstall dependencies
npm install

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## ✅ Success Indicators

You'll know everything is working when:
- ✅ Backend shows "Connected to MongoDB Atlas"
- ✅ Frontend loads at http://localhost:5173
- ✅ Can create and accept tasks
- ✅ Emails arrive in inbox
- ✅ Payment flow completes successfully
- ✅ Mobile menu works smoothly
- ✅ Location filtering works
- ✅ Rating system functions properly

---

## 🎉 You're All Set!

The application is now production-ready with:
- Real MongoDB data integration
- Email notifications
- Payment gateway
- Free trial system
- Rating & review system
- Mobile responsive design
- Location-based filtering
- INR currency support

**Enjoy building with GetItDone!** 🚀
