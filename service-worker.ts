const CACHE_NAME = 'tangerine-peeler-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/constants.ts',
  '/services/geminiService.ts',
  '/services/rankingService.ts',
  '/metadata.json',
  // components
  '/components/MainMenu.tsx',
  '/components/CreativePeeling.tsx',
  '/components/SpeedPeeling.tsx',
  '/components/Shop.tsx',
  '/components/Gallery.tsx',
  '/components/Ranking.tsx',
  '/components/Settings.tsx',
  '/components/Upgrades.tsx',
  '/components/Tangerine.tsx',
  // icons
  '/components/icons/BackIcon.tsx',
  '/components/icons/ClockIcon.tsx',
  '/components/icons/CoinIcon.tsx',
  '/components/icons/FireIcon.tsx',
  '/components/icons/GalleryIcon.tsx',
  '/components/icons/LeaderboardIcon.tsx',
  '/components/icons/PaletteIcon.tsx',
  '/components/icons/SettingsIcon.tsx',
  '/components/icons/ShopIcon.tsx',
  '/components/icons/TrophyIcon.tsx',
  '/components/icons/UpgradeIcon.tsx',
  // external dependencies from esm.sh
  'https://esm.sh/react@^19.1.1',
  'https://esm.sh/react@^19.1.1/',
  'https://esm.sh/react-dom@^19.1.1/',
  'https://esm.sh/@google/genai@^1.13.0'
];

self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Add all URLs to cache, but don't fail the install if one fails
        return cache.addAll(urlsToCache).catch(err => {
          console.error('Failed to cache all files:', err);
        });
      })
  );
});

self.addEventListener('fetch', (event: any) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Not in cache, go to network
        return fetch(event.request);
      }
    )
  );
});