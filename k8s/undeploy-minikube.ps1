# Cleanup script for ReClaim Kubernetes deployment
Write-Host "=== Undeploying ReClaim from Kubernetes ===" -ForegroundColor Red

Write-Host "Deleting Deployments and Services..." -ForegroundColor Yellow
kubectl delete -f ./deployments/ -n reclaim --ignore-not-found=true
kubectl delete -f ./services/ -n reclaim --ignore-not-found=true
kubectl delete -f ./configmaps/ -n reclaim --ignore-not-found=true
kubectl delete -f ./secrets/ -n reclaim --ignore-not-found=true

Write-Host "Deleting Namespace 'reclaim'..." -ForegroundColor Yellow
kubectl delete namespace reclaim --ignore-not-found=true

Write-Host "Cleanup completed." -ForegroundColor Green
