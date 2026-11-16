# Home hero video implementation plan

## Goal

Replace the click-gated Vimeo hero with an immediate, native, muted looping video that stays visually clean and responsive on desktop and mobile.

## Tasks

1. **Configure media URLs**
   - Add a Vite setting for the versioned Cloudflare media base URL and document the expected desktop/mobile MP4 object names.
   - Keep URLs in one small typed config module; avoid global preload tags and do not expose credentials.
2. **Replace the hero player**
   - Use one native `<video>` with media-selected landscape/portrait sources, mounted on the first homepage render with autoplay, muted, loop, inline playback, and automatic preload.
   - Remove Vimeo iframe construction, posters, deferred start, readiness overlays, postMessage loop handling, and mute UI.
   - Keep the localized mobile headline, subhead, CTA, scroll hint, and stable hero dimensions.
3. **Playback controls and accessibility**
   - Attempt autoplay immediately; expose a first-party Play/Retry control when playback is rejected or media fails.
   - Provide a keyboard-accessible pause/resume control and honor changes to `prefers-reduced-motion` by pausing automatic motion.
4. **Responsive styling**
   - Replace duplicated desktop/mobile sections and iframe crop styles with a single cover-cropped video element; preserve the existing 900 px composition breakpoint.
5. **Documentation and static verification**
   - Record required media encoding, filenames, custom-domain/cache setup, and the outstanding source-file/R2 provisioning dependency.
   - Run the allowed read-only TypeScript and targeted lint checks plus `git diff --check`; do not build or install dependencies on the shared mount.

## Blocker / completion boundary

No authorized source video files or R2 upload access were found during discovery. Frontend code can be completed, but first-party video playback and startup performance cannot be verified or deployed until the media objects and configured custom domain are available.

## Self-review

- One `<video>` with responsive `<source media>` entries ensures the browser selects one variant for its viewport.
- No poster, spinner, vendor iframe, or eager video preload outside the homepage is introduced.
- Browser autoplay restrictions and first-frame transfer time remain platform-dependent; controls and reduced-motion behavior provide accessible alternatives.
- The live R2 hostname and encoded media are external provisioning requirements and must not be represented as completed by source-only checks.
