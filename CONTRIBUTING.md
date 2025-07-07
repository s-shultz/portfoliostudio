# Contributing to PortfolioStudio

Thank you for your interest in contributing to PortfolioStudio! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues
- **Bug Reports**: Use the GitHub issue tracker to report bugs
- **Feature Requests**: Suggest new features or improvements
- **Questions**: Ask questions about usage or implementation

### Development Process

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/portfoliostudio.git
   cd portfoliostudio
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests when applicable
   - Update documentation

4. **Test Your Changes**
   ```bash
   npm run dev     # Test in development
   npm run build   # Test production build
   npm run check   # Run TypeScript checks
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add amazing new feature"
   ```

6. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request on GitHub.

## 📋 Code Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` types when possible

### React Components
- Use functional components with hooks
- Follow React best practices
- Use meaningful component and prop names

### 3D Development
- Optimize 3D models and textures
- Consider performance implications
- Test on multiple devices

### CSS/Styling
- Use Tailwind CSS utility classes
- Follow responsive design principles
- Maintain consistent spacing and typography

## 🧪 Testing

- Test on multiple browsers and devices
- Verify responsive design works correctly
- Check 3D performance on different hardware
- Ensure accessibility standards are met

## 📝 Documentation

- Update README.md for new features
- Document complex functions and components
- Add JSDoc comments for public APIs
- Include examples for new functionality

## 🎯 Focus Areas

We're particularly interested in contributions for:

- **Performance Optimizations** - 3D rendering, bundle size, loading times
- **Accessibility** - WCAG compliance, keyboard navigation, screen readers
- **Mobile Experience** - Touch interactions, responsive design
- **New Features** - Creative 3D interactions, portfolio enhancements
- **Documentation** - Setup guides, API docs, tutorials

## ❓ Questions?

If you have questions about contributing:
- Open an issue on GitHub
- Reach out via email or LinkedIn (see main README)
- Check existing issues and discussions

## 🙏 Recognition

All contributors will be acknowledged in the project. Thank you for helping make PortfolioStudio better!