# Capacitor Live Update Demo

⚡️ A simple Capacitor app that demonstrates the [Capacitor Live Update plugin](https://capawesome.io/plugins/live-update/).

It ships with a **pre-configured Capawesome Cloud app**, so live updates work out of the box — no account or setup required. Just install the app and try it.

## Stack

- [Capacitor](https://capacitorjs.com/) — Android + iOS
- [Ionic Core](https://ionicframework.com/docs/components) (web components, loaded from CDN) — UI, no frontend framework
- [Vite](https://vitejs.dev/) — web build
- [Swift Package Manager](https://www.swift.org/documentation/package-manager/) — native iOS dependencies (no CocoaPods)

## How it works

The screen shows a large **bundle badge** (`v1`) and a status card with the current bundle ID, channel, device ID, and last sync time.

When a newer bundle is published to the cloud, the app detects it the next time it resumes from the background and offers to reload. After reloading, the badge changes (e.g. `v1` → `v2`) — that's the live update in action, no app store update needed.

## Install & run

### Prerequisites

- [Node.js](https://nodejs.org)
- Android: [Android Studio](https://developer.android.com/studio)
- iOS: [Xcode](https://apps.apple.com/app/xcode/id497799835) (dependencies are managed with Swift Package Manager — no CocoaPods needed)

### Steps

```bash
# Clone the repository
git clone https://github.com/capawesome-team/capacitor-live-update-demo.git
cd capacitor-live-update-demo

# Install dependencies and build the web assets
npm install
npm run build

# Run on Android
npx cap run android

# Run on iOS
npx cap run ios
```

That's it. The app is already wired to a live Capawesome Cloud app, so it will receive updates automatically.

To run just the web app during development:

```bash
npm start
```

## Try a live update

1. Run the app on a device or simulator — the badge shows `v1`.
2. Push a change to `main` (or run the **Publish Live Update** workflow manually) to publish a `v2` bundle.
3. Send the app to the background, then reopen it. It detects the update and asks to reload.
4. Accept — the badge now shows `v2`. 🎉

Use **Switch channel** to move the device between channels, and **Reset to built-in bundle** to roll back to the bundle that shipped inside the app.

## Continuous Integration

Two GitHub Actions workflows are included:

- [`live-update.yml`](.github/workflows/live-update.yml) — bumps the badge to `v2`, builds the web assets, and uploads the bundle to Capawesome Cloud with the [Capawesome CLI](https://capawesome.io/docs/cloud/cli/):
  ```bash
  npx @capawesome/cli apps:liveupdates:upload --app-id <APP_ID> --path dist --channel default --yes
  ```
  Runs on every push to `main` (ignoring Markdown-only changes) and on manual dispatch. Requires the `CAPAWESOME_TOKEN` secret.

- [`native-build.yml`](.github/workflows/native-build.yml) — builds native Android and iOS apps in the cloud via [Capawesome Cloud Native Builds](https://capawesome.io/docs/cloud/native-builds/), which also verifies the SPM setup compiles. Requires the `CAPAWESOME_CLOUD_TOKEN` and `CAPAWESOME_CLOUD_APP_ID` secrets.

## Optional: use your own Capawesome Cloud app

Only needed if you want to publish your own bundles instead of using the pre-configured demo app:

1. Create an app in the [Capawesome Cloud Console](https://cloud.capawesome.io/).
2. Sign in to the CLI: `npx @capawesome/cli login`.
3. Replace the `LiveUpdate.appId` in [`capacitor.config.json`](capacitor.config.json) with your app ID.

## Key concepts

- **`LiveUpdate.ready()`** — call once on startup so a faulty bundle can be rolled back automatically if you never reach it.
- **`sync()` / `reload()` / `reset()`** — check for a new bundle, apply it, or roll back to the built-in one.
- **Channels** — route bundles to different audiences (e.g. `default`, `beta`). This demo uses the `default` channel.

See the [plugin documentation](https://capawesome.io/plugins/live-update/) for the full API.
