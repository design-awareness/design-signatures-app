import { registerRoute } from "workbox-routing";
import {
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate,
} from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";

const STATIC_PREFIXES = ["/build/", "/images/"];
const STATIC_RESOURCES = [
  "/favicon.png",
  "/index.css",
  "/manifest.webmanifest",
];

const PAGE_TIMEOUT_SECONDS = 3;

// Cache Inter stylesheet with a stale-while-revalidate strategy
registerRoute(
  ({ url }) => url.href === "https://rsms.me/inter/inter.css",
  new StaleWhileRevalidate({
    cacheName: "rsms-inter-stylesheet",
  })
);

// Cache webfonts with a cache-first strategy for 1 year
registerRoute(
  ({ url }) => url.origin === "https://rsms.me",
  new CacheFirst({
    cacheName: "rsms-inter-webfonts",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);

if (self.location.hostname !== "localhost") {
  // Cache static webapp resources
  registerRoute(
    ({ url }) =>
      url.origin === self.location.origin &&
      (STATIC_PREFIXES.some((prefix) => url.pathname.startsWith(prefix)) ||
        STATIC_RESOURCES.includes(url.pathname)),
    new StaleWhileRevalidate({
      cacheName: "webapp",
    })
  );

  // Network first strategy for page resources
  registerRoute(
    ({ request }) => request.mode === "navigate",
    new NetworkFirst({
      networkTimeoutSeconds: PAGE_TIMEOUT_SECONDS,
      cacheName: "page",
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );
}
