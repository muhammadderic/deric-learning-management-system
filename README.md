# deric-learning-management-system

This is a full stack web application built with **Express.js (backend)**, **PostgreSQL (database)**,  
and a planned **frontend client** (currently under development).  

## 🚀 Features
- **Authentication**
  - Register, Login, and Logout.

### DevOps
- **Dockerized Development**
  - Runs frontend, backend, Postgres, and PgAdmin via root-level `docker-compose`.

---

## 🐳 Running with Docker
At the project root:

```sh
# Start all services (backend, frontend, postgres, pgadmin)
docker compose up -d

# Stop services
docker compose down

# View backend logs
docker compose logs -f backend

# View frontend logs
docker compose logs -f frontend
```

Backend runs on: **[http://localhost:5000](http://localhost:5000)**
Frontend runs on: **[http://localhost:3000](http://localhost:3000)** (when implemented)
PgAdmin runs on: **[http://localhost:5050](http://localhost:5050)** (default, check `.env`).


## 🏗️ Project Structure

```
project-root/
  ├── backend/                  # Backend service (Express, Prisma, Auth)
  │   ├── src/
  │   ├── prisma/
  │   └── Dockerfile
  ├── docker-compose.yml        # Orchestration for full stack
  ├── CHANGELOG.md              # Project-wide changelog
  └── README.md                 # Project-wide overview
```

---
## 🧪 Testing (Backend)

* **Unit Tests** → With mocked dependencies (repositories, external libs).
* **Integration Tests** → With real database (via Docker) for controllers and services.

Run tests:

```sh
cd backend
npm test
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

If you have any questions or suggestions, feel free to reach out:

- **GitHub**: [muhammadderic](https://github.com/muhammadderic)