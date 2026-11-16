# Mobile setup (Sprint 1)

The customer application remains the existing Angular app and is wrapped with Capacitor. The admin experience remains in the web app.

## Install and generate native projects

From `frontend/`:

```bash
npm install
npx cap add android
npx cap add ios
npm run build
npm run cap:sync
```

Open native projects with:

```bash
npm run cap:open:android
npm run cap:open:ios
```

Android builds require Android Studio and a supported Android SDK. iOS builds require macOS and Xcode. Commit the generated `android/` and `ios/` projects after reviewing the native configuration.

## App configuration

- Capacitor config: `capacitor.config.ts`
- App ID: `com.milkdelivery.app`
- Angular browser output: `dist/milk-delivery-app/browser`

Before device testing, confirm the API base URL in the Angular production environment is reachable from a physical device. A device cannot use a developer machine's `localhost` as the backend host.

## Mobile behavior added

- Customer bottom navigation for Home, Shop, Plans, Orders, and Profile.
- Safe-area-aware viewport and bottom navigation spacing.
- Responsive admin shell using the existing role-aware sidebar.
- GSAP-powered product-to-cart flight animation.
- Reduced-motion preference support.

## Validation still required

Run `npm install`, `npm run build`, and `npm test` in the frontend. Then generate the native projects and test Android and iOS on real devices. This repository change does not include generated native platform folders or a backend/API migration.
