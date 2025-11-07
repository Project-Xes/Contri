# 🚀 ContriBlock Quick Start Guide

Get ContriBlock up and running in 10 minutes!

## ⚡ Prerequisites Checklist

Before you begin, make sure you have:

- [ ] **Node.js 18+** installed ([Download](https://nodejs.org/))
- [ ] **Python 3.10+** installed ([Download](https://www.python.org/))
- [ ] **Ganache** installed ([Download](https://trufflesuite.com/ganache/))
- [ ] **Git** installed ([Download](https://git-scm.com/))
- [ ] **Pinata account** created ([Sign up](https://pinata.cloud/))
- [ ] **EmailJS account** created ([Sign up](https://www.emailjs.com/))

## 📥 Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/ContriBlock.git
cd ContriBlock
```

## 🐍 Step 2: Backend Setup (5 minutes)

### 2.1 Create Virtual Environment

```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

### 2.2 Install Dependencies

```bash
pip install -r requirements.txt
```

### 2.3 Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env file with your text editor
# You'll need to fill in:
# - PINATA_API_KEY
# - PINATA_SECRET_API_KEY
# - DEPLOYER_PRIVATE_KEY (from Ganache)
# - CONTRACT_ADDRESS (after deployment)
```

### 2.4 Start Ganache

1. Open Ganache application
2. Click "Quickstart" or create new workspace
3. Ensure it's running on `http://127.0.0.1:7545`
4. Copy a private key from any account (click the key icon)
5. Paste it in your `.env` as `DEPLOYER_PRIVATE_KEY`

### 2.5 Deploy Smart Contract

```bash
python contracts/deploy_contract.py
```

**Important:** Copy the contract address from the output and add it to your `.env` file as `CONTRACT_ADDRESS`.

### 2.6 Initialize Database

```bash
# Initialize migrations
flask db init

# Create migration
flask db migrate -m "Initial migration"

# Apply migration
flask db upgrade
```

### 2.7 Start Backend Server

```bash
python app.py
```

✅ Backend should now be running on `http://localhost:5000`

## ⚛️ Step 3: Frontend Setup (3 minutes)

Open a **new terminal** window:

### 3.1 Navigate to Frontend

```bash
cd glow-contrib
```

### 3.2 Install Dependencies

```bash
npm install
# or
yarn install
```

### 3.3 Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env file with your text editor
# You'll need to fill in:
# - VITE_EMAILJS_SERVICE_ID
# - VITE_EMAILJS_TEMPLATE_ID
# - VITE_EMAILJS_PUBLIC_KEY
```

### 3.4 Start Development Server

```bash
npm run dev
# or
yarn dev
```

✅ Frontend should now be running on `http://localhost:5173`

## 🎮 Step 4: First Run (2 minutes)

### 4.1 Access the Application

Open your browser and go to: `http://localhost:5173`

### 4.2 Create Admin Account

1. Click **"Sign Up"**
2. Fill in the form:
   - Username: `admin`
   - Email: `admin@contriblock.com`
   - Password: `admin123` (change in production!)
3. Click **"Create Account"**

### 4.3 Manually Set Admin Role

Since the first user needs to be an admin, you'll need to update the database:

```bash
# In backend directory, with virtual environment activated
python

# In Python shell:
>>> from app import app, db
>>> from models.user import User
>>> with app.app_context():
...     admin = User.query.filter_by(username='admin').first()
...     admin.is_admin = True
...     db.session.commit()
...     print("Admin role granted!")
>>> exit()
```

### 4.4 Login as Admin

1. Go back to the browser
2. Click **"Login"**
3. Enter admin credentials
4. You should now see the admin dashboard!

## 🎉 Step 5: Test the System

### Create a Test Contribution

1. Create a regular user account (sign up with different email)
2. Complete KYC verification (use the OTP sent to email)
3. Submit a test contribution
4. Login as admin
5. Approve the contribution
6. Check that the contribution appears on IPFS
7. Verify that rewards are distributed

## 🔧 Troubleshooting

### Backend won't start

```bash
# Check if port 5000 is already in use
# Windows:
netstat -ano | findstr :5000
# macOS/Linux:
lsof -i :5000

# Kill the process or use a different port
```

### Frontend won't start

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Ganache connection error

- Ensure Ganache is running
- Check that `GANACHE_URL` in `.env` matches Ganache RPC server
- Verify the private key is correct

### Database errors

```bash
# Reset database
rm instance/dev.db
flask db upgrade
```

### IPFS upload fails

- Verify Pinata API keys are correct
- Check Pinata dashboard for quota limits
- Ensure file size is under 20MB

### EmailJS not working

- See [EMAILJS_SETUP.md](./EMAILJS_SETUP.md) for detailed setup
- Verify all three credentials are correct
- Check EmailJS dashboard for usage limits
- Test email service in EmailJS dashboard

## 📚 Next Steps

Now that you have ContriBlock running:

1. **Read the full [README.md](./README.md)** for detailed documentation
2. **Check [CONTRIBUTING.md](./CONTRIBUTING.md)** if you want to contribute
3. **Explore the API** at `http://localhost:5000/api`
4. **Customize the platform** to fit your needs
5. **Deploy to production** when ready

## 🆘 Need Help?

- 📖 [Full Documentation](./README.md)
- 🐛 [Report Issues](https://github.com/yourusername/ContriBlock/issues)
- 💬 [Discussions](https://github.com/yourusername/ContriBlock/discussions)
- 📧 Email: support@contriblock.io

## ⏱️ Quick Reference

### Start Development

```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python app.py

# Terminal 2 - Frontend
cd glow-contrib
npm run dev

# Terminal 3 - Ganache
# Just keep Ganache application running
```

### Stop Development

- Press `Ctrl+C` in both terminal windows
- Close Ganache application

### Reset Everything

```bash
# Backend
cd backend
rm -rf instance/ migrations/
rm dev.db
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

# Frontend
cd glow-contrib
rm -rf node_modules package-lock.json
npm install
```

---

**Happy Contributing! 🎉**

If you found this guide helpful, please ⭐ star the repository!

