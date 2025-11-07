# Contributing to ContriBlock

First off, thank you for considering contributing to ContriBlock! It's people like you that make ContriBlock such a great tool.

## 🌟 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** and what you expected
- **Include screenshots or animated GIFs** if possible
- **Include your environment details** (OS, browser, Node version, Python version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List any alternative solutions** you've considered

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the coding style** of the project
3. **Write clear commit messages**
4. **Include tests** if you're adding functionality
5. **Update documentation** as needed
6. **Ensure all tests pass** before submitting

## 🔧 Development Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- Ganache
- Git

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/ContriBlock.git
cd ContriBlock

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration

# Frontend setup
cd ../glow-contrib
npm install
cp .env.example .env
# Edit .env with your configuration
```

## 📝 Coding Standards

### Python (Backend)

- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) style guide
- Use meaningful variable and function names
- Add docstrings to functions and classes
- Keep functions small and focused
- Use type hints where appropriate

```python
def calculate_reward(contribution_id: int, quality_score: float) -> int:
    """
    Calculate reward tokens for a contribution.
    
    Args:
        contribution_id: The ID of the contribution
        quality_score: Quality score from 0.0 to 1.0
        
    Returns:
        Number of reward tokens
    """
    base_reward = 100
    return int(base_reward * quality_score)
```

### TypeScript/React (Frontend)

- Use TypeScript for type safety
- Follow React best practices and hooks guidelines
- Use functional components with hooks
- Keep components small and reusable
- Use meaningful component and variable names

```typescript
interface ContributionCardProps {
  title: string;
  author: string;
  status: 'pending' | 'approved' | 'rejected';
  onView: () => void;
}

export const ContributionCard: React.FC<ContributionCardProps> = ({
  title,
  author,
  status,
  onView
}) => {
  // Component implementation
};
```

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

```
feat: Add user profile editing functionality

- Add profile edit form component
- Implement API endpoint for profile updates
- Add validation for profile fields

Closes #123
```

### Commit Message Prefixes

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

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
```

### Writing Tests

- Write tests for new features
- Ensure tests are isolated and repeatable
- Use descriptive test names
- Test edge cases and error conditions

## 📚 Documentation

- Update README.md if you change functionality
- Add JSDoc/docstrings to new functions
- Update API documentation for new endpoints
- Include examples in documentation

## 🔍 Code Review Process

1. **Automated checks** must pass (linting, tests)
2. **At least one maintainer** must review and approve
3. **All conversations** must be resolved
4. **Branch must be up to date** with main

## 🎯 Project Structure

```
ContriBlock/
├── backend/           # Flask backend
│   ├── api/          # API routes
│   ├── models/       # Database models
│   ├── services/     # Business logic
│   └── tests/        # Backend tests
├── glow-contrib/     # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Page components
│   │   └── lib/         # Utilities
│   └── tests/        # Frontend tests
└── docs/             # Documentation
```

## 🚀 Release Process

1. Update version numbers
2. Update CHANGELOG.md
3. Create release branch
4. Run full test suite
5. Create GitHub release
6. Deploy to production

## 💬 Communication

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and ideas
- **Pull Requests** - Code contributions and reviews

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project website (when available)

## 📞 Questions?

Feel free to reach out:
- Open an issue with the `question` label
- Start a discussion in GitHub Discussions
- Contact maintainers directly

---

Thank you for contributing to ContriBlock! 🎉

