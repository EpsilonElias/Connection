# Payload CMS Webhook Setup

To trigger automatic rebuilds when you publish blog posts, add this webhook configuration to your Payload CMS:

## In your Payload admin panel:

1. Go to Settings → Webhooks
2. Create a new webhook with these settings:
   - **URL**: `https://api.github.com/repos/EpsilonElias/Connection/dispatches`
   - **Events**: Select `afterChange` for your Posts collection
   - **Headers**:
     ```
     Authorization: token YOUR_GITHUB_TOKEN
     Accept: application/vnd.github.v3+json
     Content-Type: application/json
     ```
   - **Body** (JSON):
     ```json
     {
       "event_type": "payload-update",
       "client_payload": {
         "collection": "posts",
         "operation": "{{operation}}",
         "doc": "{{doc.slug}}"
       }
     }
     ```

## GitHub Token Setup:

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Create a token with `repo` permissions
3. Use this token in the webhook Authorization header

This will trigger a rebuild every time you publish, update, or delete a blog post.
