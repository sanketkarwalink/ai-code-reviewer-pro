# 🤝 Contributing to AI Code Reviewer Pro

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git
- OpenAI API key

### Setup Development Environment

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/ai-code-reviewer-pro.git
   cd ai-code-reviewer-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   # Add your API keys to .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📋 Development Guidelines

### Code Style
- **TypeScript**: All new code must be TypeScript
- **ESLint**: Follow the existing ESLint configuration
- **Prettier**: Code formatting is handled automatically
- **Naming**: Use descriptive names for variables and functions

### Component Structure
```tsx
// components/ComponentName.tsx
'use client';

import React from 'react';
import { ComponentProps } from './types';

interface ComponentNameProps {
  // Define props with TypeScript
}

export default function ComponentName({ prop }: ComponentNameProps) {
  // Component logic
  return (
    // JSX
  );
}
```

### API Routes
```typescript
// app/api/endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // API logic
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error message' }, { status: 500 });
  }
}
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🧪 Testing Guidelines

### Unit Tests
- Write tests for utility functions
- Test components with React Testing Library
- Maintain good test coverage

### Integration Tests
- Test API endpoints
- Test user workflows
- Test error scenarios

## 📝 Commit Guidelines

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples
```bash
feat(api): add support for multiple AI providers
fix(ui): resolve copy button animation issue
docs(readme): update installation instructions
```

## 🐛 Bug Reports

### Before Submitting
1. Check existing issues
2. Verify the bug in the latest version
3. Test with minimal reproduction case

### Bug Report Template
```markdown
**Describe the bug**
A clear description of the bug.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 91]
- Node.js version: [e.g., 18.17.0]
```

## 💡 Feature Requests

### Before Submitting
1. Check if feature already exists
2. Review existing feature requests
3. Consider if it fits project scope

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want.

**Describe alternatives you've considered**
Alternative solutions or features.

**Additional context**
Any other context or screenshots.
```

## 🔄 Pull Request Process

### Before Submitting
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Run linting and type checking

### Pull Request Template
```markdown
**Description**
Brief description of changes.

**Type of Change**
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

**Testing**
- [ ] Tests pass
- [ ] New tests added
- [ ] Manual testing completed

**Checklist**
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for functions
- Document complex logic
- Keep README.md updated

### API Documentation
- Document all endpoints
- Include request/response examples
- Document error codes

## 🎯 Development Focus Areas

### High Priority
- Performance optimizations
- Accessibility improvements
- Error handling enhancements
- Test coverage

### Medium Priority
- New AI provider integrations
- UI/UX improvements
- Analytics enhancements
- Mobile optimizations

### Future Considerations
- Real-time collaboration
- User authentication
- Database integration
- VS Code extension

## 🤔 Questions?

- **General Questions**: Open a discussion
- **Bug Reports**: Create an issue
- **Feature Requests**: Create an issue
- **Security Issues**: Email maintainer directly

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Happy coding!** 🚀
