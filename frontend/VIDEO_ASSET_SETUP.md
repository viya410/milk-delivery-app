# Landing page hero video

The landing page hero is wired to autoplay the supplied farm-to-delivery video from:

`frontend/public/videos/fresh-farm-hero.mp4`

Place the supplied MP4 at that exact path. Angular's build configuration already copies `frontend/public/` into the built app, so the runtime URL is `/videos/fresh-farm-hero.mp4`.

The video element uses `autoplay muted loop playsinline` so browsers that allow muted autoplay can start it on page load, including inline playback on mobile. Browsers and user settings may still prevent autoplay; the existing `assets/images/farm-hero.jpg` poster remains visible as the fallback.

Recommended validation:
1. Confirm the MP4 is present at the path above.
2. Run `npm run build` from `frontend/`.
3. Test the landing page in desktop Chrome/Safari and on an iOS/Android device.
4. Verify the poster is visible when autoplay is disabled and that the hero text and buttons remain readable over the video.
