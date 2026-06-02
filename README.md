# Capacitor Live Update Demo

⚡️ A simple Ionic Angular app that demonstrates the [Capacitor Live Update plugin](https://capawesome.io/plugins/live-update/).

It ships with a **pre-configured Capawesome Cloud app**, so live updates work out of the box — no account or setup required. Just install the app and try it.

## How it works

The home screen shows a large **bundle badge** (`v1`) and a status card with the current bundle ID, channel, device ID, and last sync time.

When a newer bundle is published to the cloud, the app detects it the next time it resumes from the background and offers to reload. After reloading, the badge changes (e.g. `v1` → `v2`) — that's the live update in action, no app store update needed.

## Install & run

### Prerequisites

- [Node.js](https://nodejs.org)
- Android: [Android Studio](https://developer.android.com/studio)
- iOS: [Xcode](https://apps.apple.com/app/xcode/id497799835)

### Steps

```bash
# Clone the repository
git clone https://github.com/capawesome-team/capacitor-live-update-demo.git
cd capacitor-live-update-demo

# Install dependencies and build the web assets
npm install
npm run build

# Run on Android
npx ionic cap run android

# Run on iOS
npx ionic cap run ios
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

Use **Reset to built-in bundle** to roll back to the bundle that shipped inside the app.

## Publishing updates (CI)

The included [`publish-live-update.yml`](.github/workflows/publish-live-update.yml) workflow shows the real deployment path:

1. Bumps the badge label to `v2`.
2. Builds the web assets.
3. Uploads the bundle to Capawesome Cloud with the [Capawesome CLI](https://capawesome.io/docs/cloud/cli/):
   ```bash
   npx @capawesome/cli apps:liveupdates:upload --app-id <APP_ID> --path www --channel default --yes
   ```

It runs automatically on every push to `main` (ignoring Markdown-only changes) and can also be triggered manually from the **Actions** tab. It authenticates via a `CAPAWESOME_TOKEN` repository secret.

## Optional: use your own Capawesome Cloud app

Only needed if you want to publish your own bundles instead of using the pre-configured demo app:

1. Create an app in the [Capawesome Cloud Console](https://cloud.capawesome.io/).
2. Sign in to the CLI: `npx @capawesome/cli login`.
3. Replace the `LiveUpdate.appId` in [`capacitor.config.ts`](capacitor.config.ts) with your app ID.

## Key concepts

- **`LiveUpdate.ready()`** — call once on startup so a faulty bundle can be rolled back automatically if you never reach it.
- **`sync()` / `reload()` / `reset()`** — check for a new bundle, apply it, or roll back to the built-in one.
- **Channels** — route bundles to different audiences (e.g. `default`, `beta`). This demo uses the `default` channel.

See the [plugin documentation](https://capawesome.io/plugins/live-update/) for the full API.
