# ReClaim — Smart Lost & Found Management System
## Architecture & Design Document

### 1. Complete Architecture
The system follows a standard Microservices Architecture with a centralized API Gateway.

**Flow:**
`Client (React)` -> `API Gateway (Node.js)` -> `Microservices (Node.js/Express)` -> `MongoDB`

**Components:**
- **Frontend (React.js + Vite):** Single Page Application for user and admin interfaces.
- **API Gateway:** Entry point for all client requests. Handles request routing and basic verification.
- **Microservices:** Independent Node.js applications handling specific business domains.
- **Database:** MongoDB. To adhere to microservice patterns, each service will logically own its data (either separate databases or strictly separate collections accessed only by that service).
- **Deployment:** Docker for containerization, Kubernetes for orchestration, Helm for packaging.

### 2. Final Folder Structure
```text
d:\Microproject\reclaim\
│
├── frontend/                 # React application
│
├── services/
│   ├── auth-service/         # User auth and profiles
│   ├── item-service/         # Lost/Found items CRUD
│   ├── matching-service/     # Rule-based matching engine
│   ├── claim-service/        # Claims management
│   └── notification-service/ # In-app notifications
│
├── api-gateway/              # Main routing gateway
│
├── docker-compose.yml        # Local Docker composition
├── k8s/                      # Kubernetes manifests
│   ├── namespace.yaml
│   ├── auth-service/
│   ├── item-service/
│   └── ...
├── helm/
│   └── reclaim/              # Helm chart
│
├── postman/                  # Postman collection
├── docs/                     # Project documentation
├── .env.example              # Environment variables template
└── README.md                 # Setup guide
```

### 3. Database Design
We will use MongoDB. Each service owns its collection(s):

**Auth Service (DB: reclaim_auth)**
- `users`: `_id`, `name`, `email`, `passwordHash`, `role` (user/admin), `createdAt`

**Item Service (DB: reclaim_item)**
- `items`: `_id`, `reporterId`, `type` (lost/found), `category`, `name`, `description`, `location`, `date`, `color`, `brand`, `status` (active/resolved), `imageUrl`, `createdAt`

**Matching Service (DB: reclaim_matching)**
- `matches`: `_id`, `lostItemId`, `foundItemId`, `score`, `matchReasons` (array), `status` (pending/reviewed), `createdAt`

**Claim Service (DB: reclaim_claim)**
- `claims`: `_id`, `itemId`, `claimerId`, `proofDescription`, `status` (PENDING, UNDER_REVIEW, APPROVED, REJECTED, RESOLVED), `createdAt`

**Notification Service (DB: reclaim_notification)**
- `notifications`: `_id`, `userId`, `title`, `message`, `isRead` (boolean), `createdAt`

### 4. Service Responsibilities
1. **API Gateway:** Routes incoming HTTP requests from the frontend to the appropriate microservice. E.g., `/api/auth/*` goes to Auth Service.
2. **Auth Service:** Issues JWT tokens, verifies user credentials, manages user profiles and roles.
3. **Item Service:** Core CRUD operations for reporting lost and found items, searching with filters.
4. **Matching Service:** A background/triggered service that compares lost and found items. Calculates a match score based on category, location, color, and date.
5. **Claim Service:** Allows users to claim a found item (or claim that a lost item is theirs). Handles the approval workflow.
6. **Notification Service:** Stores and serves alerts (e.g., "Your claim was approved", "We found a match!").

### 5. API Plan
All requests go through API Gateway (e.g., `http://localhost:8080`)

**Auth API (Auth Service)**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Authenticate and get JWT
- `GET /api/auth/profile` - Get current user profile (JWT required)

**Item API (Item Service)**
- `POST /api/items/lost` - Report lost item
- `POST /api/items/found` - Report found item
- `GET /api/items` - Search/list items with filters
- `GET /api/items/:id` - Get item details

**Matching API (Matching Service)**
- `GET /api/matches/:itemId` - Get potential matches for an item
- `POST /api/matches/trigger` - Manually trigger matching run (Admin)

**Claim API (Claim Service)**
- `POST /api/claims` - Submit a claim
- `GET /api/claims/my-claims` - Get user's claims
- `GET /api/claims` - Admin: view all claims
- `PUT /api/claims/:id/status` - Admin/Reporter: Update claim status

**Notification API (Notification Service)**
- `GET /api/notifications` - Get user's notifications
- `PUT /api/notifications/:id/read` - Mark as read

**System APIs**
- `GET /api/*/health` - Health check for each service

### 6. Development Roadmap
- **PHASE 1:** Project architecture and requirements (CURRENT)
- **PHASE 2:** Create project folders and initialize all projects.
- **PHASE 3:** Create MongoDB/database design.
- **PHASE 4:** Build Auth/User Service.
- **PHASE 5:** Build Item Service.
- **PHASE 6:** Build Matching Service.
- **PHASE 7:** Build Claim Service.
- **PHASE 8:** Build Notification Service.
- **PHASE 9:** Build API Gateway.
- **PHASE 10:** Build React frontend.
- **PHASE 11:** Connect frontend to API Gateway.
- **PHASE 12:** Implement complete end-to-end workflow.
- **PHASE 13:** Add validation, error handling and security.
- **PHASE 14:** Create Dockerfiles.
- **PHASE 15:** Create Docker Compose.
- **PHASE 16:** Test complete Docker deployment.
- **PHASE 17:** Create Kubernetes manifests.
- **PHASE 18:** Deploy using Minikube.
- **PHASE 19:** Add health checks.
- **PHASE 20:** Create Helm chart.
- **PHASE 21:** Create Postman collection/API documentation.
- **PHASE 22:** Create README and complete setup guide.
- **PHASE 23:** Create project report material.
- **PHASE 24:** Prepare viva questions and answers.
