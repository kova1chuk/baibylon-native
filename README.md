# Baibylon

A modern React Native mobile application built with Expo, featuring a robust development environment and code quality tools.

## 🚀 Features

- **Cross-Platform**: Built with React Native and Expo for iOS, Android, and Web
- **Type Safety**: Full TypeScript support with strict configuration
- **Modern Architecture**: File-based routing with Expo Router
- **Code Quality**: ESLint with import sorting and Prettier formatting
- **Git Hooks**: Automated pre-commit checks for code quality
- **Developer Experience**: VS Code integration and workspace settings

## 🛠️ Development Tools

### Code Quality

- **ESLint**: Advanced linting with import organization and React Native rules
- **Prettier**: Consistent code formatting across the project
- **TypeScript**: Strict type checking and modern JavaScript features

### Git Integration

- **Pre-commit Hooks**: Automatic linting and formatting checks
- **Import Sorting**: Consistent import organization and grouping
- **Code Standards**: Enforced code quality before commits

### Editor Support

- **VS Code**: Optimized workspace settings and extensions
- **Auto-formatting**: Format on save with Prettier
- **Linting**: Real-time ESLint feedback

## 📁 Project Structure

```
baibylon/
├── app/                        # Expo Router app directory
│   ├── _layout.tsx            # Root layout component
│   ├── (tabs)/                # Tab-based navigation
│   └── +not-found.tsx         # 404 page
├── assets/                     # Static assets (fonts, images)
├── components/                 # Reusable UI components
│   ├── ui/                    # Base UI components
│   └── [Component].tsx        # Feature components
├── constants/                  # App constants and configuration
├── hooks/                      # Custom React hooks
├── scripts/                    # Build and utility scripts
├── .githooks/                  # Git hooks for code quality
├── .vscode/                    # VS Code workspace settings
└── [Config Files]              # Project configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd baibylon
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the development server**

   ```bash
   pnpm start
   ```

4. **Run on specific platform**

   ```bash
   # iOS
   pnpm run ios

   # Android
   pnpm run android

   # Web
   pnpm run web
   ```

## 🧹 Development Commands

### Code Quality

```bash
# Lint code
pnpm run lint

# Fix linting issues automatically
pnpm run lint:fix

# Check code formatting
pnpm run format:check

# Format code automatically
pnpm run format

# Type checking
pnpm run type-check
```

### Project Management

```bash
# Reset project (cleans build artifacts)
pnpm run reset-project

# Install dependencies
pnpm install

# Update dependencies
pnpm update
```

## 🔧 Configuration

### ESLint

The project uses a custom ESLint configuration with:

- Import sorting and organization
- React Native specific rules
- Consistent code style enforcement
- Automatic import grouping

### Prettier

Code formatting is handled by Prettier with:

- Semi-colon enforcement
- Single quote preference
- 80 character line width
- Consistent spacing and formatting

### TypeScript

TypeScript is configured with:

- Strict type checking
- Modern ES2020 target
- Path mapping for clean imports
- React JSX support

### Git Hooks

Pre-commit hooks automatically:

- Run ESLint checks
- Verify Prettier formatting
- Ensure code quality standards
- Prevent broken code commits

## 📱 Platform Support

- **iOS**: Native iOS app with platform-specific optimizations
- **Android**: Native Android app with Material Design
- **Web**: Progressive Web App (PWA) support

## 🎨 UI Components

The project includes a comprehensive set of UI components:

- **Themed Components**: Dark/light mode support
- **Platform-Specific**: iOS and Android optimizations
- **Reusable**: Modular component design
- **Accessible**: Built with accessibility in mind

## 🔍 Troubleshooting

### Common Issues

1. **Metro bundler issues**

   ```bash
   pnpm run reset-project
   pnpm start --clear
   ```

2. **Linting errors**

   ```bash
   pnpm run lint:fix
   ```

3. **Formatting issues**

   ```bash
   pnpm run format
   ```

4. **TypeScript errors**
   ```bash
   pnpm run type-check
   ```

### Development Tips

- Always run `pnpm run lint` before committing
- Use VS Code with recommended extensions
- Keep imports organized and sorted
- Follow the established component patterns

## 📚 Documentation

- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Detailed project architecture
- [Expo Documentation](https://docs.expo.dev/) - Expo platform guides
- [React Native Documentation](https://reactnative.dev/) - React Native guides

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure code passes all checks
5. Submit a pull request

### Code Standards

- All code must pass ESLint checks
- Code must be formatted with Prettier
- TypeScript strict mode compliance
- Follow established import patterns

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Check the documentation
- Review existing issues
- Create a new issue with detailed information

---

Built with ❤️ using React Native and Expo
