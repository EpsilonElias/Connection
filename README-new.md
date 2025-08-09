# Psycare Blog - Static Site with Payload CMS

A Next.js static blog that fetches content from Payload CMS and deploys to GitHub Pages.

## 🚀 Architecture

- **Blog Site**: Next.js static site (this repo) deployed to GitHub Pages
- **CMS**: Payload CMS hosted on Render (https://dr-serzhans-psycare.onrender.com)
- **Main Site**: Your React site with links to this blog
- **Auto-rebuild**: Webhook triggers from Payload CMS rebuild the static site

## 🔄 How It Works

1. **Content Creation**: Write posts in Payload CMS admin
2. **Webhook Trigger**: Payload sends webhook to GitHub when posts change
3. **Auto Rebuild**: GitHub Actions fetches latest posts and rebuilds static site
4. **Instant Serving**: Visitors get cached, fast-loading pages from GitHub Pages
5. **No Cold Starts**: Payload CMS only accessed during build, not runtime

## 🛠️ Setup

### 1. Payload CMS Webhook Configuration

In your Payload admin panel, add a webhook:

- **URL**: `https://api.github.com/repos/EpsilonElias/Connection/dispatches`
- **Events**: `afterChange` for Posts collection
- **Headers**:
  ```
  Authorization: token YOUR_GITHUB_TOKEN
  Accept: application/vnd.github.v3+json
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "event_type": "payload-update",
    "client_payload": {
      "collection": "posts",
      "operation": "{{operation}}"
    }
  }
  ```

### 2. GitHub Pages Setup

1. Go to repo Settings → Pages
2. Set Source to "GitHub Actions"
3. The workflow will auto-deploy on pushes and webhook triggers

### 3. Integration with Main React Site

```jsx
// Link to your blog from your main site
<a href="https://epsilonelias.github.io/Connection/">Visit Our Blog</a>

// Or fetch recent posts for preview
fetch('https://epsilonelias.github.io/Connection/api/recent-posts')
  .then(res => res.json())
  .then(data => console.log(data.posts));
```

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── page.tsx              # Blog index page
│   │   ├── posts/[slug]/page.tsx # Individual blog posts
│   │   └── api/recent-posts/     # JSON feed for integration
│   └── lib/
│       └── payload.ts            # Payload CMS API functions
├── .github/workflows/
│   └── deploy.yml               # Auto-deployment workflow
└── docs/                        # Setup guides and examples
```

## 🔧 Local Development

```bash
npm install
npm run dev
```

## 🚀 Benefits

- **⚡ Fast Loading**: Static pages, no CMS queries at runtime
- **💰 Cost Effective**: Free GitHub Pages hosting
- **🔄 Auto Updates**: Webhook-triggered rebuilds
- **📱 SEO Optimized**: Static HTML with proper meta tags
- **🛡️ Reliable**: No dependency on CMS uptime for visitors

## 🔗 URLs

- **Blog Site**: https://epsilonelias.github.io/Connection/
- **Recent Posts API**: https://epsilonelias.github.io/Connection/api/recent-posts
- **Payload CMS**: https://dr-serzhans-psycare.onrender.com/admin
