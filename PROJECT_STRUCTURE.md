# Vocairo - Project Structure

This document describes the architecture and organization of the Vocairo mobile application built with React Native and Expo.

## Overview

Vocairo is a mobile application that follows modern React Native development practices with a focus on code quality, maintainability, and developer experience.

## Project Architecture

### Core Technologies

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and build tools
- **TypeScript**: Type-safe JavaScript development
- **Expo Router**: File-based routing system

### Development Tools

- **ESLint**: Code linting with import sorting and organization
- **Prettier**: Code formatting and consistency
- **Git Hooks**: Pre-commit checks for code quality

## Folder Structure

```
vocairo/
├── app/                        # Expo Router app directory
│   ├── _layout.tsx            # Root layout component
│   ├── (tabs)/                # Tab-based navigation
│   │   ├── _layout.tsx        # Tab layout
│   │   ├── index.tsx          # Home tab
│   │   └── explore.tsx        # Explore tab
│   └── +not-found.tsx         # 404 page
├── assets/                     # Static assets
│   ├── fonts/                 # Custom fonts
│   └── images/                # App images and icons
├── components/                 # Reusable UI components
│   ├── ui/                    # Base UI components
│   │   ├── IconSymbol.ios.tsx # iOS-specific icon component
│   │   ├── IconSymbol.tsx     # Cross-platform icon component
│   │   ├── TabBarBackground.ios.tsx # iOS tab bar background
│   │   └── TabBarBackground.tsx     # Cross-platform tab bar background
│   ├── Collapsible.tsx        # Collapsible content component
│   ├── ExternalLink.tsx       # External link handling
│   ├── HapticTab.tsx          # Haptic feedback tab
│   ├── HelloWave.tsx          # Welcome wave animation
│   ├── ParallaxScrollView.tsx # Parallax scrolling effect
│   ├── ThemedText.tsx         # Themed text component
│   └── ThemedView.tsx         # Themed view component
├── constants/                  # App constants and configuration
│   └── Colors.ts              # Color scheme definitions
├── hooks/                      # Custom React hooks
│   ├── useColorScheme.ts      # Color scheme hook
│   ├── useColorScheme.web.ts  # Web-specific color scheme
│   └── useThemeColor.ts       # Theme color utilities
├── scripts/                    # Build and utility scripts
│   └── reset-project.js       # Project reset utility
├── .githooks/                  # Git hooks for code quality
│   └── pre-commit             # Pre-commit linting and formatting
├── .vscode/                    # VS Code workspace settings
├── app.json                   # Expo app configuration
├── package.json                # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── eslint.config.js           # ESLint configuration
├── .prettierrc                # Prettier configuration
└── .gitignore                 # Git ignore patterns
```

## Key Features

### 1. File-Based Routing

- Uses Expo Router for intuitive navigation
- Tab-based navigation structure
- Automatic route generation

### 2. Component Architecture

- **UI Components**: Base components for consistent design
- **Platform-Specific**: iOS and Android optimizations
- **Themed Components**: Dark/light mode support
- **Reusable**: Modular component design

### 3. Development Experience

- **TypeScript**: Full type safety
- **ESLint**: Code quality enforcement
- **Prettier**: Consistent formatting
- **Git Hooks**: Automated quality checks

### 4. Asset Management

- **Fonts**: Custom typography support
- **Images**: Optimized image assets
- **Icons**: Platform-specific icon handling

## Development Workflow

### 1. Code Quality

```bash
# Lint code
npm run lint

# Format code
npx prettier --write .

# Check formatting
npx prettier --check .
```

### 2. Git Hooks

- Pre-commit hooks automatically run linting and formatting checks
- Ensures code quality before commits
- Prevents broken code from being committed

### 3. Import Organization

- ESLint automatically sorts imports
- Consistent import grouping and ordering
- Clear separation between external and internal imports

## Configuration Files

### ESLint (`eslint.config.js`)

- Import sorting and organization
- React Native and Expo specific rules
- Custom import path resolution

### Prettier (`.prettierrc`)

- Consistent code formatting
- Semi-colon enforcement
- Single quote preference
- 80 character line width

### TypeScript (`tsconfig.json`)

- Strict type checking
- Path mapping for clean imports
- Modern ES2020 target
- React JSX support

### Git Hooks (`.githooks/`)

- Pre-commit quality checks
- Automated linting and formatting
- Consistent code standards

## Best Practices

### 1. Component Organization

- Keep components in appropriate directories
- Use index files for clean exports
- Separate UI components from business logic

### 2. Import Management

- Use absolute imports with `@/` prefix
- Group imports logically
- Maintain consistent import ordering

### 3. Code Quality

- Run linting before commits
- Maintain consistent formatting
- Follow TypeScript best practices

### 4. Asset Management

- Optimize images for mobile
- Use appropriate font formats
- Maintain consistent naming conventions

## Future Enhancements

### Planned Features

- **State Management**: Redux Toolkit integration
- **Testing**: Jest and React Native Testing Library
- **CI/CD**: Automated testing and deployment
- **Performance**: Bundle analysis and optimization

### Architecture Improvements

- **Feature Slices**: Domain-driven design
- **API Layer**: Centralized data management
- **Error Handling**: Comprehensive error boundaries
- **Accessibility**: Enhanced accessibility support

This structure provides a solid foundation for building a scalable, maintainable React Native application with excellent developer experience and code quality.
