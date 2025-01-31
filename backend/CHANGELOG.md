All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),  
and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.1.0] - 2025-09-05-1600
### Added
- **Dependency Injection pattern**  
  - Applied to repositories (`UserRepository`, `RefreshTokenRepository`) using factory functions.  
  - Applied to `AuthService` for improved testability and modularity.  

- **Authentication Handlers**  
  - `register` → Create user and return tokens.  
  - `login` → Authenticate user credentials and return tokens.  
  - `logout` → Invalidate refresh token. 

- **Initial Version**
  - Base Express.js backend.  
  - Prisma integration with PostgreSQL.    