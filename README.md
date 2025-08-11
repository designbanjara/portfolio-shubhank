# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/8b306bde-70fb-4575-8b52-d8012b9e2d9c

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/8b306bde-70fb-4575-8b52-d8012b9e2d9c) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Adding new writing posts

Posts are stored as JSON in `src/content/posts/*.json` and rendered via the dynamic route `/writing/:slug`.

### Fully Automated Craft Sync

This project includes a fully automated system to sync content from your public Craft writings page:

**Setup:**
1. Make your Craft writings page public and get the URL
2. Add the URL as a GitHub secret: `CRAFT_INDEX_URL`
3. The system will automatically:
   - Check for new articles every 6 hours
   - Extract content and metadata
   - Generate reading time and excerpts
   - Create JSON files for new posts

**Manual sync:**
```bash
# Set your Craft URL
export CRAFT_INDEX_URL="https://your-craft-writings-page.craft.do"

# Run sync
npm run sync:craft

# Force sync (ignore time limits)
npm run sync:craft:force
```

**How it works:**
- Scrapes your public Craft index page to discover all articles
- Fetches individual article content and converts to blog format
- Caches processed articles to avoid re-processing
- Runs automatically via GitHub Actions every 6 hours
- Only processes new/changed content

**Schema for posts:**
```json
{
  "slug": "my-post",
  "title": "My Post",
  "date": "2024-01-01",
  "readingTimeMinutes": 5,
  "excerpt": "Short summary",
  "html": "<p>Post body as HTML</p>"
}
```

### Manual Posts

You can also manually create posts by adding JSON files to `src/content/posts/` with the schema above.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/8b306bde-70fb-4575-8b52-d8012b9e2d9c) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
