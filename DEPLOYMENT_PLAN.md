# 🚀 Complete Google Cloud Run Deployment Plan
## For Google AI Portfolio Contest - February 1, 2026 Deadline

---

## 📋 Overview

This plan will guide you through deploying your portfolio to Google Cloud Run with automated CI/CD, custom domain, and production-ready setup.

**Total Time**: ~2-3 hours (first time)  
**Future Deployments**: ~2 minutes (automated)

---

## ✅ Pre-Flight Checklist

Before starting, ensure you have:

- [ ] Google Cloud Account (with billing enabled)
- [ ] Domain access to `jeffdev.studio` DNS settings
- [ ] Your `.env` file with all credentials
- [ ] Git repository pushed to GitHub
- [ ] Docker installed (for local testing)
- [ ] gcloud CLI installed

---

## 🎯 Phase 1: Local Testing (30 minutes)

### Step 1.1: Install Docker Desktop
If not installed:
- Download: https://www.docker.com/products/docker-desktop
- Install and restart your computer
- Verify: `docker --version`

### Step 1.2: Build Docker Image
```bash
# Navigate to project directory
cd C:\xampp\htdocs\profile-react

# Build the Docker image (this takes 5-10 minutes first time)
docker build -t portfolio-test .

# You should see:
# ✓ [builder 1/6] Building...
# ✓ [builder 2/6] Installing dependencies...
# ✓ Successfully built...
```

**Common Issues:**
- ❌ "docker: command not found" → Install Docker Desktop
- ❌ "npm install failed" → Check package.json syntax
- ❌ Build takes forever → Normal for first build (creates cache)

### Step 1.3: Run Container Locally
```bash
# Run without environment variables (basic test)
docker run -p 8080:8080 portfolio-test

# You should see:
# ╔════════════════════════════════════════════╗
# ║  🚀 Portfolio Server Running              ║
# ║  📍 Port: 8080                            ║
# ╚════════════════════════════════════════════╝
```

### Step 1.4: Test Locally
Open browser: http://localhost:8080

**Expected Results:**
- ✅ Homepage loads
- ✅ `/api/health` returns `{"status":"healthy"}`
- ⚠️ Firebase features may not work (no env vars yet)

Press `Ctrl+C` to stop the container.

### Step 1.5: Test with Environment Variables
```bash
# Create .env.local file (already gitignored)
cp .env .env.local

# Edit .env.local with your real values
notepad .env.local

# Run with environment variables
docker run -p 8080:8080 --env-file .env.local portfolio-test

# Test again: http://localhost:8080
# Now Firebase, Analytics, etc. should work!
```

**✅ Phase 1 Complete** when:
- Docker image builds successfully
- Container runs without errors
- You can access http://localhost:8080

---

## ☁️ Phase 2: Google Cloud Console Setup (45 minutes)

### Step 2.1: Create/Select GCP Project

1. Go to: https://console.cloud.google.com/
2. Click project dropdown (top left)
3. Click "New Project"
   - **Project Name**: `portfolio-react` or `jeff-portfolio`
   - **Project ID**: (auto-generated, note this down)
   - **Billing Account**: Select your billing account
4. Click "Create"
5. Wait 30 seconds for project creation
6. **IMPORTANT**: Copy your **Project ID** (e.g., `portfolio-react-123456`)

### Step 2.2: Enable Required APIs

```bash
# Login to gcloud (opens browser)
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Enable APIs (takes 2-3 minutes)
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

**Or via Console:**
1. Go to: https://console.cloud.google.com/apis/library
2. Search and enable each:
   - ✅ Cloud Run API
   - ✅ Cloud Build API
   - ✅ Container Registry API
   - ✅ Artifact Registry API

### Step 2.3: Set Up Billing

1. Go to: https://console.cloud.google.com/billing
2. Link your project to a billing account
3. **Estimated Cost**: $5-10/month (with free tier)
   - First 2 million requests/month: FREE
   - 512Mi RAM, 1 CPU: ~$0.024/hour when running
   - Pay only when serving requests

### Step 2.4: Create Service Account for GitHub Actions

```bash
# Create service account
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions Deployer" \
  --description="Service account for automated deployments from GitHub Actions"

# Get the service account email
gcloud iam service-accounts list

# Example output:
# EMAIL: github-actions@portfolio-react-123456.iam.gserviceaccount.com
# Copy this email!
```

### Step 2.5: Grant Permissions to Service Account

```bash
# Replace YOUR_PROJECT_ID with your actual project ID
export PROJECT_ID="YOUR_PROJECT_ID"
export SA_EMAIL="github-actions@${PROJECT_ID}.iam.gserviceaccount.com"

# Grant Cloud Run Admin role
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/run.admin"

# Grant Storage Admin role (for Container Registry)
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/storage.admin"

# Grant Service Account User role
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/iam.serviceAccountUser"

# Grant Artifact Registry Admin role
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/artifactregistry.admin"
```

### Step 2.6: Create Service Account Key

```bash
# Create and download key file
gcloud iam service-accounts keys create gcp-key.json \
  --iam-account="${SA_EMAIL}"

# This creates gcp-key.json in current directory
# ⚠️ KEEP THIS FILE SECURE - DO NOT COMMIT TO GIT!

# View the key (you'll need this for GitHub)
cat gcp-key.json

# Or on Windows:
type gcp-key.json
```

**Copy the entire JSON content** - you'll need it for GitHub Secrets.

**✅ Phase 2 Complete** when you have:
- ✅ GCP Project created
- ✅ Project ID noted down
- ✅ All APIs enabled
- ✅ Service account created
- ✅ `gcp-key.json` file downloaded

---

## 🚢 Phase 3: First Deployment to Cloud Run (30 minutes)

### Step 3.1: Deploy from Source (Easiest Method)

```bash
# Make sure you're in project directory
cd C:\xampp\htdocs\profile-react

# Deploy (this takes 5-10 minutes first time)
gcloud run deploy portfolio-react \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10 \
  --min-instances 0 \
  --port 8080 \
  --timeout 300

# You'll be asked:
# "Do you want to continue?" → YES
# Building using Dockerfile... → Wait 5-10 minutes
# Deploying... → Wait 2 minutes
```

**Expected Output:**
```
✓ Building and deploying... Done.
✓ Deploying new service... Done.
Service [portfolio-react] revision [portfolio-react-00001] has been deployed
and is serving 100 percent of traffic.
Service URL: https://portfolio-react-XXXXXXXXXX-uc.a.run.app
```

**🎉 COPY THIS URL!** This is your Cloud Run deployment.

### Step 3.2: Verify Deployment

```bash
# Test health endpoint
curl https://YOUR-CLOUD-RUN-URL/api/health

# Or visit in browser
```

**Expected:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-01T12:00:00.000Z",
  "environment": "production"
}
```

### Step 3.3: Configure Environment Variables

**Method A: Using gcloud CLI (Recommended for bulk import)**

```bash
# If you have .env file, convert it
# Remove comments and empty lines first
cat .env | grep -v '^#' | grep -v '^$' > .env.clean

# Set all variables at once
gcloud run services update portfolio-react \
  --region us-central1 \
  --set-env-vars "$(cat .env.clean | tr '\n' ',' | sed 's/,$//')"
```

**Method B: Google Cloud Console (Recommended for beginners)**

1. Go to: https://console.cloud.google.com/run
2. Click on `portfolio-react` service
3. Click "Edit & Deploy New Revision"
4. Scroll to "Variables & Secrets"
5. Click "Add Variable" for each:

**Frontend Variables (required for build):**
```
VITE_FIREBASE_API_KEY = [your-firebase-api-key]
VITE_FIREBASE_AUTH_DOMAIN = [your-project].firebaseapp.com
VITE_FIREBASE_PROJECT_ID = [your-project-id]
VITE_FIREBASE_STORAGE_BUCKET = [your-project].appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID = [your-sender-id]
VITE_FIREBASE_APP_ID = [your-app-id]
VITE_FIREBASE_MEASUREMENT_ID = G-XXXXXXXXXX
```

**Backend Variables:**
```
GA_PROPERTY_ID = [your-ga-property-id]
GA_CLIENT_EMAIL = [your-service-account@project.iam.gserviceaccount.com]
GEMINI_API_KEY = [your-gemini-api-key]
RESEND_API_KEY = [your-resend-api-key]
R2_ACCOUNT_ID = [your-r2-account-id]
R2_ACCESS_KEY_ID = [your-r2-access-key]
R2_SECRET_ACCESS_KEY = [your-r2-secret-key]
R2_BUCKET_NAME = jeff-portfolio-images
```

**Special: GA_PRIVATE_KEY (contains newlines)**
```bash
# For multi-line private key, use this method:
# 1. Create a temp file
echo 'GA_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
YOUR_PRIVATE_KEY_HERE
-----END PRIVATE KEY-----' > /tmp/ga-key.txt

# 2. Update service
gcloud run services update portfolio-react \
  --region us-central1 \
  --update-env-vars="$(cat /tmp/ga-key.txt)"

# 3. Clean up
rm /tmp/ga-key.txt
```

6. Click "Deploy" (takes 2-3 minutes)

### Step 3.4: Test with Environment Variables

```bash
# Visit your Cloud Run URL
# All features should work now!

# Check logs
gcloud run services logs read portfolio-react \
  --region us-central1 \
  --limit 50
```

**✅ Phase 3 Complete** when:
- ✅ Service deployed successfully
- ✅ Environment variables configured
- ✅ All API endpoints working
- ✅ No errors in logs

---

## 🌐 Phase 4: Custom Domain Setup (30 minutes)

### Step 4.1: Map Domain in Cloud Run

```bash
# Map your subdomain
gcloud run domain-mappings create \
  --service portfolio-react \
  --domain gcp.jeffdev.studio \
  --region us-central1

# Expected output:
# Mapping [gcp.jeffdev.studio] is now being created
# To complete, add these records to your DNS:
# 
# NAME                    TYPE    DATA
# gcp                     CNAME   ghs.googlehosted.com
```

**COPY THESE DNS RECORDS!**

### Step 4.2: Configure DNS (Vercel DNS)

Since your main domain is on Vercel:

**Option A: Using Vercel DNS (if Vercel manages DNS)**

1. Go to: https://vercel.com/dashboard
2. Go to your domain settings
3. Add DNS record:
   - **Type**: CNAME
   - **Name**: `gcp`
   - **Value**: `ghs.googlehosted.com`
   - **TTL**: 3600 (or default)
4. Save

**Option B: Using External DNS Provider**

1. Go to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)
2. Find DNS settings for `jeffdev.studio`
3. Add new record:
   - **Type**: CNAME
   - **Host**: `gcp`
   - **Points to**: `ghs.googlehosted.com`
   - **TTL**: 3600
4. Save

### Step 4.3: Verify Domain Mapping

```bash
# Check mapping status
gcloud run domain-mappings describe gcp.jeffdev.studio \
  --region us-central1

# Wait 5-30 minutes for DNS propagation

# Test DNS resolution
nslookup gcp.jeffdev.studio

# Should return:
# gcp.jeffdev.studio  canonical name = ghs.googlehosted.com
```

### Step 4.4: Enable HTTPS

**Cloud Run automatically provisions SSL certificates!**

Wait 15-60 minutes after DNS propagation for:
- ✅ SSL certificate to be issued
- ✅ HTTPS to become available
- ✅ Automatic HTTP → HTTPS redirect

**Test:**
```bash
# Should work
curl https://gcp.jeffdev.studio/api/health

# Should redirect to HTTPS
curl http://gcp.jeffdev.studio/api/health
```

**✅ Phase 4 Complete** when:
- ✅ DNS record added
- ✅ `nslookup gcp.jeffdev.studio` returns correct CNAME
- ✅ https://gcp.jeffdev.studio loads your site
- ✅ SSL certificate shows as valid

---

## 🤖 Phase 5: GitHub Actions Setup (30 minutes)

### Step 5.1: Add GitHub Secrets

1. Go to: https://github.com/J-Akiru5/my-portfolio-react
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**

**Add these 2 secrets:**

**Secret 1: GCP_PROJECT_ID**
- **Name**: `GCP_PROJECT_ID`
- **Value**: Your project ID (e.g., `portfolio-react-123456`)

**Secret 2: GCP_SA_KEY**
- **Name**: `GCP_SA_KEY`
- **Value**: Entire content of `gcp-key.json` file
  - Open `gcp-key.json` in notepad
  - Copy everything from `{` to `}`
  - Paste into secret value

### Step 5.2: Verify Workflow File

The workflow file should already exist at:
`.github/workflows/deploy-cloud-run.yml`

Check it exists:
```bash
ls .github/workflows/
```

### Step 5.3: Test GitHub Actions

**Option A: Push to trigger**
```bash
# Make a small change
echo "# Cloud Run Ready" >> README.md

# Commit and push
git add .
git commit -m "test: trigger Cloud Run deployment"
git push origin feature/startup-transformation
```

**Option B: Manual trigger**
1. Go to: https://github.com/J-Akiru5/my-portfolio-react/actions
2. Click "Deploy to Google Cloud Run"
3. Click "Run workflow"
4. Select branch: `feature/startup-transformation`
5. Click "Run workflow"

### Step 5.4: Monitor Deployment

1. Go to: https://github.com/J-Akiru5/my-portfolio-react/actions
2. Click on the running workflow
3. Watch the steps:
   - ✅ Checkout code
   - ✅ Authenticate to Google Cloud
   - ✅ Build Docker image (5-10 min)
   - ✅ Push to Container Registry
   - ✅ Deploy to Cloud Run
   - ✅ Health check

**Expected:** Green checkmark ✅

### Step 5.5: Configure for Main Branch

Once tested, merge to main for auto-deploy:

```bash
# Switch to main
git checkout main

# Merge your feature branch
git merge feature/startup-transformation

# Push to main
git push origin main

# This will trigger automatic deployment!
```

**✅ Phase 5 Complete** when:
- ✅ GitHub secrets configured
- ✅ Workflow runs successfully
- ✅ Deployment completes with green checkmark
- ✅ Site updates automatically on push

---

## 🎯 Phase 6: Final Verification & Contest Prep (20 minutes)

### Step 6.1: Comprehensive Testing

**Test Checklist:**
- [ ] https://gcp.jeffdev.studio loads homepage
- [ ] https://gcp.jeffdev.studio/portfolio works (SPA routing)
- [ ] https://gcp.jeffdev.studio/api/health returns healthy status
- [ ] Firebase authentication works
- [ ] Blog posts load from Firestore
- [ ] Image uploads work (R2)
- [ ] Contact form sends emails
- [ ] Analytics tracking works
- [ ] SSL certificate is valid (green padlock)
- [ ] Mobile responsive

### Step 6.2: Performance Optimization

**Check Cloud Run Metrics:**
1. Go to: https://console.cloud.google.com/run/detail/us-central1/portfolio-react
2. Click "Metrics" tab
3. Verify:
   - ✅ Request latency < 1s
   - ✅ No errors
   - ✅ Container startup time < 10s

**Optimize if needed:**
```bash
# Increase memory for faster performance
gcloud run services update portfolio-react \
  --memory 1Gi \
  --region us-central1

# Add minimum instances to avoid cold starts (costs more)
gcloud run services update portfolio-react \
  --min-instances 1 \
  --region us-central1
```

### Step 6.3: Set Up Monitoring

**Enable Cloud Logging:**
```bash
# View real-time logs
gcloud run services logs tail portfolio-react --region us-central1

# Set up log-based alerts (optional)
# Go to: https://console.cloud.google.com/logs/
```

### Step 6.4: Contest Submission Prep

**Create submission document with:**

1. **Live Demo Links:**
   - Primary: https://jeffdev.studio (Vercel)
   - Google Cloud: https://gcp.jeffdev.studio (Cloud Run)

2. **GitHub Repository:**
   - https://github.com/J-Akiru5/my-portfolio-react

3. **Technology Stack:**
   - Frontend: React 19, Vite
   - Backend: Node.js, Express
   - Database: Firestore
   - Storage: Cloudflare R2
   - AI: Google Gemini API
   - Analytics: Google Analytics
   - Deployment: Google Cloud Run + GitHub Actions
   - CI/CD: Automated Docker builds

4. **Google Cloud Features:**
   - ✅ Cloud Run (containerized deployment)
   - ✅ Gemini AI integration
   - ✅ Google Analytics API
   - ✅ Firebase/Firestore
   - ✅ Automated CI/CD pipeline
   - ✅ Custom domain with SSL
   - ✅ Infrastructure as Code

5. **Screenshots:**
   - Homepage
   - Portfolio section
   - AI features (if using Gemini)
   - GitHub Actions workflow
   - Cloud Run dashboard

### Step 6.5: Backup & Rollback Plan

**Create backup:**
```bash
# Tag current version
git tag -a v1.0-contest -m "Contest submission version"
git push origin v1.0-contest

# Save current Cloud Run config
gcloud run services describe portfolio-react \
  --region us-central1 \
  --format yaml > cloud-run-backup.yaml
```

**Rollback if needed:**
```bash
# List revisions
gcloud run revisions list \
  --service portfolio-react \
  --region us-central1

# Rollback to previous revision
gcloud run services update-traffic portfolio-react \
  --to-revisions REVISION_NAME=100 \
  --region us-central1
```

---

## 📊 Cost Management

### Current Configuration Costs

**Cloud Run (512Mi RAM, 1 CPU):**
- Free tier: 2M requests/month, 360,000 GB-seconds/month
- After free tier: ~$0.024/hour when serving requests
- Estimated: **$5-10/month** for moderate traffic

**Container Registry:**
- Storage: $0.026/GB/month
- Estimated: **$0.50/month**

**Total Estimated Cost: $5-10/month**

### Cost Optimization Tips

```bash
# Reduce memory if site works fine
gcloud run services update portfolio-react \
  --memory 256Mi \
  --region us-central1

# Set max instances to prevent runaway costs
gcloud run services update portfolio-react \
  --max-instances 5 \
  --region us-central1

# Monitor costs
# Go to: https://console.cloud.google.com/billing
```

---

## 🆘 Troubleshooting Guide

### Issue 1: Docker Build Fails

**Error:** `npm install failed`
```bash
# Check package.json syntax
npm install --legacy-peer-deps

# Rebuild with no cache
docker build --no-cache -t portfolio-test .
```

### Issue 2: Cloud Run Deployment Fails

**Error:** `Permission denied`
```bash
# Re-authenticate
gcloud auth login

# Verify project
gcloud config get-value project

# Check permissions
gcloud projects get-iam-policy YOUR_PROJECT_ID
```

### Issue 3: Environment Variables Not Working

**Check variables:**
```bash
# List current env vars
gcloud run services describe portfolio-react \
  --region us-central1 \
  --format="value(spec.template.spec.containers[0].env)"

# Update specific variable
gcloud run services update portfolio-react \
  --update-env-vars VITE_FIREBASE_API_KEY=new-value \
  --region us-central1
```

### Issue 4: Domain Not Resolving

**Debug DNS:**
```bash
# Check DNS propagation
nslookup gcp.jeffdev.studio

# Check Cloud Run mapping
gcloud run domain-mappings describe gcp.jeffdev.studio \
  --region us-central1

# Wait 15-60 minutes for DNS + SSL
```

### Issue 5: GitHub Actions Fails

**Check logs:**
1. Go to Actions tab
2. Click failed workflow
3. Expand failed step
4. Common fixes:
   - Verify `GCP_PROJECT_ID` secret
   - Verify `GCP_SA_KEY` secret (full JSON)
   - Check service account permissions

### Issue 6: Cold Start Latency

**Solution:**
```bash
# Add minimum instances (increases cost)
gcloud run services update portfolio-react \
  --min-instances 1 \
  --region us-central1
```

---

## 📝 Quick Reference Commands

```bash
# Deploy new version
git push origin main  # Auto-deploys via GitHub Actions

# Or manually
gcloud run deploy portfolio-react --source . --region us-central1

# View logs
gcloud run services logs tail portfolio-react --region us-central1

# Update env vars
gcloud run services update portfolio-react \
  --set-env-vars KEY=VALUE \
  --region us-central1

# Rollback
gcloud run revisions list --service portfolio-react --region us-central1
gcloud run services update-traffic portfolio-react \
  --to-revisions REVISION=100 --region us-central1

# Delete service (if needed)
gcloud run services delete portfolio-react --region us-central1
```

---

## 🎉 Success Criteria

You're ready for the contest when:

- ✅ https://gcp.jeffdev.studio loads your portfolio
- ✅ All features work (Firebase, API, uploads, etc.)
- ✅ SSL certificate valid (green padlock)
- ✅ GitHub Actions auto-deploys on push
- ✅ No errors in Cloud Run logs
- ✅ Performance is good (< 1s load time)
- ✅ Mobile responsive
- ✅ Backup/rollback plan ready

---

## 🏆 Contest Submission

**Submit to:** https://dev.to/challenges/new-year-new-you-google-ai-2025-12-31

**Include in your post:**
- Live demo: https://gcp.jeffdev.studio
- GitHub repo: https://github.com/J-Akiru5/my-portfolio-react
- Tech stack emphasizing Google Cloud + AI
- Screenshots of deployed app
- Deployment pipeline (GitHub Actions → Cloud Run)
- Challenges overcome
- What makes your portfolio unique

**Deadline:** February 1, 2026, 23:59 PT

---

**Good luck! You've got this! 🚀**
