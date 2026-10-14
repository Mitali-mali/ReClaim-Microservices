# ReClaim — Microservices College Viva Preparation Guide
## Top 20 Questions & Comprehensive Answers for 3rd Year (Semester 5) B.Tech CSE

---

### Q1. What is Service-Oriented Architecture (SOA)?
**Answer:**  
Service-Oriented Architecture (SOA) is an architectural approach in software engineering where application components deliver services to other components over a network via a communication protocol. 
- **Core Principles:** Loose coupling, service contract abstraction, service reusability, discoverability, and composability.
- **In ReClaim:** ReClaim is an evolution of SOA principles into fine-grained microservices. Instead of large enterprise service buses (ESB), ReClaim uses lightweight HTTP REST communication and an API Gateway.

---

### Q2. What is a Microservice, and how does it differ from a Monolith?
**Answer:**  
A microservice is an architectural pattern where an application is structured as a collection of small, autonomous services modeled around specific business domains.
- **Monolith:** All functionality (Auth, Items, Claims, Notifications) is packed inside a single deployable binary or codebase sharing a single unified database. A bug in item search can crash user login.
- **Microservices:** Each domain is independently deployable and scalable. In ReClaim, if `matching-service` is under heavy compute load calculating scores, `auth-service` continues functioning with zero degradation.

---

### Q3. Why did we divide ReClaim into these specific microservices?
**Answer:**  
We applied the **Single Responsibility Principle (SRP)** and Domain-Driven Design (DDD):
1. **API Gateway:** Single entry point, routing, SSL termination, and security headers (Helmet).
2. **Auth Service:** High security requirement; manages user identities and issues JWTs.
3. **Item Service:** High read/write transaction volume for Lost & Found listings.
4. **Matching Service:** Heavy computational logic (string matching, date math, rule scoring). Separating it prevents blocking I/O on item creation.
5. **Claim Service:** Manages business state transitions (`PENDING` -> `APPROVED`).
6. **Notification Service:** Asynchronous alert dispatcher.

---

### Q4. Why did we choose REST over other protocols?
**Answer:**  
- **Statelessness:** Each HTTP request contains all necessary context (including JWT credentials), allowing microservices to scale horizontally without sticky sessions.
- **Ubiquitous Tooling:** Standard HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`) map cleanly to CRUD operations.
- **Lightweight JSON Payloads:** Highly efficient for browser consumption (React) compared to verbose XML.

---

### Q5. What is the difference between SOAP and REST?
**Answer:**  

| Feature | SOAP (Simple Object Access Protocol) | REST (Representational State Transfer) |
|---|---|---|
| **Type** | Strict Protocol with XML specifications | Architectural style using standard HTTP |
| **Data Format** | Strictly XML | JSON, XML, Plain Text (ReClaim uses JSON) |
| **Contract** | WSDL (Web Services Description Language) | OpenAPI / Swagger specification |
| **Transport** | Can run over HTTP, SMTP, TCP | Primarily HTTP / HTTPS |
| **Overhead** | Heavy XML envelope, high bandwidth | Minimal JSON payload, fast parsing |
| **Why REST for ReClaim?** | SOAP adds unnecessary complexity and XML overhead for a modern React web application. |

---

### Q6. How is Node.js used in this project?
**Answer:**  
Node.js is an asynchronous, single-threaded, event-driven JavaScript runtime built on Chrome's V8 engine.
- In ReClaim, Node.js powers the API Gateway and all five backend microservices using Express.js.
- Its non-blocking I/O event loop makes it exceptionally fast for I/O-intensive microservice architectures where services constantly wait on database queries or inter-service HTTP requests.

---

### Q7. How do CRUD operations work in ReClaim?
**Answer:**  
CRUD (Create, Read, Update, Delete) maps to HTTP verbs handled by Express routes and Mongoose ODM:
- **Create:** `POST /api/items` creates a new Mongoose document via `Item.save()`.
- **Read:** `GET /api/items` retrieves items using `Item.find(query)`.
- **Update:** `PUT /api/items/:id/status` updates item status via `item.save()`.
- **Delete:** `DELETE /api/items/:id` deletes or soft-deletes via `Item.findByIdAndDelete()`.

---

### Q8. How does Docker work?
**Answer:**  
Docker packages an application and its entire runtime dependencies (Node.js version, npm packages, OS libraries) into a standardized unit called a **container**.
- Docker uses the Linux kernel features **Namespaces** (for process and network isolation) and **Cgroups** (for resource limiting: CPU/RAM).
- In ReClaim, running `docker compose up` starts isolated Node.js containers that run identically on Windows, Linux, or macOS.

---

### Q9. What is the difference between a Docker Image and a Docker Container?
**Answer:**  
- **Docker Image:** An immutable, read-only template built from a `Dockerfile` containing the application code, runtime libraries, and environment specifications. It is analogous to a **Class** in Object-Oriented Programming.
- **Docker Container:** A running, stateful instance of an image with a thin read-write layer on top. It is analogous to an **Object/Instance** of that Class. Multiple containers can be instantiated from a single image.

---

### Q10. What is the difference between a Virtual Machine (VM) and a Container?
**Answer:**  

| Parameter | Virtual Machine (VM) | Container (Docker) |
|---|---|---|
| **Virtualization Level** | Hardware level (Hypervisor: VMware, VirtualBox) | Operating System level (shares host kernel) |
| **Guest OS** | Full standalone OS per VM (GBs in size) | No guest OS; uses lightweight base image (MBs) |
| **Startup Time** | Minutes | Milliseconds to seconds |
| **Resource Efficiency** | High CPU & RAM overhead | Near bare-metal performance |
| **In ReClaim:** | Running 6 VMs would consume 16GB+ RAM. 6 Docker Alpine containers consume under 600MB RAM. |

---

### Q11. Describe Docker Architecture and Workflow.
**Answer:**  
Docker follows a client-server architecture:
1. **Docker Client (`docker` CLI):** The command-line tool used by the developer to issue commands (`docker build`, `docker run`).
2. **Docker Host (Docker Daemon `dockerd`):** Background process managing images, containers, networks, and storage volumes.
3. **Docker Registry (Docker Hub):** Central repository for storing and downloading public images (`mongo:6`, `node:18-alpine`).
- **Workflow:** `Dockerfile` -> `docker build` -> Image created -> `docker run` -> Container executing.

---

### Q12. How do microservices communicate in ReClaim?
**Answer:**  
ReClaim implements two communication patterns:
1. **External-to-Internal Communication:** Clients communicate strictly with the **API Gateway** on port `8080`. The Gateway acts as a reverse proxy forwarding requests to downstream services.
2. **Inter-Service Synchronous HTTP (Service Choreography):**
   - When calculating matches, `matching-service` calls `item-service` via `axios.get('http://item-service:5002/api/items')`.
   - When a claim is created, `claim-service` verifies the item with `item-service` and calls `notification-service` to alert the finder.

---

### Q13. What is Kubernetes and what problem does it solve?
**Answer:**  
Kubernetes (K8s) is an open-source container orchestration engine. While Docker runs individual containers on a single computer, Kubernetes manages thousands of containers across a cluster of servers:
- **Core capabilities:** Automated container scheduling, horizontal autoscaling, self-healing (restarting failed containers), rolling zero-downtime updates, service discovery, and load balancing.

---

### Q14. Explain the difference between a Pod, a Deployment, and a Service.
**Answer:**  
- **Pod:** The smallest deployable unit in Kubernetes. Wraps one (or more) tightly coupled containers sharing network IP and storage.
- **Deployment:** A controller that declares the desired state for Pods (e.g., "ensure 3 replicas of `auth-service` are running"). If a Pod crashes, the Deployment replaces it.
- **Service:** An abstraction that provides a stable IP address and DNS name across ephemeral Pods, load-balancing incoming traffic across healthy replicas.

---

### Q15. Describe Kubernetes Master (Control Plane) and Worker Node Architecture.
**Answer:**  
- **Control Plane Components:**
  - `kube-apiserver`: Front-end for the Kubernetes control plane.
  - `etcd`: Consistent, distributed key-value store holding cluster state.
  - `kube-scheduler`: Assigns new Pods to worker nodes based on resource capacity.
  - `kube-controller-manager`: Runs controller processes (e.g., node controller, replica controller).
- **Worker Node Components:**
  - `kubelet`: Agent ensuring containers described in PodSpecs are running.
  - `kube-proxy`: Maintains network rules on nodes allowing network communication.
  - `Container Runtime`: The software executing containers (containerd/Docker).

---

### Q16. How do Health Checks (Liveness and Readiness Probes) work in ReClaim?
**Answer:**  
Every microservice exposes a `/health` endpoint returning database connectivity status:
- **Readiness Probe:** Checks `GET /health` with `initialDelaySeconds: 5`. If MongoDB is not connected, the service returns `503 DEGRADED` and Kubernetes **stops sending user traffic** to that Pod until it recovers.
- **Liveness Probe:** Checks `GET /health` with `initialDelaySeconds: 15`. If an Express process deadlocks or crashes, the probe fails 3 consecutive times, and Kubernetes **kills and recreates the Pod automatically**.

---

### Q17. What is Helm and why did we use it?
**Answer:**  
Helm is the **Package Manager for Kubernetes**.
- **The Problem:** Deploying ReClaim manually requires applying 19 distinct YAML files (`kubectl apply`). Managing environment differences (Dev vs Prod) creates code duplication.
- **Helm's Solution:** Helm groups all manifests into a single parameterized **Chart** (`helm/reclaim/`). Changing `replicaCount: 3` in `values.yaml` scales the entire application with one command (`helm upgrade reclaim ./helm/reclaim`).

---

### Q18. Why is containerization useful for software engineering?
**Answer:**  
1. **Solves "Works on my machine" syndrome:** Guarantees runtime environment parity across developer laptops, CI/CD pipelines, and cloud clusters.
2. **Speed & Efficiency:** Containers launch in seconds and consume a fraction of host resources compared to VMs.
3. **Immutability:** Images cannot be modified once built, ensuring predictable deployments.
4. **Microservices Alignment:** Each service can be built with different versions or libraries without dependency conflicts.

---

### Q19. What are the advantages and limitations of Microservices?
**Answer:**  
- **Advantages:**
  - Independent deployment and scaling.
  - Fault isolation (one service crashing doesn't bring down the whole app).
  - Polyglot flexibility (services can use different languages or databases).
- **Limitations:**
  - Increased operational and network complexity.
  - Distributed transaction management (requires eventual consistency).
  - Difficult debugging and log tracing across multiple network boundaries.

---

### Q20. How could ReClaim be scaled to enterprise level in the future?
**Answer:**  
1. **Event-Driven Messaging (Kafka/RabbitMQ):** Replace synchronous HTTP calls with asynchronous event publishing for claims and notifications.
2. **Distributed Tracing (OpenTelemetry + Jaeger):** Track request latency across network hops through correlation IDs.
3. **Database Sharding:** Split MongoDB collections across sharded clusters.
4. **Ingress Controller (NGINX / Traefik):** Replace NodePort services with a production Ingress controller supporting TLS encryption and rate-limiting.
5. **Horizontal Pod Autoscaling (HPA):** Configure Kubernetes HPA to automatically spin up extra replicas when CPU utilization exceeds 75%.
