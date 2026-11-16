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
