# Changelog

All notable changes to ContriBlock will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Multi-chain support (Polygon, BSC)
- Mobile app (React Native)
- Advanced search and filtering
- User reputation system
- Decentralized governance (DAO)
- NFT certificates for contributions
- GitHub integration

## [1.0.0] - 2025-11-07

### Added - Initial Release 🎉

#### Core Features
- User authentication system with JWT
- Email-based KYC verification using EmailJS
- Contribution submission and management
- Admin approval workflow
- IPFS integration via Pinata for decentralized storage
- Blockchain rewards using Ganache local network
- Marketplace for browsing approved contributions
- User profile management
- Real-time notifications

#### Frontend
- React 18.3+ with TypeScript
- Vite build system
- Tailwind CSS + shadcn/ui components
- Three.js 3D hero scene
- React Router for navigation
- React Query for data fetching
- Ethers.js for blockchain interaction
- EmailJS for OTP verification
- Responsive design for mobile and desktop

#### Backend
- Flask 3.0+ REST API
- SQLAlchemy ORM with SQLite (dev) / PostgreSQL (prod)
- Flask-JWT-Extended for authentication
- Web3.py for blockchain integration
- Pinata API for IPFS storage
- Flask-CORS for cross-origin requests
- Bcrypt password hashing
- File upload handling

#### Blockchain
- Smart contract for token management
- Token minting for approved contributions
- Token transfer functionality
- Balance checking
- Ganache local blockchain support

#### Documentation
- Comprehensive README.md
- Quick start guide (QUICK_START.md)
- Contributing guidelines (CONTRIBUTING.md)
- Deployment guide (DEPLOYMENT.md)
- Architecture documentation (ARCHITECTURE.md)
- EmailJS setup guides
- KYC implementation summary
- IPFS metadata documentation
- Environment variable templates
- MIT License

#### DevOps
- Docker support
- Docker Compose configuration
- Comprehensive .gitignore
- Environment variable examples
- Database migrations with Alembic

#### Security
- JWT token authentication
- Password hashing with bcrypt
- CORS protection
- Input validation
- SQL injection prevention
- File upload validation
- Secure environment variable handling

### API Endpoints

#### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

#### Contributions
- `GET /api/contributions` - List contributions
- `POST /api/contributions` - Submit contribution
- `GET /api/contributions/:id` - Get contribution details
- `PUT /api/contributions/:id` - Update contribution
- `DELETE /api/contributions/:id` - Delete contribution

#### Admin
- `GET /api/admin/contributions/pending` - Get pending contributions
- `POST /api/admin/contributions/:id/approve` - Approve contribution
- `POST /api/admin/contributions/:id/reject` - Reject contribution
- `GET /api/admin/kyc/pending` - Get pending KYC requests
- `POST /api/admin/kyc/:id/approve` - Approve KYC
- `POST /api/admin/kyc/:id/reject` - Reject KYC

#### KYC
- `POST /api/kyc/submit` - Submit KYC documents
- `GET /api/kyc/status` - Check KYC status

#### Marketplace
- `GET /api/marketplace` - Browse marketplace
- `GET /api/marketplace/:id` - Get item details

#### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `GET /api/profile/contributions` - Get user contributions

#### Blockchain
- `GET /api/blockchain/balance` - Get token balance
- `POST /api/blockchain/transfer` - Transfer tokens

### Database Models
- User model with authentication
- Contribution model with status tracking
- KYC document model
- Token model for balance tracking

### UI Components
- AppBar with navigation
- HeroScene with 3D animation
- ProjectCard for contributions
- QuickStatCard for statistics
- TokenBalance display
- WalletChip for wallet info
- KYC verification forms
- Admin dashboard
- Marketplace browser
- Profile page
- Login/Signup forms

### Known Issues
- None reported yet

### Notes
- This is the initial release
- Smart contracts have not been audited
- Not recommended for mainnet use without security audit
- Development/beta phase

---

## Version History

### Version Numbering

We use [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for new functionality in a backwards compatible manner
- **PATCH** version for backwards compatible bug fixes

### Release Types

- **[Unreleased]** - Changes in development
- **[X.Y.Z]** - Released versions with date

### Change Categories

- **Added** - New features
- **Changed** - Changes in existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Security improvements

---

## How to Update This Changelog

When making changes to the project:

1. Add your changes under `[Unreleased]` section
2. Use the appropriate category (Added, Changed, Fixed, etc.)
3. Write clear, concise descriptions
4. Include issue/PR numbers if applicable
5. When releasing, move `[Unreleased]` items to a new version section

### Example Entry

```markdown
## [Unreleased]

### Added
- New feature X that does Y (#123)
- Support for Z functionality

### Fixed
- Bug where A caused B (#456)
- Performance issue in C component

### Changed
- Updated D to use E instead of F
- Improved G for better H
```

---

## Links

- [Repository](https://github.com/yourusername/ContriBlock)
- [Issues](https://github.com/yourusername/ContriBlock/issues)
- [Pull Requests](https://github.com/yourusername/ContriBlock/pulls)
- [Releases](https://github.com/yourusername/ContriBlock/releases)

---

**Note**: This changelog is maintained manually. Please keep it updated with each significant change to the project.

