# Action App public assets

Drop these files into `v2/public/`.

Generated image assets:
- `icon-512.png` — 512×512 app icon
- `icon-192.png` — 192×192 Android/PWA icon
- `apple-touch-icon.png` — 180×180 iOS touch icon
- `favicon.png` — 32×32 browser favicon
- `og-share-image.png` — 1200×630 social preview image

HTML changes included:
- Favicon / Apple touch icon / PWA manifest tags
- Open Graph and Twitter preview tags
- Page titles updated to Action App

Production note: many social platforms prefer an absolute `og:image` URL. Once your domain is live, change `og-share-image.png` to your full URL, for example `https://your-domain.com/og-share-image.png`.
