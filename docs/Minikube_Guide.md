# Minikube Local Deployment Guide for ReClaim

This guide outlines step-by-step instructions for running the ReClaim microservices on your local Kubernetes cluster using **Minikube**.

---

## 1. Prerequisites
- **Minikube**: Download and install from [minikube.sigs.k8s.io](https://minikube.sigs.k8s.io/docs/start/) or install via winget / chocolatey:
  ```powershell
  winget install Kubernetes.minikube
  ```
- **Docker Desktop**: Running with WSL2 or Hyper-V enabled.
- **kubectl**: Installed (verified).

---

## 2. Start Minikube Cluster
Start your local single-node Kubernetes cluster:
```powershell
minikube start --driver=docker --cpus=4 --memory=4096
```

Verify the cluster status:
```powershell
minikube status
kubectl cluster-info
```

---

## 3. Build Docker Images Inside Minikube
To allow Minikube to use locally built images without pushing to Docker Hub, configure your shell to point to Minikube's internal Docker daemon:

In PowerShell:
```powershell
& minikube -p minikube docker-env --shell powershell | Invoke-Expression
```

Now build the images directly into Minikube's Docker daemon:
```powershell
cd d:\Microproject\reclaim

docker build -t reclaim-auth-service:latest ./services/auth-service
docker build -t reclaim-item-service:latest ./services/item-service
docker build -t reclaim-matching-service:latest ./services/matching-service
docker build -t reclaim-claim-service:latest ./services/claim-service
docker build -t reclaim-notification-service:latest ./services/notification-service
docker build -t reclaim-api-gateway:latest ./api-gateway
docker build -t reclaim-frontend:latest ./frontend
```

---

## 4. Deploy Manifests to Kubernetes
Run the automated deployment script:
```powershell
cd d:\Microproject\reclaim\k8s
.\deploy-minikube.ps1
```

Or deploy manually step-by-step:
```powershell
kubectl apply -f namespace.yaml
kubectl apply -f configmaps/
kubectl apply -f secrets/
kubectl apply -f deployments/
kubectl apply -f services/
```

---

## 5. Verify & Monitor Deployments
Check the status of all pods and services in the `reclaim` namespace:

```powershell
# List all pods
kubectl get pods -n reclaim

# List all deployments and replica counts
kubectl get deployments -n reclaim

# List all services and NodePorts
kubectl get services -n reclaim

# Describe a specific pod if troubleshooting
kubectl describe pod <pod-name> -n reclaim

# View real-time logs of a microservice
kubectl logs -f deployment/api-gateway -n reclaim
kubectl logs -f deployment/auth-service -n reclaim
kubectl logs -f deployment/item-service -n reclaim
```

---

## 6. Accessing the Application
Since Minikube runs inside a virtual network/container, use `minikube service` to open or tunnel ports to your Windows browser:

```powershell
# Open Frontend in browser
minikube service frontend -n reclaim

# Or get the URL directly:
minikube service frontend -n reclaim --url

# Port-forward API Gateway to localhost:8080 (optional alternative):
kubectl port-forward svc/api-gateway 8080:8080 -n reclaim
```

---

## 7. Undeploy and Teardown
To cleanly remove all resources from the cluster:
```powershell
cd d:\Microproject\reclaim\k8s
.\undeploy-minikube.ps1
```

To stop or delete the Minikube virtual machine:
```powershell
minikube stop
# or
minikube delete
```
