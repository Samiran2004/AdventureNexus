Thank you for your interest in contributing to **AdventureNexus**! 🚀 We're excited to have you join our community of developers who are passionate about making travel planning smarter and more accessible through AI.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Development Guidelines](#development-guidelines)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)
- [Community](#community)
- [Recognition](#recognition)

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to help us maintain a positive environment for everyone.

## Getting Started

AdventureNexus is an AI-powered travel planning application built with:
- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, TypeScript, MongoDB
- **Authentication**: Clerk
- **Deployment**: Render

### What You Can Contribute

- 🐛 **Bug Reports**: Found a bug? Help us fix it!
- ✨ **Feature Requests**: Have ideas for new features?
- 📝 **Documentation**: Improve our docs, README, or code comments
- 🎨 **UI/UX**: Enhance the user interface and experience
- 🧪 **Testing**: Write tests or improve existing ones
- 🔧 **Code**: Fix bugs, implement features, or improve performance
- 🌍 **Translations**: Help us support more languages

## Development Setup

### Prerequisites

- Node.js (v18+)
- npm or yarn
- MongoDB (local or cloud)
- Git

### Frontend Setup

```
# Clone the repository
git clone https://github.com/yourusername/AdventureNexus.git
cd AdventureNexus/frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your Clerk and API keys

# Start development server
npm run dev
```

### Backend Setup

```
# Navigate to backend
cd ../Backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your MongoDB URI, JWT secrets, etc.

# Start development server
npm run dev
```

### Environment Variables

Create `.env` files in both frontend and backend directories:

**Frontend (.env):**
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BACKEND_URL=http://localhost:5000
VITE_CURRENCY=USD
```

**Backend (.env):**
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLERK_WEBHOOK_KEY=your_clerk_webhook_secret
PORT=5000
NODE_ENV=development
```

## How to Contribute

### 1. Find an Issue

- Check our [Issues](https://github.com/yourusername/AdventureNexus/issues) page
- Look for issues labeled `good first issue` for beginners
- Issues labeled `help wanted` are great for experienced contributors

### 2. Fork & Branch

```
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/AdventureNexus.git

# Create a feature branch
git checkout -b feature/your-feature-name
```

### 3. Make Changes

- Follow our [Development Guidelines](#development-guidelines)
- Write clear, concise commit messages
- Add tests for new functionality
- Update documentation as needed

### 4. Test Your Changes

```
# Frontend tests
cd frontend
npm run test

# Backend tests
cd ../Backend
npm run test

# Run linting
npm run lint
```

## Development Guidelines

### Code Style

We use ESLint and Prettier for code formatting:

```
# Auto-format code
npm run format

# Check linting
npm run lint
```

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: add AI trip recommendation engine
fix: resolve authentication redirect issue
docs: update API documentation
style: improve mobile responsiveness
test: add unit tests for user service
refactor: simplify data fetching logic
```

### TypeScript Guidelines

- Use strict TypeScript configuration
- Provide proper type annotations
- Use interfaces for object shapes
- Avoid `any` type unless absolutely necessary

### React Guidelines

- Use functional components with hooks
- Follow React best practices
- Use TypeScript interfaces for props
- Implement proper error boundaries
- Use Context API for global state management

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use CSS modules for component-specific styles
- Maintain consistent spacing and typography

## Submitting Changes

### Pull Request Process

1. **Update Documentation**: Ensure any new features are documented
2. **Add Tests**: Include tests that prove your fix/feature works
3. **Update CHANGELOG**: Add entry describing your changes
4. **Follow Template**: Use our PR template when submitting

### Pull Request Template

```
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

### Review Process

1. **Automated Checks**: CI/CD pipeline runs tests and linting
2. **Code Review**: At least one maintainer reviews your PR
3. **Testing**: Changes are tested in development environment
4. **Approval**: PR is approved and merged by maintainers

## Reporting Issues

### Bug Reports

Use our bug report template and include:

- **Description**: Clear description of the bug
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable
- **Environment**: OS, browser, versions, etc.

### Feature Requests

Use our feature request template and include:

- **Problem**: What problem does this solve?
- **Solution**: Describe your proposed solution
- **Alternatives**: Alternative solutions considered
- **Additional Context**: Mockups, examples, etc.

## Community

### Communication Channels

- **Issues**: Use GitHub Issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for general questions
- **Email**: Contact maintainers at [email@example.com]

### Getting Help

- Check existing issues and documentation
- Join our community discussions
- Reach out to maintainers for guidance

## Recognition

We value all contributions! Contributors are recognized in:

- **README**: Featured contributors section
- **Releases**: Mentioned in release notes
- **Social Media**: Highlighted on our social channels

### Hall of Fame

Our top contributors:

- [@Samiran2004](https://github.com/Samiran2004) - Project Creator
- Add your name by contributing! 🌟

## License

By contributing to AdventureNexus, you agree that your contributions will be licensed under the same license as the project (MIT License).

## Questions?

Don't hesitate to reach out! We're here to help:

- Open an issue with the `question` label
- Start a discussion on GitHub
- Contact the maintainers directly

**Happy Contributing! 🎉**

---

*This contributing guide is a living document. Please help us improve it by suggesting changes or improvements.*
```
