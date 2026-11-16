# Home hero video delivery design

**Status:** Approved by the user for implementation on 2026-11-16.

**Implementation update (2026-11-16):** `HomeV2` now uses one responsive native video with localized playback controls and reduced-motion handling. The media base URL intentionally has no source-code fallback; the R2 objects and `VITE_HOME_HERO_VIDEO_BASE_URL` must be provisioned before the homepage can display moving footage. Browser performance acceptance remains pending real assets and a deployed custom domain.

## Goal

Show the homepage hero’s moving video immediately on desktop and mobile, muted and looping, with no poster image, loading indicator, progress bar, or third-party player branding.

The video must be requested on the first homepage render rather than after a click or idle delay. The existing page headline and primary CTA remain layered over the video.

## User-visible behavior

- The browser attempts muted, inline autoplay on both screen sizes and loops the video.
- The hero has no poster attribute and no loading UI. Before the first frame is downloaded and decoded, the video area may be blank; a web page cannot show a moving frame before media bytes arrive.
- If autoplay is rejected or media loading fails, show a small first-party Play or Retry button. Do not show a spinner or substitute an image.
- Provide a keyboard-accessible first-party Pause/Play control once the video is available. Honor reduced-motion preferences by not starting motion automatically for visitors who request reduced motion.
- Keep the current responsive hero layout, headline, CTA, and video crop behavior.

## Hosting and playback decision

Use Cloudflare R2 to store and serve two optimized progressive MP4 files: one landscape desktop loop and one portrait mobile loop. Render them in one native HTML `<video>` element with `<source media>` selection so the browser requests only the matching variant. The player has no vendor chrome or logo.

Use a dedicated custom domain on the existing Cloudflare-managed zone, attach it to the R2 bucket, and configure cache rules for the versioned MP4 paths. Set the correct `video/mp4` content type and long-lived immutable caching for content-hashed filenames. Verify byte-range responses through the custom domain before release.

R2 is selected for these short, fixed hero loops because it avoids iframe/player initialization and gives the site direct control over the video element. R2 does not transcode video, so the source variants must be encoded and reviewed before upload. Current R2 pricing includes 10 GB-month storage and 10 million Class B operations per month; internet egress is free. See [R2 pricing](https://developers.cloudflare.com/r2/pricing/), [R2 custom-domain caching](https://developers.cloudflare.com/cache/interaction-cloudflare-products/r2/), and [R2 range support](https://developers.cloudflare.com/r2/api/s3/api/).

Cloudflare Stream remains the fallback if the MP4 pilot cannot meet mobile startup and rebuffer targets. Stream automatically creates adaptive HLS/DASH renditions, but adds segmented playback and minutes-delivered billing. Current pricing is $5 per 1,000 stored minutes of capacity per month and $1 per 1,000 delivered minutes; encoding and bandwidth are included. See [Stream pricing](https://developers.cloudflare.com/stream/pricing/) and [custom HLS/DASH playback](https://developers.cloudflare.com/stream/viewing-videos/using-own-player/).

## Asset requirements

- Reuse the existing landscape and portrait hero footage if source files are available and authorized for export from Vimeo; otherwise obtain the originals from the owner.
- Trim each clip to an 8-second seamless loop, remove the audio track, and encode a widely supported H.264 MP4 with the MP4 index placed at the beginning (`+faststart`). FFmpeg documents `+faststart` as moving the index to the beginning to improve playback startup; see [FFmpeg MP4 options](https://ffmpeg.org/ffmpeg-formats.html).
- Start with 1280×720 landscape and 720×1280 portrait at 24 fps. Target no more than 1.5 MB per variant while preserving an acceptable visual match to the current hero. If the target cannot be met at acceptable quality, record the measured size and compare a Stream pilot instead of silently lowering quality further.
- Use content-hashed filenames so replacements can use long cache lifetimes without stale media.

## Frontend behavior

- Replace the deferred Vimeo iframe state in `src/pages/HomeV2.tsx` with one native `<video>` element present on the first React render of the homepage.
- Set `autoplay`, `muted`, `loop`, `playsInline`, and `preload="auto"`; omit `poster` and vendor controls. Do not defer the source with `requestIdleCallback`, viewport intersection, or a click-to-start gate.
- Select desktop/mobile MP4 with source media conditions matching the existing 900 px breakpoint. Handle a breakpoint change by reselecting the source and loading only the new variant.
- Keep the hero’s existing headline and CTA overlay. Add a small, accessible first-party pause/resume control that does not appear as player branding.
- On autoplay rejection, show a Play control. On media error, show Retry and keep the hero layout stable. Neither state displays a progress indicator or image fallback.
- Do not request hero video assets on non-homepage routes. Avoid a global preload tag that downloads the files on every route.

## Performance and acceptance checks

1. On `/` and `/de`, the browser requests the correct video variant during the first homepage render and never requests both variants for one viewport.
2. No poster image, spinner, progress bar, Vimeo/YouTube iframe, logo, or player chrome appears in the hero.
3. The first decoded video frame is visible within 2 seconds on the agreed cold-cache desktop and mobile lab profiles; record the test network and device profile with the result. Browsers may ignore autoplay or preload hints, so also record any rejection or delay.
4. Each delivered MP4 is at most 1.5 MB, returns `video/mp4`, supports a valid `Range` request with `206 Partial Content`, and is served from Cloudflare cache after warm-up.
5. Homepage H1/CTA remain visible and the hero keeps its reserved dimensions while media is loading. No other route requests the hero MP4s.
6. Test autoplay, loop, pause/resume, error/retry, breakpoint change, keyboard focus, and `prefers-reduced-motion` in current desktop Chrome, Firefox, Safari, and mobile Safari/Chrome.
7. Compare cold-cache transferred bytes and time to first frame against the existing Vimeo baseline. If R2 MP4 stalls on mobile or misses the startup target, run a one-video Cloudflare Stream comparison before changing the selected host.

## Browser and accessibility limits

Muted inline autoplay is the most compatible configuration, but browsers and device settings can still reject playback. In that case the first-party Play control is the recovery path; no implementation can guarantee motion before video data is fetched and decoded. The native video element’s autoplay/preload behavior is documented by [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video).

Because this moving hero runs alongside page content for more than five seconds, include a mechanism to pause, stop, or hide it, as required by [WCAG 2.2.2](https://www.w3.org/TR/WCAG22/#pause-stop-hide). Honor `prefers-reduced-motion` by keeping playback paused until the visitor starts it.

## Out of scope

- Changing videos elsewhere on the site or in the portfolio lightbox.
- Deploying the R2 bucket, changing DNS, or publishing a new build before the implementation is reviewed and tested.
- Replacing Cloudflare R2 with Stream unless the agreed mobile startup and playback checks fail.
