# SEO Manual Tasks — Step-by-Step Guide

**Created**: 2026-02-11
**Context**: These tasks complete the SEO audit (Phases D/E). All code-side SEO is done.

---

## 1. Fix www vs non-www Redirect (Priority: HIGH)

**Problem**: `sablia.io` redirects 307 → `www.sablia.io`, but all canonical URLs, sitemap, and OG tags say `https://sablia.io` (without www). This sends mixed signals to Google.

**Fix option A — Remove www redirect (recommended)**:
1. Go to https://vercel.com → sablia-site project → Settings → Domains
2. You should see both `sablia.io` and `www.sablia.io` listed
3. Make `sablia.io` the **primary** domain (no redirect)
4. Set `www.sablia.io` to **redirect to** `sablia.io`
5. Verify: `curl -sI https://www.sablia.io` should show `301` redirect to `https://sablia.io`

**Fix option B — Update code to use www**:
- Change all URLs in `index.html`, `meta-tags.json`, `sitemap.xml` from `https://sablia.io` to `https://www.sablia.io`
- This is more work and less clean — option A is better

**Verify**: After fixing, test both URLs:
```
curl -sI https://sablia.io        # Should return 200
curl -sI https://www.sablia.io    # Should return 301 → https://sablia.io
```

---

## 2. Google Search Console (Priority: HIGH)

### Step 1: Verify domain ownership
1. Go to https://search.google.com/search-console
2. Click "Add property"
3. Choose **"URL prefix"** → enter `https://sablia.io`
4. Choose verification method:
   - **DNS record** (recommended): Add a TXT record to your domain DNS
   - Or **HTML file**: Download the file, put it in `client/public/`, commit and deploy
5. Click "Verify"

### Step 2: Submit sitemap
1. In GSC, go to **Sitemaps** (left menu)
2. Enter: `sitemap.xml`
3. Click "Submit"
4. Status should change to "Success" within a few minutes

### Step 3: Request indexing
1. Go to **URL Inspection** (left menu)
2. Enter `https://sablia.io/`
3. Click **"Request Indexing"**
4. Repeat for key pages:
   - `https://sablia.io/tarifs`
   - `https://sablia.io/faq`
   - `https://sablia.io/cas-clients`
   - `https://sablia.io/about`
   - `https://sablia.io/gap`
   - `https://sablia.io/roi`

### Step 4: Monitor (weekly)
1. Check **Coverage** for crawl errors
2. Check **Performance** for impressions/clicks trends
3. Check **Enhancements** for structured data issues

---

## 3. Google Analytics 4 (Priority: MEDIUM)

### Step 1: Create GA4 property
1. Go to https://analytics.google.com
2. Click **Admin** (gear icon) → **Create Property**
3. Property name: `Sablia - sablia.io`
4. Reporting time zone: France (UTC+1)
5. Currency: EUR

### Step 2: Create data stream
1. In the new property → **Data Streams** → **Web**
2. URL: `https://sablia.io`
3. Stream name: `Sablia Website`
4. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)

### Step 3: Add tracking to the site
1. Option A — **Google Tag Manager** (recommended for flexibility):
   - Create a GTM container
   - Add the GTM snippet to `client/index.html`
   - Configure GA4 tag in GTM
2. Option B — **Direct gtag.js**:
   - Add to `client/index.html` before `</head>`:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```
   - Replace `G-XXXXXXXXXX` with your Measurement ID
   - Ask Claude to add this for you: `add GA4 tracking with ID G-XXXXXXXXXX`

### Step 4: Set up conversion tracking
1. In GA4 → **Admin** → **Events**
2. Mark as conversions:
   - `form_submit` (contact form)
   - `calendly_click` (Calendly booking)
3. To track Calendly clicks, you may need a custom event (ask Claude to add event tracking)

### Step 5: Link to Search Console
1. In GA4 → **Admin** → **Product Links** → **Search Console Links**
2. Click **Link** → select your GSC property
3. This gives you organic search data inside GA4

---

## 4. Bing Webmaster Tools (Priority: LOW)

### Step 1: Register
1. Go to https://www.bing.com/webmasters
2. Sign in with Microsoft account
3. Click **Add Site** → enter `https://sablia.io`

### Step 2: Verify
1. Easiest: **Import from Google Search Console** (if GSC is already set up)
2. Or: Add DNS CNAME record as instructed

### Step 3: Submit sitemap
1. Go to **Sitemaps** → **Submit sitemap**
2. Enter: `https://sablia.io/sitemap.xml`

---

## 5. Backlink Strategy (Priority: MEDIUM, ongoing)

### Quick wins (1-2 hours total)

**n8n Community Forum**:
1. Go to https://community.n8n.io
2. Create an account (if not done)
3. Write a post in "Share your workflow" or "Showcase":
   - Title: something like "How I built an automation consulting business with n8n"
   - Include link to sablia.io naturally
   - Share a useful workflow tip or case study
4. Add sablia.io to your forum profile

**Make.com Community**:
1. Go to https://community.make.com
2. Same approach — share expertise, include link naturally

**French Startup Directories**:
1. https://www.frenchweb.fr — submit company
2. https://www.maddyness.com — submit startup
3. https://www.welcometothejungle.com — create company page
4. https://angel.co (now wellfound.com) — create profile

**LinkedIn**:
1. Ensure sablia.io link is in your LinkedIn profile
2. Ensure sablia.io link is on the Sablia company page
3. Each LinkedIn post about automation should link to relevant page

### Medium-term (optional)
- Guest post on automation/AI blogs
- Answer questions on Quora about n8n/Make/automation (with sablia.io link)
- Participate in Product Hunt discussions

---

## 6. Rank Tracking (Priority: LOW)

### Free options

**Google Search Console** (already done if step 2 completed):
- Performance → Queries tab shows your keyword rankings
- Check weekly for trends

**Ubersuggest free tier**:
1. Go to https://neilpatel.com/ubersuggest
2. Enter sablia.io
3. Track up to 25 keywords free

### Keywords to track
| Keyword | Target Page |
|---------|-------------|
| automatisation PME | / |
| consultant n8n | / |
| automatisation entreprise IA | / |
| formation n8n | /tarifs |
| n8n vs Make.com | (future blog) |
| automatiser facturation | (future blog) |
| ROI automatisation | /roi |

---

## 7. Validate Social Sharing (Priority: MEDIUM)

### Facebook/LinkedIn OG preview
1. Go to https://developers.facebook.com/tools/debug/
2. Enter `https://sablia.io`
3. Click **"Debug"**
4. Verify: title, description, and image show correctly
5. If stale, click **"Scrape Again"** to refresh cache
6. Repeat for `/tarifs`, `/about`, `/gap`

### Twitter Card preview
1. Go to https://cards-dev.twitter.com/validator
2. Enter `https://sablia.io`
3. Verify the card preview shows correctly

### Rich Results (structured data)
1. Go to https://search.google.com/test/rich-results
2. Enter `https://sablia.io`
3. Should detect: Organization, ProfessionalService, OfferCatalog
4. Test `/tarifs` → should detect Service/ItemList
5. Test `/faq` → should detect FAQPage
6. Test `/about` → should detect Person
7. Fix any errors shown

---

## Checklist Summary

Do these in order:

- [ ] **Step 1**: Fix www redirect (Vercel DNS) — 5 min
- [ ] **Step 2**: Google Search Console setup — 15 min
- [ ] **Step 3**: GA4 setup + add tracking code — 30 min
- [ ] **Step 4**: Bing Webmaster Tools — 10 min
- [ ] **Step 5**: Post in n8n + Make forums — 1 hour
- [ ] **Step 6**: Set up rank tracking — 15 min
- [ ] **Step 7**: Validate social sharing — 15 min

**Total estimated time**: ~2.5 hours
