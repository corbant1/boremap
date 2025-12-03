# BoreMap - Borehole Mapping Application

A modern web application for managing geotechnical borehole data with interactive mapping.

## Features

- **Project Management**: Create, edit, and organize borehole projects
- **Interactive Mapping**: Visualize boreholes on a Mapbox map with click-to-add functionality
- **Data Table**: View and edit borehole data in a filterable, sortable table
- **CSV Export**: Export borehole data to CSV format
- **Offline Ready**: Data persists locally using localStorage

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Map**: Mapbox GL JS
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Mapbox access token (get one at [mapbox.com](https://mapbox.com))

### Installation

1. Clone the repository:
```bash
cd "Borehole Web App"
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_MAPBOX_TOKEN=your_mapbox_access_token_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
src/
├── components/       # Reusable UI components
├── data/            # Types and storage helpers
├── hooks/           # React hooks and context
├── map/             # Mapbox integration
├── pages/           # Page components
└── styles/          # Global styles
```

## Usage

### Creating a Project

1. Click "New project" on the home page
2. Enter project details (name, client, location)
3. Click "Create project" to navigate to the workspace

### Adding Boreholes

1. In the project workspace, click "Add borehole" in the map toolbar
2. Click on the map to place a borehole
3. Fill in the borehole details in the side panel
4. Click "Create borehole" to save

### Editing Boreholes

- Click on a map marker or table row to open the details panel
- Edit the borehole properties
- Click "Save changes" to update

### Exporting Data

1. Click "Export CSV" in the project header
2. Optionally filter to export only visible rows
3. Click "Download CSV" to save the file

## Deployment

### Deploy to GitHub

1. Create a new repository on GitHub (e.g., `boremap`)

2. Add the remote and push:
```bash
git remote add origin https://github.com/YOUR_USERNAME/boremap.git
git branch -M main
git push -u origin main
```

### Deploy to Vercel/Netlify

1. Connect your GitHub repository to Vercel or Netlify
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_MAPBOX_TOKEN` (optional, for map functionality)

## License

MIT

