# Production Deployment Troubleshooting Guide

## 🚨 Issue: "Failed to create account" in Production

Based on your registration API analysis, here are the most likely causes and solutions:

## 🔍 Probable Causes

### 1. **Environment Variables Missing in Production** (Most Likely)
Your production platform needs these environment variables:
```
DATABASE_URL=postgresql://neondb_owner:npg_4b5EuQdYBLtN@ep-rough-queen-ade18az9-pooler.c-2.us-east-1.aws.neon.tech/storeapp?sslmode=require
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-production-domain.com
```

### 2. **Database Connection Issues**
- SSL certificate problems with Neon database
- Connection pool limits reached
- Database server unreachable from production

### 3. **Database Schema Not Initialized**
- `users` table might not exist in production database
- Missing required columns or constraints

## 🛠️ Solutions by Platform

### If using **Vercel**:
```bash
# Set environment variables in Vercel dashboard or via CLI
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET  
vercel env add NEXTAUTH_URL

# Then redeploy
vercel --prod
```

### If using **Netlify**:
```bash
# Set in Netlify dashboard: Site settings → Environment variables
# Or via CLI
netlify env:set DATABASE_URL "your-database-url"
netlify env:set NEXTAUTH_SECRET "your-secret"
netlify env:set NEXTAUTH_URL "your-site-url"
```

### If using **Railway**:
```bash
# Set in Railway dashboard or via CLI
railway variables set DATABASE_URL="your-database-url"
railway variables set NEXTAUTH_SECRET="your-secret"
railway variables set NEXTAUTH_URL="your-site-url"
```

## 🔧 Database Initialization

Your production database needs this table structure:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer',
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

## 🧪 Testing Steps

### 1. **Check Environment Variables**
In your production platform dashboard, verify all three variables are set correctly.

### 2. **Test Database Connection**
Run this in your production environment or local terminal:
```bash
node check-deployment.js
```

### 3. **Check Production Logs**
Look for specific error messages in your deployment platform's logs:
- "connect ENOTFOUND" = Database URL wrong
- "connect ECONNREFUSED" = Database server down
- "authentication failed" = Wrong credentials
- "relation 'users' does not exist" = Missing table

### 4. **Manual Database Check**
Connect directly to your Neon database:
```bash
psql "postgresql://neondb_owner:npg_4b5EuQdYBLtN@ep-rough-queen-ade18az9-pooler.c-2.us-east-1.aws.neon.tech/storeapp?sslmode=require"

# Then check if table exists:
\dt
SELECT * FROM users LIMIT 1;
```

## 🚀 Quick Fix Checklist

1. **✅ Set Environment Variables in Production**
   - `DATABASE_URL` with your Neon connection string
   - `NEXTAUTH_SECRET` (generate with: `openssl rand -base64 32`)
   - `NEXTAUTH_URL` with your production domain

2. **✅ Initialize Database Schema**
   - Run the SQL table creation script above
   - Or use a migration tool to create tables

3. **✅ Test Connection**
   - Run the deployment check script
   - Check production logs for specific errors

4. **✅ Redeploy**
   - After setting environment variables
   - Force a new build if needed

## 📞 Next Steps

1. **Immediate**: Check if environment variables are set in your production platform
2. **Then**: Look at production deployment logs for specific error messages
3. **Finally**: Test the registration form again after fixing environment setup

The most common issue is missing `DATABASE_URL` in production - this would cause the exact "Failed to create account" error you're seeing.