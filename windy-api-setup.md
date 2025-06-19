# Windy API Setup Instructions

To set up the Windy Point Forecast API in your local development environment:

1. Create a `.env.local` file in the project root if it doesn't already exist
2. Add the following line to your `.env.local` file:

```
VITE_WINDY_API_KEY=R8dCVN22qRoJuezR4hF6XAvVcyfdebnJ
```

3. Restart your development server to load the new environment variable

For production deployment:

- Add this environment variable to your Netlify site settings in the "Build & Deploy" > "Environment" section
- **IMPORTANT:** Never commit your `.env.local` file to the repository

## API Documentation

- Endpoint: `https://api.windy.com/api/point-forecast/v2`
- Required parameters:
  - `lat`, `lon`: Location coordinates
  - `model`: "gfs" (weather model)
  - `parameters`: ["temp", "wind", "pressure"]
  - `levels`: ["surface"]
  - `key`: API key
