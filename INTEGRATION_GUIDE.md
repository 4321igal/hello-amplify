# Backend Integration with AWS Amplify

## 🎯 Overview
This guide explains how to:
1. Run the Node.js backend locally
2. Connect it to the frontend
3. Deploy to AWS with Amplify services

## 📦 Part 1: Local Development Setup

### Backend (Node.js/Express) 
```bash
cd C:\programming\SmartNodejs\SmartNodejs_rest-api_swagger
npm install
npm start  # Runs on port 3000
```

### Frontend (Vite/React)
```bash
cd C:\programming\SmartAI\hello-amplify
npm install
npm run dev  # Runs on port 5173
```

### How They Connect (Local Dev)
```
Browser (localhost:5173)
    ↓
React Components
    ↓
apiService (src/services/api.ts)
    ↓
Backend API (localhost:3000)
    ↓
Express Routes → Controllers → Services
```

---

## 🏗️ Part 2: Architecture Changes

### Before (REST API)
```
apiService → fetch('http://localhost:3000/api/products')
```

### After (GraphQL + Amplify)
```
apiService → generateClient().graphql(query)
           → AWS AppSync (in cloud)
           → Lambda Functions
           → DynamoDB / RDS
```

---

## 🔌 Part 3: Hybrid Approach (Recommended)

Keep backend running locally while migrating piece by piece:

### Option A: Keep Current Backend (Fast)
```
Frontend
├── api.ts (as-is, fetching from localhost:3000)
└── No Amplify needed yet
```

### Option B: Amplify Data Only
```
Frontend
├── api.ts (using GraphQL)
└── Backend can be Express OR AppSync
```

### Option C: Full Amplify Stack (Production)
```
Frontend
├── api.ts (GraphQL)
├── Auth (Cognito)
├── Storage (S3)
└── Functions (Lambda)
```

---

## 🚀 Part 4: Current State

### Files Updated:
✅ `src/services/api.ts` - GraphQL queries (ready)
✅ `amplify/data/schema.graphql` - GraphQL schema (ready)
✅ `src/config/amplifySetup.ts` - Amplify initialization
✅ `src/config/amplifyConfig.ts` - Configuration
✅ `.env.local` - Environment variables

### What's Missing:
- [ ] Backend controllers updated for GraphQL
- [ ] Lambda functions for `runAIAnalysis` and `importCSV`
- [ ] DynamoDB tables
- [ ] Cognito User Pool setup

---

## 🔧 Part 5: Quick Fix (If Backend Stays)

If you want to keep using the Express backend AS-IS:

### Revert api.ts to REST:
```typescript
import axios from 'axios';

export const apiService = {
  async getProducts(): Promise<Product[]> {
    const res = await axios.get('http://localhost:3000/api/products');
    return res.data;
  },
  // ... rest of methods
};
```

### Keep .env.local:
```
VITE_API_BASE_URL=http://localhost:3000
```

---

## 📡 Part 6: When Ready for Cloud

### Deploy to AWS:
```bash
amplify init
amplify add api (select GraphQL)
amplify add auth
amplify add storage
amplify add function
amplify publish
```

### Update Configuration:
1. Create AWS account
2. Setup Cognito User Pool
3. Setup AppSync API
4. Deploy Lambda functions
5. Update `.env.production`

---

## 📋 Next Steps

**Choose One:**

### ✅ Option 1: Keep Backend (Easiest)
1. Revert api.ts to REST calls
2. Backend stays on port 3000
3. Deploy when both parts are ready

### ✅ Option 2: Full Amplify (Recommended)
1. Create AWS account
2. Run `amplify init`
3. Setup Cognito
4. Migrate API routes to Lambda
5. Deploy AppSync

### ✅ Option 3: Hybrid (Recommended for Now)
1. Keep backend running
2. Use current api.ts
3. Gradually migrate to Amplify

---

## 💾 Environment Variables

Create `.env.production` for cloud:
```
VITE_API_BASE_URL=https://your-amplify-backend.xyz
REACT_APP_APPSYNC_ENDPOINT=https://your-api.appsync-api.region.amazonaws.com/graphql
REACT_APP_USER_POOL_ID=your-pool-id
REACT_APP_USER_POOL_CLIENT_ID=your-client-id
REACT_APP_STORAGE_BUCKET=your-s3-bucket
```

---

## 🎬 Summary

| Aspect | Local Dev | Production |
|--------|-----------|------------|
| Frontend | `npm run dev` on 5173 | Amplify Hosting |
| Backend | Express on 3000 | Lambda + AppSync |
| Auth | None | Cognito |
| Database | In-Memory | DynamoDB |
| Storage | Local | S3 |
| Deployment | Manual | Amplify CLI |

