# ReClaim — Smart Lost & Found Management System Using Microservices Architecture

> **BTech CSE — Semester 5 Microservices Major Project**  
> **Student:** Solo Developer Project  
> **Tech Stack:** React (Vite) | Node.js (Express) | MongoDB | Docker | Kubernetes | Helm | Postman

---

## 1. Project Overview
**ReClaim** is a modern, cloud-native Lost & Found management platform built using a microservices architecture. Instead of a monolithic backend where all business logic shares one database and server, ReClaim is distributed into independent, loosely coupled microservices fronted by an API Gateway.

### Core Features:
- **JWT Authentication & Role Control:** Secure user registration, password hashing (`bcrypt`), and session-free token authentication.
- **Lost & Found Reporting:** Capture detailed item metadata (category, color, location, date, descriptions, images).
- **Rule-Based Smart Matching Engine:** Automated scoring algorithm (0-100%) that pairs reported Lost and Found items based on category, date proximity, color, and location similarity.
- **End-to-End Claim Lifecycle:** Users can submit proof-of-ownership claims; item reporters and admins can review, approve, or reject claims.
- **Asynchronous In-App Notifications:** Real-time event notifications generated upon claim submission and approval.
- **Enterprise Observability:** Deep health probes (`/health`) reporting uptime, system status, and live database readiness for Kubernetes self-healing.

---

## 2. Microservices Architecture & Syllabus Mapping

### High-Level Architecture Diagram
```
                     +-----------------------------------+
                     |      React Frontend (Vite)        |
                     |      Port 3000 (Docker/Node)      |
                     +-----------------+-----------------+
                                       |
                           HTTP REST   | Port 8080
                                       v
                     +-----------------------------------+
                     |            API Gateway            |
                     |  Reverse Proxy & Security (Helmet)|
                     +-----------------+-----------------+
                                       |
       +-------------------------------+-------------------------------+
       |               |               |               |               |
       v               v               v               v               v
+--------------+ +--------------+ +--------------+ +--------------+ +--------------+
| Auth Service | | Item Service | |Matching Svc  | | Claim Service| |Notification  |
|  Port 5001   | |  Port 5002   | |  Port 5003   | |  Port 5004   | |  Port 5005   |
+-------+------+ +-------+------+ +-------+------+ +-------+------+ +-------+------+
        |                |                |                |                |
        v                v                v                v                v
+--------------+ +--------------+ +--------------+ +--------------+ +--------------+
| reclaim_auth | | reclaim_item | |reclaim_match | |reclaim_claim | |reclaim_notif |
+--------------+ +--------------+ +--------------+ +--------------+ +--------------+
                     (Logical MongoDB Databases / Collections)
```

### Syllabus Concepts Demonstrated:
| Syllabus Unit | Key Concept | Implementation in ReClaim |
|---|---|---|
| **UNIT 1: SOA** | REST vs SOAP, Loose Coupling, Service Description | RESTful JSON APIs, independent services, zero database sharing across services. |
| **UNIT 2: Node.js** | Express.js, Routing, Async I/O, CRUD operations | Node.js microservices with Express routing, Mongoose ODM, and centralized error handling. |
| **UNIT 3: Docker** | Containers, Layered FS, Multi-stage builds, Compose | Lightweight Alpine Linux Dockerfiles, multi-stage React build, `docker-compose.yml` orchestration. |
| **UNIT 4: Kubernetes** | Pods, Deployments, Services, ConfigMaps, Probes, Helm | Full K8s manifests in `k8s/`, Liveness/Readiness probes on `/health`, and a full Helm chart in `helm/reclaim/`. |

---

## 3. Repository Structure

```text
reclaim/
├── frontend/                     # React 18 + Vite SPA with Bootstrap UI
├── api-gateway/                  # Reverse Proxy Gateway (Port 8080)
├── services/
│   ├── auth-service/             # JWT auth, user registration & login (Port 5001)
│   ├── item-service/             # Lost & Found CRUD operations (Port 5002)
│   ├── matching-service/         # Rule-based matching engine (Port 5003)
│   ├── claim-service/            # Claim verification & workflow (Port 5004)
│   └── notification-service/     # In-app notification dispatcher (Port 5005)
├── k8s/                          # Kubernetes Manifests & Scripts
│   ├── namespace.yaml
│   ├── configmaps/
│   ├── secrets/
│   ├── deployments/
│   ├── services/
│   ├── deploy-minikube.ps1
│   └── undeploy-minikube.ps1
├── helm/                         # Helm Chart
│   └── reclaim/
│       ├── Chart.yaml
│       ├── values.yaml
│       └── templates/
├── postman/                      # Postman Collection & Environment
│   ├── ReClaim_API_Collection.json
│   └── ReClaim_Environment.json
├── docs/                         # In-depth Technical Documentation
│   ├── Project_Architecture.md
│   ├── API_Documentation.md
│   ├── Minikube_Guide.md
│   ├── Helm_Guide.md
│   └── openapi.yaml
├── docker-compose.yml            # Multi-container local orchestration
├── .env.example                  # Template configuration file
└── README.md                     # Master Project Guide
```

---

## 4. How to Run the Project (3 Options)

### OPTION A: Run via Docker Compose (Recommended for Local Demo)
Ensure Docker Desktop is running, then:
```powershell
cd d:\Microproject\reclaim
docker compose up --build -d
```
- **React Frontend:** Open `http://localhost:3000`
- **API Gateway:** `http://localhost:8080`
- **MongoDB:** `localhost:27017`

To check running containers:
```powershell
docker compose ps
```
To view live logs:
```powershell
docker compose logs -f
```
To stop:
```powershell
docker compose down
```

---

### OPTION B: Run Locally on Kubernetes with Minikube
1. Start your local Minikube cluster:
   ```powershell
   minikube start --driver=docker --cpus=4 --memory=4096
   ```
2. Build images directly into Minikube's Docker daemon:
   ```powershell
   & minikube -p minikube docker-env --shell powershell | Invoke-Expression
   docker build -t reclaim-auth-service:latest ./services/auth-service
   docker build -t reclaim-item-service:latest ./services/item-service
   docker build -t reclaim-matching-service:latest ./services/matching-service
   docker build -t reclaim-claim-service:latest ./services/claim-service
   docker build -t reclaim-notification-service:latest ./services/notification-service
   docker build -t reclaim-api-gateway:latest ./api-gateway
   docker build -t reclaim-frontend:latest ./frontend
   ```
3. Deploy all Kubernetes manifests:
   ```powershell
   cd d:\Microproject\reclaim\k8s
   .\deploy-minikube.ps1
   ```
4. Access the Frontend in your browser:
   ```powershell
   minikube service frontend -n reclaim
   ```

---

### OPTION C: Deploy using Helm
```powershell
cd d:\Microproject\reclaim
helm install reclaim ./helm/reclaim --namespace reclaim --create-namespace
```
Verify the release:
```powershell
helm list -n reclaim
kubectl get pods -n reclaim
```
To uninstall:
```powershell
helm uninstall reclaim -n reclaim
```

---

## 5. End-to-End College Demonstration Flow

Follow this exact 15-step sequence during your project evaluation / viva:

1. **Register a User:** Navigate to `http://localhost:3000/register` and create an account (`student1@college.edu`).
2. **Login:** Log in at `http://localhost:3000/login` to obtain an authentication JWT.
3. **Report Lost Item:** Click **Report Item**, select **Lost**, enter `Dell Laptop`, category `Electronics`, color `Silver`, location `Library 2nd Floor`.
4. **Report Found Item:** Log in with another account (or report as another user), select **Found**, enter `Dell Inspiron`, category `Electronics`, color `Silver`, location `Library`.
5. **Smart Matching:** Open the lost item's details. The **Matching Service** automatically calculates an 85%+ score based on category, color, and location match!
6. **Submit Claim:** Click **Claim this Item** on the matched card and provide proof of ownership.
7. **Cross-Service Notification:** Notice how the Claim Service automatically dispatches an alert to the Notification Service!
8. **Check Alerts:** Click **Alerts** in the navbar to see the new claim notification.
9. **Review & Approve Claim:** Approve the claim to update the item status to `RESOLVED`.
10. **Verify My Claims:** View the updated status in **My Claims**.
11. **Show Docker Containers:** Run `docker compose ps` to show all 8 containers active with healthy states.
12. **Show Kubernetes Pods:** Run `kubectl get pods -n reclaim` to display zero restarts and running status.
13. **Show Health Probes:** Run `curl http://localhost:8080/health` and `kubectl describe pod <auth-pod> -n reclaim` to prove Liveness/Readiness probes are working.
14. **Show Helm Chart:** Run `helm list -n reclaim` and `helm history reclaim -n reclaim`.
15. **Show Postman Test Suite:** Run the automated collection in Postman with green test assertions.

---

## 6. Testing with Postman
1. Open Postman.
2. Click **Import** -> Select `postman/ReClaim_API_Collection.json`.
3. Import the Environment: `postman/ReClaim_Environment.json`.
4. Run the collection. Test scripts automatically extract the JWT token on login and pass it to protected routes!

---

## 7. License & Credits
Developed as an academic solo microservices project for BTech CSE Semester 5. Free and open source.
