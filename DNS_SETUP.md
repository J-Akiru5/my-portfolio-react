# 🌐 DNS & CNAME Configuration Guide

## Complete Guide for Setting up `gcp.jeffdev.studio`

---

## Overview

You'll create a **CNAME record** that points `gcp.jeffdev.studio` to Google Cloud Run.

**DNS Record Details:**
- **Type:** CNAME
- **Name/Host:** `gcp`
- **Value/Points to:** `ghs.googlehosted.com`
- **TTL:** 3600 (1 hour) or Auto

---

## Step 1: Initiate Domain Mapping in Cloud Run

```bash
# Map your subdomain to Cloud Run service
gcloud run domain-mappings create \
  --service portfolio-react \
  --domain gcp.jeffdev.studio \
  --region us-central1
```

**Output:**
```
Creating domain mapping for [gcp.jeffdev.studio]...
⠹ Creating...

To complete, add these DNS records:

NAME        TYPE    DATA
gcp         CNAME   ghs.googlehosted.com
```

**⚠️ Important:** Keep this terminal open or copy the CNAME value!

---

## Step 2: Add DNS Record (Choose Your Provider)

### Option A: Vercel DNS (if jeffdev.studio is on Vercel)

#### Via Vercel Dashboard:
1. Go to: https://vercel.com/dashboard
2. Navigate to **Domains**
3. Find `jeffdev.studio`
4. Click **Edit** or **DNS Records**
5. Click **Add Record**
6. Fill in:
   ```
   Type: CNAME
   Name: gcp
   Value: ghs.googlehosted.com
   TTL: Auto (or 3600)
   ```
7. Click **Save**

#### Via Vercel CLI:
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Add DNS record
vercel dns add jeffdev.studio gcp CNAME ghs.googlehosted.com
```

---

### Option B: Cloudflare DNS

1. Login to: https://dash.cloudflare.com/
2. Select `jeffdev.studio` domain
3. Click **DNS** tab
4. Click **Add record**
5. Fill in:
   ```
   Type: CNAME
   Name: gcp
   Target: ghs.googlehosted.com
   Proxy status: DNS only (gray cloud) ⚠️ IMPORTANT
   TTL: Auto
   ```
6. Click **Save**

**⚠️ Critical:** Turn OFF Cloudflare proxy (gray cloud icon, not orange)
- Orange cloud = Cloudflare proxy (will NOT work with Cloud Run SSL)
- Gray cloud = DNS only (correct for Cloud Run)

---

### Option C: GoDaddy

1. Login to: https://account.godaddy.com/
2. Go to **My Products**
3. Find `jeffdev.studio`, click **DNS**
4. Scroll to **Records** section
5. Click **Add New Record**
6. Fill in:
   ```
   Type: CNAME
   Name: gcp
   Value: ghs.googlehosted.com
   TTL: 1 Hour
   ```
7. Click **Save**

---

### Option D: Namecheap

1. Login to: https://www.namecheap.com/
2. Go to **Domain List**
3. Click **Manage** next to `jeffdev.studio`
4. Go to **Advanced DNS** tab
5. Click **Add New Record**
6. Fill in:
   ```
   Type: CNAME Record
   Host: gcp
   Value: ghs.googlehosted.com
   TTL: Automatic
   ```
7. Click **Save All Changes** (checkmark icon)

---

### Option E: Google Domains / Google Cloud DNS

1. Login to: https://domains.google.com/
2. Click on `jeffdev.studio`
3. Click **DNS** in left sidebar
4. Scroll to **Custom records**
5. Click **Create new record**
6. Fill in:
   ```
   Host name: gcp
   Type: CNAME
   TTL: 1 Hour
   Data: ghs.googlehosted.com
   ```
7. Click **Save**

---

### Option F: AWS Route 53

1. Login to: https://console.aws.amazon.com/route53/
2. Click **Hosted zones**
3. Click `jeffdev.studio`
4. Click **Create record**
5. Fill in:
   ```
   Record name: gcp
   Record type: CNAME
   Value: ghs.googlehosted.com
   TTL: 300
   Routing policy: Simple routing
   ```
6. Click **Create records**

---

### Option G: Custom DNS Provider

**Generic steps for any DNS provider:**

1. Login to your DNS provider
2. Find DNS management for `jeffdev.studio`
3. Add new record:
   - **Type:** CNAME
   - **Name/Host/Alias:** `gcp` (not `gcp.jeffdev.studio`)
   - **Value/Target/Points to:** `ghs.googlehosted.com`
   - **TTL:** 3600 or Auto
4. Save changes

---

## Step 3: Verify DNS Propagation

### Check DNS Resolution

**Windows (PowerShell):**
```powershell
# Check CNAME record
nslookup gcp.jeffdev.studio

# Should show:
# gcp.jeffdev.studio  canonical name = ghs.googlehosted.com
```

**Mac/Linux:**
```bash
# Check CNAME
dig gcp.jeffdev.studio CNAME

# Or
nslookup gcp.jeffdev.studio
```

### Online DNS Checkers

Check propagation worldwide:
- https://dnschecker.org/#CNAME/gcp.jeffdev.studio
- https://www.whatsmydns.net/#CNAME/gcp.jeffdev.studio

**Expected:**
- ✅ Green checkmarks worldwide
- ✅ Value: `ghs.googlehosted.com`

---

## Step 4: Verify Cloud Run Mapping

```bash
# Check mapping status
gcloud run domain-mappings describe gcp.jeffdev.studio \
  --region us-central1 \
  --format yaml
```

**Expected output:**
```yaml
status:
  conditions:
  - status: "True"
    type: Ready
  mappedRouteName: portfolio-react
  resourceRecords:
  - name: gcp
    rrdata: ghs.googlehosted.com
    type: CNAME
  url: https://gcp.jeffdev.studio
```

**Status meanings:**
- ✅ `Ready: True` = Domain mapped successfully
- ⏳ `CertificateProvisioning` = Waiting for SSL (15-60 min)
- ❌ `Ready: False` = DNS not configured or propagated

---

## Step 5: Wait for SSL Certificate

**Timeline:**
- **5-15 minutes:** DNS propagates
- **15-60 minutes:** Google provisions SSL certificate
- **Total:** Up to 1 hour

**Check SSL status:**
```bash
gcloud run domain-mappings describe gcp.jeffdev.studio \
  --region us-central1 \
  --format="value(status.conditions[0].message)"
```

**Messages:**
- ✅ `Ready` = SSL certificate provisioned
- ⏳ `Provisioning certificate` = Wait...
- ❌ `DNS records not found` = Check DNS configuration

---

## Step 6: Test Your Domain

### HTTP Test (should redirect to HTTPS)
```bash
curl -I http://gcp.jeffdev.studio

# Expected: 301 or 302 redirect to https://
```

### HTTPS Test
```bash
curl https://gcp.jeffdev.studio/api/health

# Expected: {"status":"healthy",...}
```

### Browser Test
1. Visit: https://gcp.jeffdev.studio
2. Check SSL certificate (click padlock icon)
   - ✅ Issued by: Google Trust Services
   - ✅ Valid for: gcp.jeffdev.studio
   - ✅ Expires: ~3 months (auto-renewed)

---

## Troubleshooting

### Issue 1: "DNS not found" after 30 minutes

**Check DNS record:**
```bash
nslookup gcp.jeffdev.studio
```

**If no results:**
- ✅ Verify you added `gcp` not `gcp.jeffdev.studio` as the name
- ✅ Ensure CNAME points to `ghs.googlehosted.com` (not other values)
- ✅ Check TTL hasn't expired old cached records
- ✅ Flush local DNS cache:
  ```powershell
  # Windows
  ipconfig /flushdns
  
  # Mac
  sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
  
  # Linux
  sudo systemd-resolve --flush-caches
  ```

---

### Issue 2: Certificate provisioning stuck

**Check Cloud Run logs:**
```bash
gcloud run domain-mappings describe gcp.jeffdev.studio \
  --region us-central1
```

**Common causes:**
- ❌ CNAME points to wrong value
- ❌ Cloudflare proxy enabled (turn off - gray cloud)
- ❌ DNS not propagated yet (wait 1 hour)
- ❌ CAA record blocks Google (rare)

**Fix CAA record (if needed):**
```bash
# Check CAA records
dig jeffdev.studio CAA

# If you have CAA records, add:
# Type: CAA
# Name: jeffdev.studio
# Value: 0 issue "pki.goog"
```

---

### Issue 3: SSL certificate error in browser

**Symptoms:**
- "Your connection is not private"
- "NET::ERR_CERT_AUTHORITY_INVALID"

**Solutions:**
1. Wait longer (SSL can take up to 1 hour)
2. Check domain mapping status
3. Verify DNS points to correct CNAME
4. Try incognito/private browsing (clear cache)

---

### Issue 4: Works on HTTP but not HTTPS

**Check certificate status:**
```bash
gcloud run domain-mappings describe gcp.jeffdev.studio \
  --region us-central1 \
  --format="get(status.conditions)"
```

**If stuck for >2 hours:**
```bash
# Delete and recreate mapping
gcloud run domain-mappings delete gcp.jeffdev.studio --region us-central1

# Wait 5 minutes

# Recreate
gcloud run domain-mappings create \
  --service portfolio-react \
  --domain gcp.jeffdev.studio \
  --region us-central1
```

---

### Issue 5: "This site can't be reached"

**Checklist:**
- ✅ DNS record created (CNAME)
- ✅ DNS propagated (check dnschecker.org)
- ✅ Cloud Run service is running
- ✅ Domain mapping exists
- ✅ No typos in domain name

---

## DNS Propagation Timeline

**Typical timeline:**
- **0-5 min:** DNS provider updates
- **5-15 min:** Most DNS servers see changes
- **15-60 min:** Global propagation complete
- **15-60 min:** SSL certificate provisioned
- **Total:** Up to 1 hour for full HTTPS

**Speed up propagation:**
- Use shorter TTL (300 seconds)
- Flush your local DNS cache
- Check from different networks/devices

---

## Verification Checklist

- [ ] DNS record created (CNAME `gcp` → `ghs.googlehosted.com`)
- [ ] `nslookup gcp.jeffdev.studio` returns CNAME
- [ ] dnschecker.org shows green worldwide
- [ ] `gcloud run domain-mappings describe` shows `Ready: True`
- [ ] https://gcp.jeffdev.studio loads (green padlock)
- [ ] SSL certificate valid (click padlock)
- [ ] http://gcp.jeffdev.studio redirects to HTTPS

---

## Quick Reference

**DNS Record:**
```
Type:  CNAME
Name:  gcp
Value: ghs.googlehosted.com
TTL:   3600 or Auto
```

**Verification Commands:**
```bash
# Check DNS
nslookup gcp.jeffdev.studio

# Check Cloud Run mapping
gcloud run domain-mappings describe gcp.jeffdev.studio --region us-central1

# Test HTTPS
curl -I https://gcp.jeffdev.studio
```

**Troubleshooting:**
```bash
# Delete mapping
gcloud run domain-mappings delete gcp.jeffdev.studio --region us-central1

# Recreate mapping
gcloud run domain-mappings create \
  --service portfolio-react \
  --domain gcp.jeffdev.studio \
  --region us-central1

# Check logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=portfolio-react" \
  --limit 50 \
  --format json
```

---

## Support

**Need help?**
- Cloud Run DNS docs: https://cloud.google.com/run/docs/mapping-custom-domains
- DNS checker: https://dnschecker.org/
- SSL checker: https://www.sslshopper.com/ssl-checker.html

---

**Expected:** ✅ https://gcp.jeffdev.studio fully working in 30-60 minutes!
