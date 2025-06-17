# Doomsday Clock GPT

A React application featuring a Doomsday Clock visualization and an AI chat interface to discuss global risk factors.

## Features

- Interactive Doomsday Clock visualization with animated hands
- Digital countdown display showing seconds to midnight
- Chat interface to ask questions about global threats
- Mobile-first, responsive design with neon visual effects
- Accessibility features for keyboard navigation and screen readers

## Local Development

### Prerequisites

- Node.js (v14+) and npm

### Setup

1. Clone this repository:
```
git clone https://github.com/lerskytech/NukeIntel.com.git
cd NukeIntel.com
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

To build the application for production:

```
npm run build
```

This will create a `dist` folder with the compiled assets.

## Deployment

### GitHub Pages

1. Update the `vite.config.js` file to include your base path:
```js
export default defineConfig({
  plugins: [react()],
  base: '/NukeIntel.com/', // For GitHub Pages
})
```

2. Deploy using GitHub Actions or manually:
```
npm run build
git add dist -f
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix dist origin gh-pages
```

### Netlify

1. Log in to your Netlify account
2. Click "New site from Git"
3. Connect to your GitHub repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy site"

#### Environment Variables

If you implement the actual OpenAI integration, you will need to set the `VITE_OPENAI_API_KEY` environment variable in your Netlify dashboard.

## License

MIT License

## Credits

- Created with React and Vite
- Styled with TailwindCSS
- Doomsday Clock concept based on the [Bulletin of the Atomic Scientists](https://thebulletin.org/doomsday-clock/)
