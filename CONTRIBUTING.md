# Contributing to Games Tracker

## Project Introduction

Games Tracker is an educational full-stack application designed to explore user data collection, behavioral profiling, and recommendation systems. As part of the Weapon of Math Destruction initiative, this project demonstrates how modern web applications can collect user data, analyze patterns, and influence user behavior through personalized recommendations and gamification elements.

Your contributions help make this project more comprehensive, educational, and technically robust while maintaining ethical considerations around data collection and user privacy.

## Project Overview

**Technology Stack:**
- Frontend: React with Vite
- Backend: Node.js with Express
- Database: MongoDB
- Containerization: Docker and Docker Compose
- Additional Tools: Mongo Express (optional for database management)

**Key Features:**
- User authentication and profiling
- Interactive dashboard with data visualization
- Admin panel for user management
- Leaderboard system for gamification
- Recommendation engine for games
- Shopping cart functionality
- Data collection and analysis tools

## How to Contribute

We welcome contributions from students, developers, and reviewers who are interested in:

- Enhancing the educational value of the project
- Improving code quality and architecture
- Adding new features that align with project goals
- Fixing bugs and optimizing performance
- Improving documentation and user experience

## Development Setup

### Prerequisites
- Docker and Docker Compose installed
- Git configured
- Text editor or IDE

### Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd wdm-HamzaSahmoudi
   ```

2. Set up environment variables:
   - Copy `.env.template` to `.env` in the backend directory
   - Configure necessary environment variables (database connection, ports, etc.)

3. Start the development environment:
   ```bash
   docker compose up --build
   ```

4. Access the applications:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Mongo Express (if enabled): http://localhost:8081

### Development Workflow

- Frontend hot-reload is enabled during development
- Backend changes require container rebuild
- Database changes persist through container restarts

## Git Workflow

### Branch Strategy

- Use feature branches for new functionality: `feature/feature-name`
- Use bugfix branches for fixes: `bugfix/description`
- Keep main branch stable and production-ready

### Commit Guidelines

Follow conventional commits for clear history:

```
type(scope): description

feat(auth): add user registration functionality
fix(dashboard): resolve leaderboard sorting issue
docs(readme): update setup instructions
style(frontend): improve component styling
refactor(api): simplify user data fetching
test(games): add unit tests for recommendation engine
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (no functional impact)
- `refactor`: Code improvement without functional changes
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## Code Guidelines

### Naming Conventions
- Use camelCase for JavaScript variables and functions
- Use PascalCase for React components
- Use descriptive names that clearly indicate purpose
- Keep file names consistent with their content

### File Structure
- Maintain existing directory structure
- Place components in appropriate folders (frontend/src/pages, components, etc.)
- Keep related files together (components with their styles and tests)
- Follow the established backend route organization

### Code Quality
- Write clean, readable, and maintainable code
- Add comments for complex logic or business rules
- Keep functions small and focused on single responsibilities
- Use proper error handling throughout the application

## Bug Reports

When reporting bugs, include:

1. **Environment details**: OS, browser, Docker version
2. **Steps to reproduce**: Clear sequence of actions
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Error messages**: Full error logs and stack traces
6. **Additional context**: Screenshots, related issues, or configuration details

## Feature Requests

Feature requests should align with the project's educational goals around:

- Data collection and user profiling
- Behavioral analysis and recommendation systems
- Gamification and user engagement
- Ethical considerations in data-driven applications

Include in your request:
- Problem statement or educational objective
- Proposed solution and implementation approach
- Potential impact on user experience and data collection
- Technical considerations and dependencies

## Academic Integrity

This is an educational project. Contributors must:

- Avoid plagiarism of code, documentation, or ideas
- Properly cite all sources, references, and third-party code
- Document any use of AI tools or assistance
- Give appropriate credit to original authors and contributors
- Maintain academic honesty in all contributions

## Pull Request Guidelines

### Before Submitting

1. Ensure your code follows project conventions
2. Test your changes thoroughly
3. Update documentation if needed
4. Run linting and formatting tools if available

### PR Requirements

- One feature or fix per pull request
- Clear, descriptive title following conventional commits
- Detailed description of changes and their purpose
- Include screenshots for UI changes
- Link related issues or reference materials
- No unrelated or debug code changes

### Review Process

- All PRs require review before merging
- Address reviewer feedback promptly
- Keep discussion focused and constructive
- Update PR based on review suggestions

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project. Please ensure you have the rights to contribute any code or documentation you submit.

## Maintainer

**Hamza Sahmoudi**  
Academic Year: 2025–2026

For questions about contributing to this project, please reach out through the project's issue tracker or contact channels.