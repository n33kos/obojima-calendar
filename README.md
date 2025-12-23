# Obojima Party Tracker

A beautiful, Miyazaki/Zelda-inspired D&D party tracker featuring a custom calendar system and adventure log.

## Features

- **Custom Calendar System**: 13 months, 28 days each, with a special "Veil Day"
- **Time Tracking**: Bell and Knot system (8 bells per day, 6 knots per bell)
- **Adventure Log**: Scrollable session summaries with highlights, NPCs, locations, and items
- **Event Calendar**: Track important dates and upcoming events
- **Real-time Updates**: Data fetched from GitHub Gist (no database needed!)

## Tech Stack

- **Vite** - Lightning-fast build tool
- **React 18** - UI framework
- **TypeScript** - Type safety
- **SCSS Modules** - Scoped styling
- **GitHub Gist** - JSON data storage

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Your GitHub Gist (Optional)

**For testing/development:** The app will automatically use `public/default-data.json` if the Gist fetch fails, so you can skip this step initially and configure it later!

**For production use:**
1. Go to [gist.github.com](https://gist.github.com)
2. Create a new **public** gist
3. Name the file: `obojima-party-tracker.json`
4. Copy the contents from `example-data.json` (see below)
5. Note your GitHub username and the Gist ID (from the URL)

### 3. Configure the App

Edit `src/App.tsx` and update the `GIST_CONFIG`:

```typescript
const GIST_CONFIG = {
  username: 'YOUR_GITHUB_USERNAME',  // Leave as-is to use local fallback
  gistId: 'YOUR_GIST_ID',            // Leave as-is to use local fallback
  filename: 'obojima-party-tracker.json',
  refreshInterval: 60000, // Optional: auto-refresh every 60 seconds
};
```

💡 **Tip:** If Gist credentials are not configured or the fetch fails, the app automatically falls back to `/default-data.json` for local testing.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for Production

```bash
npm run build
```

The static files will be in the `dist/` folder, ready to upload to your web server.

## Updating Content

### For Production (using Gist):

1. Go to your Gist on GitHub
2. Click "Edit"
3. Update the JSON
4. Click "Update public gist"
5. The app will automatically fetch the changes (within the refresh interval)

No redeployment needed!

### For Development/Testing (using local file):

1. Edit `public/default-data.json`
2. Save the file
3. Refresh your browser

The app will use local data if the Gist fetch fails.

## Example Data Structure

Create a file called `obojima-party-tracker.json` in your Gist:

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
  },
  "events": [
    {
      "id": "1",
      "title": "Festival of Lanterns",
      "year": 327,
      "era": "AD",
      "month": "Ock",
      "day": 15,
      "description": "Annual celebration in the town square",
      "isImportant": true
    }
  ],
  "adventureLog": [
    {
      "id": "session-1",
      "sessionNumber": 1,
      "title": "The Journey Begins",
      "year": 327,
      "era": "AD",
      "month": "Sep",
      "day": 10,
      "summary": "Our heroes met in the village of Windwhisper...",
      "highlights": [
        "Met the mysterious elder",
        "Discovered ancient ruins",
        "Fought shadow wolves"
      ],
      "npcsEncountered": ["Elder Kaito", "Merchant Yumi"],
      "locationsVisited": ["Windwhisper Village", "Whispering Woods"],
      "itemsAcquired": ["Map Fragment", "Silver Bell"]
    }
  ]
}
```

## Calendar System Reference

### Months (13)
1. Jan - cold clarity, new routes
2. Feb - thaw, first green
3. Mar - winds, restlessness
4. Apu - rains, repairs
5. Mei - blossoms, courting
6. Jun - bright days
7. Jol - heat, festivals
8. Aug - heavy fruit
9. Sep - harvest begins
10. Ock - lanterns, long shadows
11. Nov - fogs, quiet markets
12. Dez - frost, hearths
13. Vell - "thin sky" month; spirits nearer

**Veil Day** - Special between-day after Vell 28

### Weekdays (7)
- Tide Day
- Leaf Day
- Bell Day
- Hearth Day
- Gale Day
- Star Day
- Rest Day

### Time System
- 8 Bells per day (each = 3 hours)
- 6 Knots per Bell (each = 30 minutes)
- Format: Bell:Knot (e.g., "3:2")

### Eras
- **AF** - First Age
- **AN** - Nakudama Age
- **AH** - Human Age
- **AD** - Dara Age (current)
- **LW** - Lilywin Reckoning (scholarly system)

## Project Structure

```
src/
├── components/
│   ├── Calendar/
│   │   ├── Calendar.tsx
│   │   ├── Calendar.types.ts
│   │   └── Calendar.module.scss
│   ├── TimeOfDay/
│   │   ├── TimeOfDay.tsx
│   │   ├── TimeOfDay.types.ts
│   │   └── TimeOfDay.module.scss
│   └── AdventureLog/
│       ├── AdventureLog.tsx
│       ├── AdventureLog.types.ts
│       └── AdventureLog.module.scss
├── hooks/
│   └── useCalendarData.ts
├── types/
│   ├── calendar.types.ts
│   └── index.ts
├── utils/
│   ├── calendar.utils.ts
│   └── gist.utils.ts
├── styles/
│   ├── variables.scss
│   └── global.scss
├── App.tsx
└── main.tsx
```

## Customization

### Styling

All colors, spacing, and typography are defined in `src/styles/variables.scss`. Edit this file to customize the theme.

### Refresh Interval

Change `refreshInterval` in `GIST_CONFIG` (in milliseconds):
- `0` - No auto-refresh
- `60000` - Every minute
- `300000` - Every 5 minutes

## Deployment

Upload the contents of the `dist/` folder to your web server after running `npm run build`.

Works great with:
- Any static file hosting (Apache, Nginx, etc.)
- GitHub Pages
- Netlify
- Vercel

## License

MIT

## Credits

Built for the Obojima D&D campaign based on the Miyazaki/Legend of Zelda inspired 5e module.
