# Contributing to AIPathway

Thank you for your interest in contributing to AIPathway! This document provides guidelines for contributing to the project.

## 🎯 Ways to Contribute

1. **Report Bugs** - Found a bug? Open an issue with details
2. **Suggest Features** - Have an idea? We'd love to hear it
3. **Improve Documentation** - Help make our docs better
4. **Submit Code** - Fix bugs or implement features
5. **Share Feedback** - Let us know about your experience

## 🐛 Reporting Bugs

When reporting bugs, please include:

- **Description**: Clear description of the bug
- **Steps to Reproduce**: How to recreate the issue
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: Browser, OS, Node version
- **Screenshots**: If applicable
- **Console Errors**: Any error messages from console

### Bug Report Template

```markdown
**Bug Description**
A clear description of what the bug is.

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- Browser: [e.g. Chrome 120]
- OS: [e.g. Windows 11]
- Node Version: [e.g. 18.17.0]
```

## 💡 Suggesting Features

We welcome feature suggestions! Please:

1. Check if the feature already exists or is planned
2. Describe the feature and its use case
3. Explain why it would be valuable
4. Include mockups or examples if possible

### Feature Request Template

```markdown
**Feature Description**
Clear description of the proposed feature.

**Use Case**
Who would use this and why?

**Proposed Solution**
How you envision this working.

**Alternatives Considered**
Other approaches you've thought about.

**Additional Context**
Any other relevant information.
```

## 🛠️ Development Setup

1. **Fork the repository**

2. **Clone your fork**
```bash
git clone https://github.com/YOUR_USERNAME/aipathway.git
cd aipathway
```

3. **Install dependencies**
```bash
npm install
```

4. **Create a branch**
```bash
git checkout -b feature/your-feature-name
```

5. **Make your changes**

6. **Test your changes**
```bash
npm run dev
# Test thoroughly in browser
```

7. **Commit with clear messages**
```bash
git commit -m "feat: add new quiz question type"
```

## 📝 Code Style Guidelines

### TypeScript/JavaScript
- Use TypeScript for type safety
- Follow existing code structure
- Use meaningful variable names
- Add comments for complex logic
- Keep functions focused and small

### React Components
- Use functional components with hooks
- Keep components small and reusable
- Use proper TypeScript types/interfaces
- Follow existing naming conventions

### Styling
- Use Tailwind CSS classes
- Follow existing design patterns
- Ensure mobile responsiveness
- Test on different screen sizes

### Git Commit Messages
Follow conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add PDF export functionality
fix: correct quiz navigation bug
docs: update README with deployment info
style: format code with prettier
refactor: extract course helpers to utils
```

## 🧪 Testing Guidelines

Before submitting:

1. **Manual Testing**
   - Test all affected features
   - Check on different browsers
   - Verify mobile responsiveness
   - Test error cases

2. **Visual Testing**
   - Verify UI looks correct
   - Check all states (loading, error, success)
   - Test dark/light themes if applicable

3. **Integration Testing**
   - Test with Venice API
   - Verify data persistence
   - Check localStorage handling

## 📋 Pull Request Process

1. **Update Documentation**
   - Update README if needed
   - Add JSDoc comments to functions
   - Update CHANGELOG if applicable

2. **Create Pull Request**
   - Use a clear, descriptive title
   - Reference related issues
   - Describe changes made
   - Include screenshots for UI changes
   - List testing performed

3. **PR Template**
```markdown
**Description**
Clear description of changes made.

**Related Issues**
Fixes #123

**Changes Made**
- Added feature X
- Fixed bug in Y
- Updated documentation

**Testing Performed**
- Manual testing on Chrome, Firefox
- Tested on mobile devices
- Verified API integration

**Screenshots**
[If applicable]

**Checklist**
- [ ] Code follows project style
- [ ] Comments added where needed
- [ ] Documentation updated
- [ ] Tested thoroughly
- [ ] No console errors
```

4. **Review Process**
   - Address review comments
   - Make requested changes
   - Keep discussion professional and constructive

## 🚀 Priority Areas for Contribution

We especially welcome contributions in these areas:

1. **Features**
   - PDF export functionality
   - User authentication
   - Database integration
   - Additional quiz questions
   - More AI tools coverage

2. **Improvements**
   - Performance optimization
   - Accessibility enhancements
   - Mobile experience
   - Error handling
   - Loading states

3. **Documentation**
   - Tutorial videos
   - More examples
   - API documentation
   - Deployment guides

4. **Testing**
   - Unit tests
   - Integration tests
   - E2E tests
   - Performance tests

## 📜 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the project
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Public or private harassment
- Publishing others' private information
- Unprofessional conduct

## 📞 Getting Help

Need help contributing?

- Check existing issues and PRs
- Review documentation
- Ask questions in discussions
- Reach out to maintainers

## 🙏 Recognition

All contributors will be:
- Listed in CONTRIBUTORS.md
- Acknowledged in release notes
- Part of the AIPathway community!

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to AIPathway! 🎉**

Together, we're making AI education more accessible and personalized for everyone.

