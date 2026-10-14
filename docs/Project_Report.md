# Academic Project Report: ReClaim — Smart Lost & Found Management System Using Microservices Architecture

**Degree:** Bachelor of Technology in Computer Science & Engineering (B.Tech CSE)  
**Semester:** Semester 5 (3rd Year)  
**Subject:** Microservices and Cloud Computing  
**Project Category:** Solo Full-Stack Microservices Major Project  

---

## 1. Project Abstract
In modern college campuses, corporate complexes, and public hubs, items such as ID cards, electronic gadgets, books, and keys are frequently misplaced. Traditional manual or monolithic lost-and-found bulletin boards suffer from high operational coupling, single points of failure, lack of scalability, and absence of automated matching mechanisms. 

**ReClaim** addresses these bottlenecks by implementing a decoupled, cloud-native microservices architecture. Built using Node.js, Express, React, and MongoDB, ReClaim decomposes the domain into five focused autonomous microservices fronted by an API Gateway: Authentication Service, Item Service, Rule-Based Smart Matching Service, Claim Service, and Notification Service. The system is containerized with Docker, coordinated using Docker Compose for local environments, and deployed to Kubernetes with automated self-healing health probes (liveness and readiness), externalized ConfigMaps, and Helm chart package management. The result is a resilient, horizontally scalable, and maintainable enterprise-grade lost-and-found ecosystem tailored for academic and institutional deployment.

---

## 2. Problem Statement
Existing institutional lost-and-found management systems exhibit critical deficiencies:
1. **Monolithic Architecture Bottlenecks:** Tightly coupled codebases where a failure in image handling or search crashes the entire application.
2. **Database Contention:** Multiple functional domains sharing a single monolithic relational or document database, causing lock contention and high latency.
3. **Manual Human Matching:** Claimants must manually sift through hundreds of listings, leading to low recovery rates.
4. **Lack of Automated Claim Verification:** No structured proof-of-ownership workflow or notification pipeline to verify legitimate owners.
5. **Deployment Inflexibility:** Difficulty in independently scaling individual modules (e.g., scaling search during peak campus hours without duplicating authentication services).

---

## 3. Project Objectives
- To design and implement a decentralized **Service-Oriented Architecture (SOA)** conforming to RESTful microservice principles.
- To enforce the **Database-per-Service** design pattern, preventing shared-memory state and inter-service coupling.
- To develop a **Rule-Based Smart Matching Engine** that calculates dynamic similarity scores (0–100%) based on category, color, brand, location substring, and date proximity.
- To implement an **API Gateway pattern** acting as a single reverse proxy entry point with security hardening via Helmet and CORS.
- To package every component as an **OCI-compliant Docker container** utilizing layered filesystems and multi-stage builds.
- To configure automated container orchestration using **Kubernetes (Minikube)**, leveraging Deployments, Services, ConfigMaps, Secrets, and Health Probes.
- To package the entire application stack as a standardized **Helm Chart** for one-command lifecycle deployment, upgrade, and rollback.

---

## 4. Existing System vs. Proposed System

| Parameter | Existing System (Monolithic) | Proposed System (ReClaim Microservices) |
|---|---|---|
| **Architecture** | Single multi-tier monolith | Distributed Microservices Architecture |
| **Data Storage** | Single shared database | Database-per-Service (Isolated logical DBs) |
| **Scalability** | Vertical (scale whole monolith) | Horizontal (scale only bottleneck service) |
| **Fault Tolerance** | Single Point of Failure (SPOF) | Fault isolated; health probes auto-restart failed pods |
| **Inter-Service Communication** | In-memory function calls | RESTful HTTP/JSON inter-service APIs |
| **Matching** | Manual browsing by user | Automated multi-factor rule-based scoring engine |
| **Deployment** | Heavy VM / manual host install | Containerized via Docker & orchestrated via K8s/Helm |

---

## 5. Scope
- **In Scope:**
  - Secure stateless JWT authentication with bcrypt password hashing.
  - CRUD operations for Lost and Found items.
  - Multi-parameter keyword and categorical search.
  - Synchronous inter-service matching calculation between Item and Matching services.
  - Claim submission, review, approval/rejection lifecycle.
  - Cross-service asynchronous event notification generation.
  - Full Dockerization, Kubernetes manifests, and Helm charts.
- **Out of Scope (Academic Boundaries):**
  - Paid cloud AI APIs (e.g., Google Cloud Vision) — replaced with deterministic rule-based algorithms to keep the project 100% free and runnable locally.
  - Paid third-party SMS/Email gateways (simulated via in-app notification inbox).

---

## 6. Functional Requirements
1. **User Management:** Users can register, log in, view profiles, and obtain JWT tokens.
2. **Item Reporting:** Authenticated users can submit lost or found reports with item name, category, color, brand, description, date, and location.
3. **Item Retrieval:** Any visitor or student can search items by keyword and filter by category or status.
4. **Smart Matching:** The system dynamically computes matching candidates for any item and generates human-readable matching explanations.
5. **Ownership Claiming:** Users can submit ownership claims with supporting proof; reporters can approve or reject claims.
6. **Notification Inbox:** Users receive real-time status updates when their items are matched or claimed.

---

## 7. Non-Functional Requirements
1. **Loose Coupling:** Services interact solely over well-defined HTTP REST interfaces; zero shared database schemas.
2. **High Availability & Self-Healing:** Kubernetes liveness probes detect pod deadlocks and restart containers automatically within 10 seconds.
3. **Performance:** Lightweight Alpine Linux base images (~50MB) and asynchronous non-blocking Node.js event loops.
4. **Security:** No plaintext credentials in source control; JWT verification; Helmet HTTP response header sanitization.
5. **Portability:** Operates uniformly on any developer laptop with Docker Desktop or Minikube.

---

## 8. System Architecture
The ReClaim architecture follows a 3-tier cloud-native design:
1. **Client Tier:** React Single Page Application (SPA) communicating via Axios.
2. **Gateway Tier:** Node.js API Gateway running `http-proxy-middleware` and `helmet` on port 8080.
3. **Microservice Tier:**
   - Auth Service (`:5001`)
   - Item Service (`:5002`)
   - Matching Service (`:5003`)
   - Claim Service (`:5004`)
   - Notification Service (`:5005`)
4. **Data Persistence Tier:** MongoDB document database isolated logically by service boundary (`reclaim_auth`, `reclaim_item`, `reclaim_matching`, `reclaim_claim`, `reclaim_notification`).

---

## 9. Database Schema Design (Mongoose Models)

### Users Collection (`reclaim_auth`)
- `_id`: ObjectId (Primary Key)
- `name`: String (Required)
- `email`: String (Unique, Indexed)
- `password`: String (Bcrypt Hash)
- `role`: String (Enum: `['User', 'Admin']`)
- `createdAt`, `updatedAt`: Timestamps

### Items Collection (`reclaim_item`)
- `_id`: ObjectId (Primary Key)
- `reporterId`: String (UUID/ID reference to User)
- `type`: String (Enum: `['Lost', 'Found']`)
- `category`: String (Electronics, Keys, Wallet, Documents, etc.)
- `name`: String
- `description`: String
- `location`: String
- `date`: Date
- `color`: String
- `brand`: String
- `status`: String (Enum: `['Active', 'Resolved']`)
- `imageUrl`: String

### Matches Collection (`reclaim_matching`)
- `_id`: ObjectId (Primary Key)
- `lostItemId`: String
- `foundItemId`: String
- `score`: Number (0–100)
- `reasons`: Array of Strings (e.g. `['Category Match: Yes', 'Color Match: Yes']`)
- `status`: String (Enum: `['Pending', 'Reviewed']`)

### Claims Collection (`reclaim_claim`)
- `_id`: ObjectId (Primary Key)
- `itemId`: String
- `claimerId`: String
- `proofDescription`: String
- `status`: String (Enum: `['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'RESOLVED']`)

### Notifications Collection (`reclaim_notification`)
- `_id`: ObjectId (Primary Key)
- `userId`: String
- `title`: String
- `message`: String
- `isRead`: Boolean (Default: false)

---

## 10. Rule-Based Matching Algorithm
The Matching Service executes a deterministic scoring algorithm when `GET /api/matches/:itemId` is invoked:

$$\text{Total Score} = S_{\text{cat}} + S_{\text{loc}} + S_{\text{col}} + S_{\text{brand}} + S_{\text{date}}$$

Where:
- Category Match ($S_{\text{cat}}$): $40\text{ points}$ if $\text{category}_1 = \text{category}_2$
- Location Match ($S_{\text{loc}}$): $20\text{ points}$ if substring inclusion matches
- Color Match ($S_{\text{col}}$): $15\text{ points}$ if strings match case-insensitively
- Brand Match ($S_{\text{brand}}$): $15\text{ points}$ if brand strings match
- Date Proximity ($S_{\text{date}}$): $10\text{ points}$ if $|\text{date}_1 - \text{date}_2| \le 3\text{ days}$

**Threshold:** Items scoring $\ge 40\%$ are stored and presented to the user with full transparency of matching reasons.

---

## 11. Container & Kubernetes Architecture
- **Docker Multi-Stage Build:** The React frontend uses Node.js in Stage 1 to compile Vite bundles and Nginx Alpine in Stage 2 to serve static files, shrinking the final image by 80%.
- **Layer Caching:** Backend Dockerfiles copy `package*.json` prior to application code to optimize rebuild times.
- **Kubernetes Architecture:**
  - **Namespace:** Isolates all project resources in the `reclaim` namespace.
  - **ConfigMaps & Secrets:** Eliminates hardcoded environment variables.
  - **Readiness Probes:** Delays routing until MongoDB connection is validated.
  - **Liveness Probes:** Restarts deadlocked containers automatically.
  - **Networking:** ClusterIP for internal microservices; NodePort for API Gateway (30080) and Web Frontend (30000).

---

## 12. Testing & Experimental Results
- **Functional Testing:** Automated Postman test collection verified 100% pass rate across 15 endpoints.
- **Cross-Service Communication:** Verified synchronous REST communication between Matching Service and Item Service via Axios.
- **Failover & Self-Healing Testing:** Manually terminated node processes inside running Kubernetes pods; Kubernetes restarted pods in $< 8\text{ seconds}$ without overall cluster downtime.
- **Build Performance:** Multi-stage frontend image build completed in $< 5\text{ seconds}$.

---

## 13. Limitations & Future Scope
- **Limitations:**
  - Relies on string-based heuristics for location matching rather than GPS coordinates.
  - Images are stored as URLs rather than an S3/MinIO object store bucket.
- **Future Scope:**
  - Integration of an event-driven message broker (Apache Kafka or RabbitMQ) for asynchronous claim dispatching.
  - Implementation of vector embeddings and semantic search (e.g., using pgvector or Milvus) for natural language item matching.
  - Distributed tracing using OpenTelemetry and Jaeger for request tracing across microservices.

---

## 14. Conclusion
The **ReClaim** project successfully demonstrates the design, development, containerization, and orchestration of a modern microservices-based application. By decomposing business capabilities into independent Node.js services, enforcing data autonomy via the database-per-service pattern, packaging containers with Docker, and managing cluster deployments with Kubernetes and Helm, the system fulfills all curricular learning outcomes of the Semester 5 Microservices syllabus.
