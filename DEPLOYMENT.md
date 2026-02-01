# 🚀 Google Cloud Run Deployment Guide

## Quick Start

### Prerequisites
1. **Google Cloud Project** - [Create one here](https://console.cloud.google.com/)
2. **gcloud CLI** - [Install here](https://cloud.google.com/sdk/docs/install)
3. **Docker** (optional for local testing)

### One-Time Setup

#### 1. Initialize Google Cloud
```bash
# Login to GCP
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

#### 2. Deploy to Cloud Run
```bash
# Option A: Deploy from source (easiest)
gcloud run deploy portfolio-react \
  --source . \
  --region us-central1 \
  --allow-unauthenticated

# Option B: Build and deploy with Docker
docker build -t gcr.io/YOUR_PROJECT_ID/portfolio-react .
docker push gcr.io/YOUR_PROJECT_ID/portfolio-react
gcloud run deploy portfolio-react \
  --image gcr.io/YOUR_PROJECT_ID/portfolio-react \
  --region us-central1 \
  --allow-unauthenticated
```

#### 3. Set Environment Variables
```bash
# Set all required env vars
gcloud run services update portfolio-react \
  --region us-central1 \
  --set-env-vars "\
VITE_FIREBASE_API_KEY=xxx,\
VITE_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com,\
VITE_FIREBASE_PROJECT_ID=xxx,\
VITE_FIREBASE_STORAGE_BUCKET=xxx.appspot.com,\
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx,\
VITE_FIREBASE_APP_ID=xxx,\
GA_PROPERTY_ID=xxx,\
GA_CLIENT_EMAIL=xxx@xxx.iam.gserviceaccount.com,\
GEMINI_API_KEY=xxx,\
RESEND_API_KEY=xxx,\
R2_ACCOUNT_ID=xxx,\
R2_ACCESS_KEY_ID=xxx,\
R2_SECRET_ACCESS_KEY=xxx,\
R2_BUCKET_NAME=jeff-portfolio-images"

# For GA_PRIVATE_KEY (contains newlines), use a file:
echo 'GA_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYour_Key\n-----END PRIVATE KEY-----' > /tmp/ga-key.env
gcloud run services update portfolio-react \
  --region us-central1 \
  --update-env-vars="$(cat /tmp/ga-key.env)"
rm /tmp/ga-key.env
```

#### 4. Configure Custom Domain
```bash
# Map your subdomain
gcloud run domain-mappings create \
  --service portfolio-react \
  --domain gcp.jeffdev.studio \
  --region us-central1

# Follow the instructions to add DNS records in your domain provider
```

---

## GitHub Actions Automated Deployment

### Setup Instructions

#### 1. Create GCP Service Account
```bash
# Create service account
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions"

# Get the email
export SA_EMAIL=$(gcloud iam service-accounts list \
  --filter="displayName:GitHub Actions" \
  --format='value(email)')

# Grant permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/iam.serviceAccountUser"

# Create and download key
gcloud iam service-accounts keys create key.json \
  --iam-account=${SA_EMAIL}

# The key.json content will be used as GCP_SA_KEY secret
```

#### 2. Add GitHub Secrets
Go to your repo: **Settings > Secrets and variables > Actions**

Add these secrets:
- `GCP_PROJECT_ID` = Your GCP project ID
- `GCP_SA_KEY` = Content of `key.json` file (entire JSON)

#### 3. Trigger Deployment
```bash
# Push to main branch
git add .
git commit -m "feat: deploy to Cloud Run"
git push origin main

# Or trigger manually from GitHub
# Go to Actions tab > Deploy to Google Cloud Run > Run workflow
```

---

## Local Testing

### Test Docker Build
```bash
# Build image
docker build -t portfolio-react-test .

# Run locally
docker run -p 8080:8080 \
  -e VITE_FIREBASE_API_KEY=xxx \
  -e GEMINI_API_KEY=xxx \
  portfolio-react-test

# Visit http://localhost:8080
```

### Test with Environment Variables
```bash
# Create .env.local (gitignored)
cp .env.example .env.local
# Edit .env.local with real values

# Run with env file
docker run -p 8080:8080 --env-file .env.local portfolio-react-test
```

---

## Monitoring & Logs

### View Logs
```bash
# Real-time logs
gcloud run services logs tail portfolio-react --region us-central1

# Recent logs
gcloud run services logs read portfolio-react --region us-central1 --limit 100
```

### Monitor Performance
```bash
# Get service details
gcloud run services describe portfolio-react --region us-central1

# View in Console
https://console.cloud.google.com/run?project=YOUR_PROJECT_ID
```

---

## Contest Submission Checklist

- [ ] Deploy to Cloud Run
- [ ] Set up custom domain: `gcp.jeffdev.studio`
- [ ] Configure all environment variables
- [ ] Test all API endpoints
- [ ] Enable GitHub Actions for auto-deployment
- [ ] Verify health check: `https://gcp.jeffdev.studio/api/health`
- [ ] Update portfolio with live link
- [ ] Submit to [Google AI Portfolio Challenge](https://dev.to/challenges/new-year-new-you-google-ai-2025-12-31)

---

## Troubleshooting

### Build Fails
```bash
# Check build logs
gcloud builds list --limit=5
gcloud builds log BUILD_ID
```

### Service Won't Start
```bash
# Check service logs
gcloud run services logs read portfolio-react --region us-central1 --limit 50

# Common issues:
# - Missing environment variables
# - Port not set to 8080
# - Health check failing
```

### Domain Not Working
```bash
# Verify domain mapping
gcloud run domain-mappings describe gcp.jeffdev.studio --region us-central1

# Check DNS records
# Should have CNAME pointing to ghs.googlehosted.com
```

---

## Cost Optimization

Cloud Run pricing is **pay-per-use**:
- Free tier: 2 million requests/month
- Current config: 512Mi RAM, 1 CPU
- Estimated cost: **~$5-10/month** for moderate traffic

### Reduce Costs
```bash
# Reduce memory
gcloud run services update portfolio-react \
  --memory 256Mi \
  --region us-central1

# Set max instances
gcloud run services update portfolio-react \
  --max-instances 5 \
  --region us-central1
```

---

## Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [GitHub Actions for GCP](https://github.com/google-github-actions)
- [Contest Details](https://dev.to/challenges/new-year-new-you-google-ai-2025-12-31)

---

**Good luck with the contest! 🏆**
