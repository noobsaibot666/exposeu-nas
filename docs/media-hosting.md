# Self-hosted media (`public/assets/media/`)

Video files served from `https://expose-u.com/assets/media/`. nginx serves `/assets/` with a 30-day immutable cache (`nginx/default.conf`, no change needed).

- MP4s are **gitignored** (`*.mp4`). They live only in the NAS working copy, and `scripts/deploy.sh` copies that folder into the build (`public/assets/media/` → `dist/assets/media/`).
- **Version the filename** whenever a file changes (`-v1` → `-v2`): browsers and Cloudflare cache it for 30 days.
- If a file is missing, the homepage hero falls back to the Vimeo players (`src/config/homeHeroVideo.ts`).

| File | Source | Encode |
|---|---|---|
| `home-hero-desktop-v1.mp4` | `leoniswork_&_liquidrom_v1 (1080p).mp4` (superseded) | 1920×1080, H.264 CRF 26 (≤2.2 Mbps), no audio, faststart |
| `home-hero-mobile-v1.mp4` | same (superseded) | 608×1080 centre crop (9:16), H.264 CRF 24 (≤1.8 Mbps), no audio, faststart |
| `home-hero-desktop-v2.mp4` | `website_-_main_v1 (1080p).mp4` | 1920×1080, H.264 CRF 26 (≤2.2 Mbps), no audio, faststart; 10.1 MiB |
| `home-hero-mobile-v2.mp4` | same | 608×1080 centre crop (9:16), H.264 CRF 24 (≤1.8 Mbps), no audio, faststart; 6.5 MiB |

## Metaxy project film (Cloudflare R2)

`Metaxy.mov` is encoded as 1920×1080 H.264, CRF 22, without audio, with `+faststart`. The 7.37-second source (16.3 MB) becomes a 5.4 MB MP4. The original remains at `/Volumes/DATA/08_TEMP/Metaxy.mov` and is not copied into the repository.

- Bucket: `exposeu-media` (EU location hint)
- Object: `metaxy/metaxy-film-a99537fe.mp4`
- Public URL: `https://pub-0fc7e90a3d9b4ca1903e917821cfddde.r2.dev/metaxy/metaxy-film-a99537fe.mp4`
- Response metadata: `video/mp4`, `public, max-age=31536000, immutable`; byte ranges return `206 Partial Content`.

The object is currently served through the bucket's public `r2.dev` URL because the authenticated Cloudflare account has no `expose-u.com` zone available for a custom media domain. Cloudflare positions `r2.dev` for development and applies rate limits; before broad production traffic, attach this bucket to a custom domain in the `expose-u.com` zone and update the `videoSrc` in `src/data/portfolioProjects.ts`. The project detail page plays this direct MP4 using native video controls; its existing still image remains the poster and click-to-play cover.

## Project images

After adding or replacing images under `src/assets/images/thumbs/portfolio/`, run `node scripts/gen-project-image-dims.mjs`. It refreshes `src/data/projectImageDims.json`, which the project pages use for layout and to reserve image space. Project URL slugs live in `src/data/projectSlugs.json`.

