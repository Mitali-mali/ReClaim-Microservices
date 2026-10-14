# PowerShell deployment script for local Minikube cluster
Write-Host "=== Deploying ReClaim to Kubernetes (Minikube) ===" -ForegroundColor Cyan

# Check if minikube is running
try {
    minikube status
    Write-Host "Configuring local environment to use Minikube Docker daemon..." -ForegroundColor Yellow
    & minikube -p minikube docker-env --shell powershell | Invoke-Expression
} catch {
    Write-Host "Note: Minikube status check skipped or using active kubectl context." -ForegroundColor Gray
}

# 1. Apply Namespace
Write-Host "`n[1/4] Applying Namespace..." -ForegroundColor Green
kubectl apply -f ./namespace.yaml

# 2. Apply ConfigMap & Secrets
Write-Host "`n[2/4] Applying ConfigMaps and Secrets..." -ForegroundColor Green
kubectl apply -f ./configmaps/
kubectl apply -f ./secrets/

# 3. Apply Deployments and Services
Write-Host "`n[3/4] Applying Deployments and Services..." -ForegroundColor Green
kubectl apply -f ./deployments/
kubectl apply -f ./services/

# 4. Summary
Write-Host "`n[4/4] Fetching Cluster Status..." -ForegroundColor Green
Write-Host "`n--- Pods in 'reclaim' namespace ---" -ForegroundColor Cyan
kubectl get pods -n reclaim -o wide

Write-Host "`n--- Services in 'reclaim' namespace ---" -ForegroundColor Cyan
kubectl get services -n reclaim

Write-Host "`n=== Deployment Completed ===" -ForegroundColor Green
Write-Host "To access Frontend in Minikube, run: minikube service frontend -n reclaim" -ForegroundColor Yellow
Write-Host "To access API Gateway in Minikube, run: minikube service api-gateway -n reclaim" -ForegroundColor Yellow
