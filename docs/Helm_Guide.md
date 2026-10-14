# Helm Guide for ReClaim

This document covers Helm concepts from **Unit 4 (Kubernetes & Cloud-native Architecture)** and explains how to manage the ReClaim microservices chart.

---

## 1. What is Helm?
Helm is the **Package Manager for Kubernetes**.
- **Analogy:** Just as `npm` packages Node.js libraries, `Helm` packages complex Kubernetes applications into repeatable, version-controlled **Charts**.
- **Why use Helm in Microservices?**
  Instead of running 19 separate `kubectl apply` commands for every deployment, service, configmap, and secret, Helm deploys the entire ReClaim ecosystem in a single command (`helm install reclaim ./helm/reclaim`).

---

## 2. Core Concepts
| Concept | Description |
|---|---|
| **Chart** | A collection of files inside `helm/reclaim/` describing Kubernetes manifests. |
| **Values** | Configuration parameters defined in `values.yaml` (replica counts, ports, images). |
| **Release** | A running instance of a chart inside the Kubernetes cluster. |
| **Repository** | A place where packaged charts can be stored and shared. |

---

## 3. Installing Helm on Windows
```powershell
winget install Helm.Helm
# or
choco install kubernetes-helm
```
Verify installation:
```powershell
helm version
```

---

## 4. Deploying ReClaim with Helm

### Step 1: Lint & Validate the Chart
Verify that the chart syntax and template logic are 100% valid:
```powershell
cd d:\Microproject\reclaim
helm lint ./helm/reclaim
```

### Step 2: Render Manifests Locally (Dry Run)
Inspect the generated Kubernetes YAML without connecting to a cluster:
```powershell
helm template reclaim ./helm/reclaim
```

### Step 3: Install the Chart
Deploy ReClaim to your Kubernetes cluster under the `reclaim` namespace:
```powershell
helm install reclaim ./helm/reclaim --namespace reclaim --create-namespace
```

### Step 4: Verify the Release
```powershell
helm list -n reclaim
kubectl get all -n reclaim
```

---

## 5. Upgrading & Customizing Deployments

### Scaling Replicas Dynamically:
To change replica counts or images on the fly without modifying files:
```powershell
# Scale all microservices to 2 replicas
helm upgrade reclaim ./helm/reclaim --namespace reclaim --set replicaCount=2
```

### Using Custom Values Files:
You can create a `production-values.yaml` and apply it:
```powershell
helm upgrade reclaim ./helm/reclaim --namespace reclaim -f production-values.yaml
```

---

## 6. Rollback & Uninstalling

### View Release History:
```powershell
helm history reclaim -n reclaim
```

### Rollback to Previous Version:
If an upgrade causes errors, rollback instantaneously:
```powershell
helm rollback reclaim 1 -n reclaim
```

### Uninstall Release:
```powershell
helm uninstall reclaim --namespace reclaim
```
