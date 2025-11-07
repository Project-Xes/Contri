# 🏗️ ContriBlock Architecture

This document provides a detailed overview of ContriBlock's system architecture, components, and data flow.

## 📊 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                    (React + TypeScript + Vite)                  │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Login/  │  │Dashboard │  │  Submit  │  │  Admin   │      │
│  │  Signup  │  │          │  │Contribut.│  │  Panel   │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND API LAYER                          │
│                      (Flask + Python)                           │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │   Auth   │  │   KYC    │  │Contribut.│  │Marketplac│      │
│  │   API    │  │   API    │  │   API    │  │   API    │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────────────────────┘
         │                │                │                │
         ▼                ▼                ▼                ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Database   │  │  Blockchain │  │    IPFS     │  │   EmailJS   │
│ (SQLAlchemy)│  │  (Ganache)  │  │  (Pinata)   │  │   (OTP)     │
│             │  │             │  │             │  │             │
│  - Users    │  │  - Smart    │  │  - File     │  │  - Email    │
│  - Contrib. │  │    Contract │  │    Storage  │  │    Verify   │
│  - KYC Docs │  │  - Tokens   │  │  - Metadata │  │             │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
```

## 🔄 Data Flow

### 1. User Registration & KYC Flow

```
User → Frontend → Backend API → Database
                      ↓
                   EmailJS → User Email (OTP)
                      ↓
User enters OTP → Backend verifies → KYC Status Updated
```

### 2. Contribution Submission Flow

```
User uploads file → Frontend
                      ↓
                   Backend API
                      ↓
              Saves to local storage
                      ↓
              Creates DB record (status: pending)
                      ↓
              Returns to user
```

### 3. Admin Approval Flow

```
Admin reviews → Approves contribution
                      ↓
                Backend API
                      ↓
        ┌─────────────┴─────────────┐
        ▼                           ▼
   Upload to IPFS              Blockchain
   (Pinata API)                (Smart Contract)
        │                           │
        ├─ Get IPFS Hash           ├─ Mint Tokens
        └─ Store metadata          └─ Transfer to User
                      ↓
              Update DB record
              (status: approved, ipfs_hash, tx_hash)
```

### 4. Marketplace Flow

```
User browses → Frontend requests → Backend API
                                      ↓
                              Query approved contributions
                                      ↓
                              Return with IPFS links
                                      ↓
User clicks → Redirect to IPFS gateway → View content
```

## 🗂️ Database Schema

### Users Table
```sql
users
├── id (PK)
├── username (unique)
├── email (unique)
├── password_hash
├── is_admin (boolean)
├── kyc_verified (boolean)
├── wallet_address
├── created_at
└── updated_at
```

### Contributions Table
```sql
contributions
├── id (PK)
├── user_id (FK → users.id)
├── title
├── description
├── file_path
├── file_type
├── status (pending/approved/rejected)
├── ipfs_hash
├── ipfs_url
├── transaction_hash
├── reward_amount
├── admin_feedback
├── created_at
└── updated_at
```

### KYC Documents Table
```sql
kyc_documents
├── id (PK)
├── user_id (FK → users.id)
├── document_type
├── document_path
├── status (pending/approved/rejected)
├── verified_at
├── admin_notes
├── created_at
└── updated_at
```

### Tokens Table (Optional)
```sql
tokens
├── id (PK)
├── user_id (FK → users.id)
├── token_type
├── balance
├── last_updated
└── created_at
```

## 🔐 Authentication Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    Authentication Process                     │
└──────────────────────────────────────────────────────────────┘

1. User Login
   ├─ User submits credentials
   ├─ Backend validates (bcrypt password check)
   ├─ Generate JWT token
   └─ Return token to frontend

2. Authenticated Requests
   ├─ Frontend includes JWT in Authorization header
   ├─ Backend validates JWT
   ├─ Extract user info from token
   └─ Process request

3. Token Refresh (if implemented)
   ├─ Token expires
   ├─ Frontend requests new token
   ├─ Backend validates refresh token
   └─ Issue new access token
```

## 🔗 Blockchain Integration

### Smart Contract Structure

```solidity
contract ContriBlockToken {
    // Token details
    string public name = "ContriBlock Token";
    string public symbol = "CBT";
    
    // Balances
    mapping(address => uint256) public balances;
    
    // Functions
    function mint(address to, uint256 amount) public onlyOwner
    function transfer(address to, uint256 amount) public
    function balanceOf(address account) public view returns (uint256)
}
```

### Blockchain Interaction Flow

```
Backend (Web3.py)
    ↓
Ganache (Local Ethereum Network)
    ↓
Smart Contract
    ↓
Token Operations (mint, transfer, balance)
```

## 📦 IPFS Integration

### File Upload Process

```
1. Admin approves contribution
   ↓
2. Backend reads file from local storage
   ↓
3. Create metadata JSON
   {
     "title": "...",
     "description": "...",
     "author": "...",
     "timestamp": "...",
     "fileType": "..."
   }
   ↓
4. Upload file to Pinata
   ↓
5. Get IPFS hash (CID)
   ↓
6. Upload metadata to Pinata
   ↓
7. Store both hashes in database
   ↓
8. Return IPFS gateway URL
```

### IPFS URL Structure

```
https://gateway.pinata.cloud/ipfs/{CID}
```

## 🎨 Frontend Architecture

### Component Hierarchy

```
App
├── AppBar (Navigation)
├── Routes
│   ├── Landing (Public)
│   ├── Login (Public)
│   ├── Signup (Public)
│   ├── Dashboard (Protected)
│   │   ├── TokenBalance
│   │   ├── QuickStatCard
│   │   └── ProjectCard
│   ├── Submit (Protected)
│   ├── Profile (Protected)
│   ├── Marketplace (Protected + KYC)
│   └── Admin (Protected + Admin)
└── Notifications (Toast)
```

### State Management

```
React Context + Hooks
├── AuthContext (useAuth)
│   ├── user
│   ├── token
│   ├── login()
│   ├── logout()
│   └── signup()
├── NotificationContext (useNotifications)
│   ├── notifications[]
│   ├── addNotification()
│   └── removeNotification()
└── Custom Hooks
    ├── useWallet (blockchain)
    ├── useBalances (token balances)
    ├── useContracts (smart contracts)
    └── useMockIPFS (IPFS operations)
```

## 🔒 Security Layers

### 1. Frontend Security
- Input validation (Zod schemas)
- XSS prevention (React escaping)
- CSRF protection (JWT tokens)
- Secure storage (localStorage for JWT)

### 2. Backend Security
- Password hashing (bcrypt)
- JWT authentication
- SQL injection prevention (SQLAlchemy ORM)
- File upload validation
- CORS configuration
- Rate limiting (recommended)

### 3. Database Security
- Parameterized queries (SQLAlchemy)
- No sensitive data in logs
- Regular backups
- Access control

### 4. Blockchain Security
- Private key management
- Transaction validation
- Gas limit controls
- Contract auditing (recommended)

## 📡 API Endpoints Structure

```
/api
├── /auth
│   ├── POST /signup
│   ├── POST /login
│   └── GET /me
├── /contributions
│   ├── GET /
│   ├── POST /
│   ├── GET /:id
│   ├── PUT /:id
│   └── DELETE /:id
├── /admin
│   ├── GET /contributions/pending
│   ├── POST /contributions/:id/approve
│   ├── POST /contributions/:id/reject
│   ├── GET /kyc/pending
│   ├── POST /kyc/:id/approve
│   └── POST /kyc/:id/reject
├── /kyc
│   ├── POST /submit
│   └── GET /status
├── /marketplace
│   ├── GET /
│   └── GET /:id
├── /profile
│   ├── GET /
│   ├── PUT /
│   └── GET /contributions
└── /blockchain
    ├── GET /balance
    └── POST /transfer
```

## 🚀 Deployment Architecture

### Development
```
Local Machine
├── Frontend (localhost:5173)
├── Backend (localhost:5000)
├── Ganache (localhost:7545)
└── SQLite Database
```

### Production (Recommended)
```
Cloud Infrastructure
├── Frontend (Vercel/Netlify/S3+CloudFront)
├── Backend (Heroku/AWS/DigitalOcean)
├── Database (PostgreSQL - RDS/Managed)
├── Blockchain (Infura/Alchemy - Mainnet/Testnet)
└── IPFS (Pinata Cloud)
```

## 📊 Performance Considerations

### Frontend Optimization
- Code splitting (React.lazy)
- Image optimization
- Lazy loading
- Caching strategies
- CDN for static assets

### Backend Optimization
- Database indexing
- Query optimization
- Connection pooling
- Caching (Redis recommended)
- Async operations

### Blockchain Optimization
- Batch transactions
- Gas optimization
- Event listening vs polling
- Local caching of blockchain data

## 🔄 Scalability

### Horizontal Scaling
- Load balancer for backend
- Multiple backend instances
- Database read replicas
- CDN for frontend

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching
- Use message queues (Celery/RabbitMQ)

## 📈 Monitoring Points

### Application Metrics
- API response times
- Error rates
- User activity
- Contribution submissions
- Approval rates

### Infrastructure Metrics
- CPU/Memory usage
- Database connections
- Disk space
- Network traffic

### Blockchain Metrics
- Transaction success rate
- Gas costs
- Token distribution
- Contract events

---

**This architecture is designed to be:**
- ✅ Scalable
- ✅ Secure
- ✅ Maintainable
- ✅ Decentralized (where it matters)
- ✅ User-friendly

For implementation details, see the source code and other documentation files.

