# 🔐 Credentials Needed for Production

## ⚠️ IMPORTANT: You Need to Provide These

The following credentials need to be configured before the application can work fully:

---

## 1. 📧 Email Configuration (Gmail)

### What You Need:
- Your Gmail address
- Gmail App Password (16-character code)

### How to Get Gmail App Password:

#### Step 1: Enable 2-Factor Authentication
1. Go to: https://myaccount.google.com/security
2. Find "2-Step Verification" section
3. Click "Get Started" and follow the prompts
4. Set up with your phone number

#### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. You may need to sign in again
3. Under "Select app" → Choose "Mail"
4. Under "Select device" → Choose "Other (Custom name)"
5. Type: "GetItDone Backend"
6. Click "Generate"
7. **Copy the 16-character password** (format: xxxx xxxx xxxx xxxx)

#### Step 3: Update .env File
Open `getitdone-backend/.env` and update:
```env
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

**Example:**
```env
EMAIL_USER=johndoe@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

---

## 2. 💳 Razorpay Payment Gateway

### What You Need:
- Razorpay Key ID
- Razorpay Key Secret

### How to Get Razorpay Credentials:

#### Step 1: Create Account
1. Go to: https://razorpay.com/
2. Click "Sign Up"
3. Fill in business details
4. Complete verification (may take 1-2 hours)

#### Step 2: Get Test API Keys
1. Login to Razorpay Dashboard
2. Go to: Settings → API Keys
3. Click "Generate Test Keys"
4. **Copy Key ID** (starts with `rzp_test_`)
5. **Copy Key Secret** (longer alphanumeric string)

#### Step 3: Update Backend .env
Open `getitdone-backend/.env` and update:
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxx
```

**Example:**
```env
RAZORPAY_KEY_ID=rzp_test_1A2B3C4D5E6F7G
RAZORPAY_KEY_SECRET=8H9I0J1K2L3M4N5O6P7Q8R
```

#### Step 4: Update Frontend Code
Open `getitdone-frontend/src/pages/helper/SubscriptionPage.tsx`

Find line 75 and update:
```typescript
key: 'rzp_test_xxxxxxxxxxxxx', // Replace with your Key ID
```

---

## 3. 🌐 Frontend URL Configuration

### What You Need:
- Your frontend URL (default: http://localhost:5173)

### Update Backend .env:
```env
FRONTEND_URL=http://localhost:5173
```

**For Production:**
```env
FRONTEND_URL=https://your-domain.com
```

---

## 📋 Complete .env File Template

Copy this template to `getitdone-backend/.env`:

```env
# MongoDB (Already Configured)
PORT=5000
MONGO_URI=mongodb+srv://aura_db_user:Aura2025@cluster0.0grinhj.mongodb.net/getitdone?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=supersecretkey123

# Cloudinary (Already Configured)
CLOUDINARY_CLOUD_NAME=dy7qmvpvm
CLOUDINARY_API_KEY=938898322935531
CLOUDINARY_API_SECRET=MMBgUntLG5F-p-xSWlbt-ePwcDg

# Email Configuration (YOU NEED TO FILL THIS)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Razorpay Configuration (YOU NEED TO FILL THIS)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

---

## ✅ Verification Checklist

Before starting the application, verify:

### Email Setup:
- [ ] 2-Factor Authentication enabled on Gmail
- [ ] App Password generated (16 characters)
- [ ] EMAIL_USER updated in .env
- [ ] EMAIL_PASSWORD updated in .env
- [ ] No spaces in email credentials

### Razorpay Setup:
- [ ] Razorpay account created and verified
- [ ] Test API keys generated
- [ ] RAZORPAY_KEY_ID updated in .env
- [ ] RAZORPAY_KEY_SECRET updated in .env
- [ ] Key ID updated in SubscriptionPage.tsx (line 75)

### Testing:
- [ ] Backend starts without errors
- [ ] Can send test email
- [ ] Can process test payment
- [ ] Subscription page loads correctly

---

## 🧪 Test Your Configuration

### Test Email:
After setting up, test email by:
1. Starting backend: `npm run dev`
2. Accepting a task as helper
3. Check if tasker receives email
4. If email doesn't arrive, check backend console for errors

### Test Razorpay:
After setting up, test payment by:
1. Go to `/helper/subscription`
2. Click "Subscribe Monthly"
3. Use test card: 4111 1111 1111 1111
4. Complete payment
5. Check if subscription activates

---

## 🚨 Security Notes

### DO NOT:
- ❌ Commit .env file to Git
- ❌ Share credentials publicly
- ❌ Use production keys in development
- ❌ Hardcode credentials in code

### DO:
- ✅ Keep .env file private
- ✅ Use test keys for development
- ✅ Switch to live keys only for production
- ✅ Rotate keys regularly
- ✅ Use different credentials per environment

---

## 📞 Getting Help

### Email Issues:
If emails aren't sending:
1. Verify 2FA is enabled
2. Generate new App Password
3. Remove any spaces from password
4. Try with different Gmail account
5. Check Gmail security settings

### Razorpay Issues:
If payments fail:
1. Verify test keys are active
2. Use correct test card numbers
3. Check Razorpay dashboard for logs
4. Enable test mode in dashboard
5. Contact Razorpay support if needed

---

## 🎯 Quick Test Command

Once you have all credentials set up, test with:

```bash
# Terminal 1 - Backend
cd getitdone-backend
npm run dev

# Terminal 2 - Frontend  
cd getitdone-frontend
npm run dev

# Open browser
# Go to: http://localhost:5173
# Test the features!
```

---

## ✨ What Happens After Setup

Once all credentials are configured:

1. **Email Notifications Work:**
   - Taskers get notified when helpers accept tasks
   - Taskers get notified when tasks are completed
   - Helpers get subscription reminders

2. **Payment System Works:**
   - Helpers can subscribe with credit/debit cards
   - Trial system tracks usage
   - Subscriptions activate automatically

3. **Full Production Ready:**
   - Real data from MongoDB
   - Professional email notifications
   - Secure payment processing
   - Mobile responsive design
   - Location-based filtering
   - Rating and review system

---

## 📊 Estimated Setup Time

- Email Configuration: ~5 minutes
- Razorpay Setup: ~15 minutes (including verification)
- Testing: ~10 minutes
- **Total: ~30 minutes**

---

**Remember:** You only need to do this setup once. After that, the application is fully functional and production-ready! 🚀
