# 🚪 API Gateway

## 🧩 Introduction
Welcome to the GitHub repository for **API Gateway** – This gateway acts as the central access point for all user-facing API requests in our platform. It efficiently routes incoming requests to the appropriate microservices, including **accounts-svc**, **problems-svc**, and **submission-svc**. The gateway also enforces authentication, authorization, rate limiting, and request validation to ensure a secure and scalable system.

## 📌 Project Status: Under Development
### What's Happening Now:
- Implementing secure, efficient routing to internal services.
- Setting up centralized error handling and request validation.
- Enabling dynamic route registration based on service metadata.
- Integrating JWT authentication and RBAC middleware.

## 🚀 Features
### Overview
The **API Gateway** is designed to abstract internal service architecture from external clients, providing a unified entry point for all application interactions.
### Key Features
- **Centralized Routing:** Routes all client requests to appropriate services based on path and method.
- **JWT Authentication:** Verifies and decodes JWTs to authenticate users.
- **Role-Based Access Control (RBAC):** Controls access to routes based on user roles and scopes defined in accounts-svc.
- **Rate Limiting (optional):** Prevents abuse by limiting requests per client.
- **Dynamic Route Management:** Loads available routes from the database or static configuration.
- **OpenAPI Request Validation:** Ensures all requests conform to predefined API specifications.
### Usage
The API Gateway provides the only public access point to internal microservices. All frontend applications and external clients interact with this layer, ensuring a secure and consistent API surface.
### Security
- All requests are served via **HTTPS**.
- **JWT Bearer Token Authentication** with scope validation is enforced for protected routes.
- Routes and access controls are dynamically managed to reduce hardcoded logic.
- **CORS** is configured with strict origin control.
- Input validation using **OpenAPI schemas**.

## API Endpoints (Gateway Level)
### Public APIs
| Method | Endpoint                                                | Description                             |
| :----- | :------------------------------------------------------ | :-------------------------------------- |
| GET    | `/api-docs/`                                            | View docs for service                   |
| GET    | `/api-gateway/health`                                   | Health Check Service                    |

All feature-specific APIs are proxied through this gateway to:
- /accounts-svc/
- /problems-svc/
- /submission-svc/

### Proxy Examples
| Method | Gateway Route                                           | Proxies To (Internal)                              |
| :----- | :------------------------------------------------------ | :------------------------------------------------- |
| POST   | `/accounts-svc/api/v1.0/login`                          | `/accounts-svc/api/v1.0/login`                     |
| GET    | `/problems-svc/api/v1.0/sheet`                          | `/problems-svc/api/v1.0/sheet`                     |
| POST   | `/submission-svc/api/v1.0//submission?type=PRIVATE`     | `/submission-svc/api/v1.0//submission?type=PRIVATE`|

## Middleware Overview
| Middleware     | Description                                         |
| :------------- | :-------------------------------------------------- |
| verifyToken    | Validates JWT token for incoming user request       |
| verifyScope    | Verify required user scope for incoming user request|
| errorHandler   | Unified error response formatting                   |

## 🛠️ Setup Instructions

```bash
# Clone the repository
git clone https://github.com/Ayushya100/leetlab-gateway.git
cd accounts-svc

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Then configure your .env file

# Run the server
npm run start
```

## 📦 Tech Stack
- **Language:** Node.js
- **Framework:** Express.js
- **Routing:** Middleware
- **Auth:** JWT and Role/Scope based middleware
- **Database:** PostgreSQL
- **Validation:** OpenAPI Spec
- **Query Builder:** Knex.js
- **Environment Management:** dotenv
- **Logging:** Winston
- **Rate Limiting:** Express-rate-limitter

## Related Services
- [Accounts Service](https://github.com/Ayushya100/accounts-svc)
- [Problems Service](https://github.com/Ayushya100/problems-svc)
- [Submission Service](https://github.com/Ayushya100/submission-svc)

---
**API Gateway** – Simplifying connectivity across our microservices with security and scalability!