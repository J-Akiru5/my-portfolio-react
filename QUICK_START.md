# 🚀 Quick Start - Deploy to Cloud Run in 30 Minutes

**For impatient developers who want to go live FAST!**

---

## ⚡ Speed Run (30 minutes)

### 1️⃣ Build Docker Image Locally (2 min)
```powershell
# In PowerShell (Windows)
cd C:\xampp\htdocs\profile-react

# Build image
docker build -t portfolio-test .

# Test locally
docker run -p 8080:8080 portfolio-test

# Visit: http://localhost:8080
# Press Ctrl+C to stop
```

**Expected:** ✅ "Portfolio Server Running" message

---

### 2️⃣ Setup Google Cloud (10 min)

```powershell
# Login
gcloud auth login

# Create project (use your own project ID)
gcloud projects create jeff-portfolio-2026 --name="Portfolio Contest"

# Set project
gcloud config set project jeff-portfolio-2026

# Enable APIs (takes 2-3 min)
gcloud services enable run.googleapis.com cloudbuild.googleapis.com
```

**Expected:** ✅ "Operation completed successfully"

---

### 3️⃣ Deploy to Cloud Run (15 min)

```powershell
# Deploy (takes 10-15 minutes first time)
gcloud run deploy portfolio-react `
  --source . `
  --region us-central1 `
  --allow-unauthenticated `
  --memory 512Mi `
  --port 8080

# When asked "Do you want to continue?" → Type: Y
```

**Expected:** 
```
✓ Building and deploying... Done.
Service URL: https://portfolio-react-xxxxx-uc.a.run.app
```

**🎉 COPY THIS URL! Visit it in browser!**

---

### 4️⃣ Add Environment Variables (3 min)

**Via Console (Easiest):**
1. Go to: https://console.cloud.google.com/run
2. Click your service
3. Click "Edit & Deploy New Revision"
4. Scroll to "Variables & Secrets"
5. Click "Add Variable" for each from your `.env` file
6. Click "Deploy"

**Via CLI:**
```powershell
# Quick method - paste your values
gcloud run services update portfolio-react `
  --region us-central1 `
  --set-env-vars "VITE_FIREBASE_API_KEY=xxx,VITE_FIREBASE_AUTH_DOMAIN=xxx,GEMINI_API_KEY=xxx"
```

---

### 5️⃣ Setup Custom Domain (Optional - 5 min)

```powershell
# Map domain
gcloud run domain-mappings create `
  --service portfolio-react `
  --domain gcp.jeffdev.studio `
  --region us-central1

# Add DNS record at your domain provider:
# Type: CNAME
# Name: gcp
# Value: ghs.googlehosted.com
```

Wait 15-30 min for DNS → Visit: https://gcp.jeffdev.studio

---

## 🤖 GitHub Actions Setup (10 min)

### Create Service Account
```powershell
# Create service account
gcloud iam service-accounts create github-actions

# Get email
gcloud iam service-accounts list

# Grant permissions (replace YOUR_PROJECT_ID)
$PROJECT_ID = "jeff-portfolio-2026"
$SA_EMAIL = "github-actions@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:${SA_EMAIL}" `
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:${SA_EMAIL}" `
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:${SA_EMAIL}" `
  --role="roles/iam.serviceAccountUser"

# Create key
gcloud iam service-accounts keys create gcp-key.json `
  --iam-account="${SA_EMAIL}"
```

### Add to GitHub Secrets
1. Go to: https://github.com/J-Akiru5/my-portfolio-react/settings/secrets/actions
2. Click "New repository secret"

**Secret 1:**
- Name: `GCP_PROJECT_ID`
- Value: `jeff-portfolio-2026` (your project ID)

**Secret 2:**
- Name: `GCP_SA_KEY`
- Value: (paste entire content of `gcp-key.json`)

### Test Auto-Deploy
```powershell
# Make change
git add .
git commit -m "test: auto-deploy"
git push origin main

# Check: https://github.com/J-Akiru5/my-portfolio-react/actions
```

**Expected:** ✅ Green checkmark in ~10 min

---

## ✅ Done!

**Your URLs:**
- Cloud Run: https://portfolio-react-xxxxx-uc.a.run.app
- Custom Domain: https://gcp.jeffdev.studio (after DNS)
- Auto-Deploy: Enabled ✅

**Next Steps:**
- Test all features work
- Submit to contest: https://dev.to/challenges/new-year-new-you-google-ai-2025-12-31
- Win $1,000! 🏆

---

## 🆘 Common Issues

**"Docker not found"**
```powershell
# Install: https://www.docker.com/products/docker-desktop
# Restart computer
```

**"Permission denied" in gcloud**
```powershell
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

**"Build failed"**
```powershell
# Check package.json syntax
npm install --legacy-peer-deps

# Try: docker build --no-cache -t portfolio-test .
```

**"Domain not working"**
```powershell
# Wait 15-60 min for DNS + SSL
# Check: nslookup gcp.jeffdev.studio
```

---

**Need detailed guide?** See [DEPLOYMENT_PLAN.md](DEPLOYMENT_PLAN.md)
