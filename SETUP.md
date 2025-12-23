# Quick Setup Guide

Follow these steps to get your Obojima Party Tracker running:

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Create GitHub Gist

1. Go to https://gist.github.com
2. Create a new **public** gist
3. Name the file: `obojima-party-tracker.json`
4. Copy the contents from `example-data.json` and paste it into the gist
5. Click "Create public gist"
6. Copy your GitHub username and the Gist ID from the URL
   - URL format: `https://gist.github.com/{username}/{gist-id}`

## Step 3: Configure Your App

Create a `.env` file in the project root by copying `.env.example`:

```bash
cp .env.example .env
```

Then edit `.env` and update these values:

```bash
VITE_GIST_USERNAME=YOUR_GITHUB_USERNAME
VITE_GIST_ID=YOUR_GIST_ID
VITE_GIST_FILENAME=obojima-party-tracker.json
VITE_GIST_REFRESH_INTERVAL=60000
```

**Important:** The `.env` file is git-ignored for security, so your credentials won't be committed to the repository.

## Step 4: Run Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Step 5: Build for Production

When ready to deploy:

```bash
npm run build
```

Upload the `dist/` folder to your web server.

## Updating Content

To update the calendar, time, events, or adventure log:

1. Go to your Gist on GitHub
2. Click "Edit"
3. Update the JSON
4. Click "Update public gist"
5. The app will automatically fetch the changes!

## Example Gist Structure

See `example-data.json` for the complete structure. Here's the minimal required format:

```json
{
  "currentDate": {
    "year": 327,
    "era": "AD",
    "month": "Sep",
    "day": 13
  },
  "currentTime": {
    "bell": 3,
    "knot": 2
  }
}
```

Everything else (events, adventureLog) is optional!

## Troubleshooting

**Error: Failed to fetch gist data**
- Make sure your gist is **public** (not secret)
- Verify the username, gist ID, and filename are correct
- Check your internet connection

**Nothing displays / blank page**
- Open browser developer console (F12)
- Check for errors
- Verify your `.env` file exists and has the correct values
- Restart the dev server after changing `.env` files

**Build errors**
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then run `npm install`

## Need Help?

Check the full README.md for more details!
