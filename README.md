<div align="center">

# 🌟 ContriBlock

### Decentralized Contribution Platform with Blockchain Rewards

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB.svg?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0+-000000.svg?logo=flask)](https://flask.palletsprojects.com/)
[![Web3](https://img.shields.io/badge/Web3-Enabled-F16822.svg)](https://web3py.readthedocs.io/)

**A revolutionary platform that combines blockchain technology with decentralized storage to reward contributors for their valuable work.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 Overview

**ContriBlock** is a decentralized contribution management platform that leverages blockchain technology and IPFS to create a transparent, secure, and rewarding ecosystem for contributors. Users can submit code, documents, and other digital assets, which are reviewed by administrators and stored on IPFS. Approved contributions earn blockchain-based rewards, creating a gamified experience for open-source and collaborative work.

### 🎯 Key Highlights

- 🔐 **Secure KYC Verification** - Email-based OTP verification using EmailJS
- 📦 **Decentralized Storage** - IPFS integration via Pinata for permanent, censorship-resistant storage
- 💰 **Blockchain Rewards** - Ethereum-based token rewards for approved contributions
- 👨‍💼 **Admin Moderation** - Quality control through admin review and approval system
- 🛒 **Marketplace** - Trade and discover contributions from verified users
- 🎨 **Modern UI** - Beautiful, responsive interface built with React and Tailwind CSS

---

## ✨ Features

### For Contributors
- 📝 **Submit Contributions** - Upload code, documents, research papers, and more
- 🎁 **Earn Rewards** - Get blockchain tokens for approved contributions
- 📊 **Track Progress** - Monitor submission status and earnings in real-time
- 🔍 **Browse Marketplace** - Discover and access contributions from other users
- 👤 **Profile Management** - Manage your contributions and view your impact

### For Administrators
- ✅ **Review Submissions** - Approve or reject contributions with feedback
- 👥 **KYC Management** - Verify user identities and manage access
- 📈 **Platform Analytics** - Monitor platform activity and user engagement
- 🔧 **System Control** - Manage blockchain contracts and IPFS storage

### Technical Features
- 🔗 **Blockchain Integration** - Ganache local Ethereum network for development
- 🌐 **IPFS Storage** - Decentralized file storage with Pinata
- 🔒 **JWT Authentication** - Secure token-based authentication
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎨 **3D Animations** - Interactive Three.js hero scene
- 🔔 **Real-time Notifications** - Toast notifications for user actions

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18.3+ with TypeScript
- **Build Tool**: Vite 5.4+
- **Styling**: Tailwind CSS + shadcn/ui components
- **3D Graphics**: Three.js + React Three Fiber
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod validation
- **Blockchain**: Ethers.js 6.15+
- **Email**: EmailJS for OTP verification

### Backend
- **Framework**: Flask 3.0+
- **Database**: SQLAlchemy with SQLite (dev) / PostgreSQL (prod)
- **Authentication**: Flask-JWT-Extended
- **Blockchain**: Web3.py 6.20+
- **Storage**: IPFS via Pinata API
- **CORS**: Flask-CORS
- **Migrations**: Alembic + Flask-Migrate

### Blockchain & Storage
- **Local Blockchain**: Ganache (Ethereum)
- **Smart Contracts**: Solidity (via py-solc-x)
- **Decentralized Storage**: IPFS (Pinata)
- **Web3 Provider**: HTTP Provider (Ganache)

### DevOps
- **Containerization**: Docker + Docker Compose
- **Package Management**: npm/yarn (frontend), pip (backend)
- **Version Control**: Git

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and npm/yarn
- **Python** 3.10+
- **Ganache** (for local blockchain)
- **Git**

### Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/ContriBlock.git
cd ContriBlock
```

#### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your configuration
```

**Backend Environment Variables** (`.env`):
```env
FLASK_SECRET_KEY=your-secret-key-here
JWT_SECRET=your-jwt-secret-here
DATABASE_URL=sqlite:///dev.db
GANACHE_URL=http://127.0.0.1:7545
DEPLOYER_PRIVATE_KEY=your-ganache-private-key
CONTRACT_ADDRESS=your-deployed-contract-address
PINATA_API_KEY=your-pinata-api-key
PINATA_SECRET_API_KEY=your-pinata-secret-key
FRONTEND_ORIGIN=http://localhost:5173
```

#### 3️⃣ Deploy Smart Contract

```bash
# Make sure Ganache is running on port 7545
python backend/contracts/deploy_contract.py
# Copy the contract address to your .env file
```

#### 4️⃣ Initialize Database

```bash
# From backend directory
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

#### 5️⃣ Start Backend Server

```bash
# From backend directory
python app.py
# Backend will run on http://localhost:5000
```

#### 6️⃣ Frontend Setup

```bash
# Open new terminal, navigate to frontend
cd glow-contrib

# Install dependencies
npm install
# or
yarn install

# Create .env file (if needed)
cp .env.example .env
```

**Frontend Environment Variables** (`.env`):
```env
VITE_API_URL=http://localhost:5000
VITE_EMAILJS_SERVICE_ID=your-emailjs-service-id
VITE_EMAILJS_TEMPLATE_ID=your-emailjs-template-id
VITE_EMAILJS_PUBLIC_KEY=your-emailjs-public-key
```

#### 7️⃣ Start Frontend Development Server

```bash
# From glow-contrib directory
npm run dev
# or
yarn dev
# Frontend will run on http://localhost:5173
```

### 🎮 Usage

1. **Start Ganache** - Launch Ganache and ensure it's running on `http://127.0.0.1:7545`
2. **Access Application** - Open browser to `http://localhost:5173`
3. **Sign Up** - Create an account and complete KYC verification
4. **Submit Contribution** - Upload your first contribution
5. **Admin Review** - Login as admin to approve contributions
6. **Earn Rewards** - Receive blockchain tokens for approved work!

---

## 📚 Documentation

Detailed documentation is available in the following files:

- 📧 [EmailJS Setup Guide](./EMAILJS_SETUP.md) - Configure email OTP verification
- 🔧 [EmailJS Troubleshooting](./EMAILJS_TROUBLESHOOTING.md) - Common issues and fixes
- 📮 [Gmail EmailJS Fix](./GMAIL_EMAILJS_FIX.md) - Gmail-specific configuration
- 🔐 [KYC Implementation](./KYC_IMPLEMENTATION_SUMMARY.md) - KYC system overview
- 📦 [IPFS Metadata](./IPFS_METADATA_IMPLEMENTATION.md) - IPFS integration details

---

## 🏗 Project Structure

```
ContriBlock/
├── backend/                    # Flask backend
│   ├── api/                   # API routes
│   │   ├── auth.py           # Authentication endpoints
│   │   ├── contributions.py  # Contribution management
│   │   ├── kyc.py            # KYC verification
│   │   ├── marketplace.py    # Marketplace endpoints
│   │   └── profile.py        # User profile
│   ├── contracts/            # Smart contracts
│   │   └── deploy_contract.py
│   ├── models/               # Database models
│   │   ├── user.py
│   │   ├── contribution.py
│   │   ├── kyc_document.py
│   │   └── token.py
│   ├── services/             # Business logic
│   │   └── storage.py        # IPFS integration
│   ├── utils/                # Utilities
│   ├── app.py                # Main application
│   ├── config.py             # Configuration
│   └── requirements.txt      # Python dependencies
│
├── glow-contrib/              # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom hooks
│   │   ├── pages/            # Page components
│   │   ├── lib/              # Utilities
│   │   └── main.tsx          # Entry point
│   ├── public/               # Static assets
│   ├── package.json          # Node dependencies
│   └── vite.config.ts        # Vite configuration
│
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

---

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication system
- **Password Hashing** - Bcrypt encryption for user passwords
- **KYC Verification** - Email-based identity verification
- **Admin Authorization** - Role-based access control
- **CORS Protection** - Configured CORS policies
- **Input Validation** - Zod schema validation on frontend
- **SQL Injection Prevention** - SQLAlchemy ORM protection
- **File Upload Validation** - Size and type restrictions

---

## 🎨 UI Components

The frontend uses **shadcn/ui** components built on top of Radix UI primitives:

- 🎯 **Buttons & Forms** - Accessible, customizable form controls
- 📊 **Data Display** - Tables, cards, and charts
- 🔔 **Notifications** - Toast notifications with Sonner
- 🎭 **Modals & Dialogs** - Alert dialogs and modal windows
- 📱 **Navigation** - Responsive navigation menus
- 🎨 **Theming** - Dark/light mode support with next-themes
- ✨ **Animations** - Framer Motion animations

---

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Contributions
- `GET /api/contributions` - List all contributions
- `POST /api/contributions` - Submit new contribution
- `GET /api/contributions/:id` - Get contribution details
- `PUT /api/contributions/:id` - Update contribution
- `DELETE /api/contributions/:id` - Delete contribution

### Admin
- `GET /api/admin/contributions/pending` - Get pending contributions
- `POST /api/admin/contributions/:id/approve` - Approve contribution
- `POST /api/admin/contributions/:id/reject` - Reject contribution
- `GET /api/admin/kyc/pending` - Get pending KYC requests
- `POST /api/admin/kyc/:id/approve` - Approve KYC
- `POST /api/admin/kyc/:id/reject` - Reject KYC

### KYC
- `POST /api/kyc/submit` - Submit KYC documents
- `GET /api/kyc/status` - Check KYC status

### Marketplace
- `GET /api/marketplace` - Browse marketplace items
- `GET /api/marketplace/:id` - Get item details

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `GET /api/profile/contributions` - Get user contributions

### Blockchain
- `GET /api/blockchain/balance` - Get token balance
- `POST /api/blockchain/transfer` - Transfer tokens

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest tests/
```

### Frontend Tests

```bash
cd glow-contrib
npm run test
# or
yarn test
```

---

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Build

```bash
# Build backend
cd backend
docker build -t contriblock-backend .

# Build frontend
cd glow-contrib
docker build -t contriblock-frontend .

# Run containers
docker run -p 5000:5000 contriblock-backend
docker run -p 5173:5173 contriblock-frontend
```

---

## 🌍 Environment Setup

### Ganache Configuration

1. Download and install [Ganache](https://trufflesuite.com/ganache/)
2. Create new workspace or quickstart
3. Configure RPC Server: `http://127.0.0.1:7545`
4. Copy a private key from Ganache accounts
5. Add to backend `.env` as `DEPLOYER_PRIVATE_KEY`

### Pinata IPFS Setup

1. Sign up at [Pinata.cloud](https://pinata.cloud/)
2. Generate API keys from dashboard
3. Add to backend `.env`:
   - `PINATA_API_KEY`
   - `PINATA_SECRET_API_KEY`

### EmailJS Setup

1. Sign up at [EmailJS.com](https://www.emailjs.com/)
2. Create email service (Gmail, Outlook, etc.)
3. Create email template for OTP
4. Get credentials:
   - Service ID
   - Template ID
   - Public Key
5. Add to frontend `.env`

See [EMAILJS_SETUP.md](./EMAILJS_SETUP.md) for detailed instructions.

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### How to Contribute

1. **Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/ContriBlock.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Your Changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests if applicable

4. **Commit Your Changes**
   ```bash
   git commit -m "Add amazing feature"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Describe your changes
   - Reference any related issues
   - Wait for review

### Contribution Guidelines

- ✅ Follow the existing code style
- ✅ Write meaningful commit messages
- ✅ Add tests for new features
- ✅ Update documentation as needed
- ✅ Keep PRs focused and atomic
- ❌ Don't commit sensitive data
- ❌ Don't break existing functionality

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors & Acknowledgments

### Core Team
- **Your Name** - *Initial work* - [@yourusername](https://github.com/yourusername)

### Acknowledgments
- Thanks to all contributors who have helped shape ContriBlock
- Built with amazing open-source technologies
- Inspired by the decentralized web movement

---

## 📞 Support & Contact

### Get Help
- 📖 [Documentation](./docs)
- 💬 [Discussions](https://github.com/yourusername/ContriBlock/discussions)
- 🐛 [Issue Tracker](https://github.com/yourusername/ContriBlock/issues)

### Connect With Us
- 🌐 Website: [contriblock.io](https://contriblock.io)
- 🐦 Twitter: [@ContriBlock](https://twitter.com/ContriBlock)
- 💼 LinkedIn: [ContriBlock](https://linkedin.com/company/contriblock)
- 📧 Email: support@contriblock.io

---

## 🗺 Roadmap

### Phase 1 - MVP ✅
- [x] User authentication system
- [x] KYC verification
- [x] Contribution submission
- [x] Admin approval workflow
- [x] IPFS integration
- [x] Blockchain rewards

### Phase 2 - Enhancement 🚧
- [ ] Multi-chain support (Polygon, BSC)
- [ ] Advanced search and filtering
- [ ] Contribution categories
- [ ] User reputation system
- [ ] Mobile app (React Native)

### Phase 3 - Scale 📋
- [ ] Decentralized governance (DAO)
- [ ] NFT certificates for contributions
- [ ] Peer review system
- [ ] Integration with GitHub
- [ ] API for third-party integrations
- [ ] Advanced analytics dashboard

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/ContriBlock?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/ContriBlock?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/ContriBlock)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/ContriBlock)
![GitHub last commit](https://img.shields.io/github/last-commit/yourusername/ContriBlock)

---

## ⚠️ Disclaimer

This project is currently in **development/beta** phase. Use at your own risk. The smart contracts have not been audited. Do not use with real funds on mainnet without proper security audits.

---

<div align="center">

### 🌟 Star this repository if you find it helpful!

**Made with ❤️ by the ContriBlock Team**

[⬆ Back to Top](#-contriblock)

</div>

