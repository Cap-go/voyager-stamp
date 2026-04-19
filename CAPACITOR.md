# Adding Capacitor to Voyager Stamp

This guide turns the web app into a native iOS and Android binary using
[Capacitor](https://capacitorjs.com). Storage stays in IndexedDB (works fine
inside the WebView); only the camera layer needs to swap.

## Prerequisites

- **iOS**: macOS with Xcode 15+ and CocoaPods (`sudo gem install cocoapods`)
- **Android**: Android Studio with an SDK + emulator installed
- An Apple Developer account if you want to run on a physical iPhone or ship
  to TestFlight / App Store

## 1. Install Capacitor

From the project root:

```bash
npm install @capacitor/core @capacitor/cli
```

## 2. Initialize the Capacitor config

```bash
npx cap init
```

When prompted:

- App name: `Voyager Stamp`
- App ID: `com.capgo.voyagerstamp` (reverse-DNS; Android IDs can't contain spaces or hyphens, so concatenate)
- Web directory: `dist`

This creates `capacitor.config.ts`. Open it and confirm:

```ts
import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.capgo.voyagerstamp',
  appName: 'Voyager Stamp',
  webDir: 'dist',
}

export default config
```

## 3. Build the web app

Capacitor copies `dist/` into the native projects on every sync, so build
first:

```bash
npm run build
```

## 4. Add the native platforms

```bash
npm install @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android
```

This generates `ios/` and `android/` directories at the repo root. Both are
real Xcode / Gradle projects — commit them.

## 5. Install the camera plugin

```bash
npm install @capacitor/camera
npx cap sync
```

`cap sync` copies the web `dist/` and the new plugin's native code into both
platforms.

## 6. Swap the capture layer

Replace `src/lib/capture.ts` with the native version:

```ts
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'

async function getPhoto(source: CameraSource): Promise<File | null> {
  try {
    const photo = await Camera.getPhoto({
      source,
      resultType: CameraResultType.Uri,
      quality: 90,
    })
    if (!photo.webPath) return null
    const blob = await (await fetch(photo.webPath)).blob()
    return new File(
      [blob],
      `stamp-${Date.now()}.${photo.format}`,
      { type: blob.type },
    )
  } catch {
    return null
  }
}

export const capturePhoto = () => getPhoto(CameraSource.Camera)
export const pickFromGallery = () => getPhoto(CameraSource.Photos)
```

The rest of the app — `storage.ts`, all components, all pages — does not
change. `idb-keyval` works inside the Capacitor WebView.

## 7. Configure permissions

### iOS

Edit `ios/App/App/Info.plist` and add inside the top-level `<dict>`:

```xml
<key>NSCameraUsageDescription</key>
<string>Voyager Stamp uses your camera to capture postage stamps from your travels.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Voyager Stamp accesses your photo library so you can add existing photos as stamps.</string>
```

iOS will refuse to launch the app if these strings are missing.

### Android

Edit `android/app/src/main/AndroidManifest.xml` and add inside `<manifest>`:

```xml
<uses-permission android:name="android.permission.CAMERA"/>
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES"/>
```

The last permission is for Android 13+; the older one stays for backwards
compatibility.

## 8. The build → sync → run loop

Every time you change web code:

```bash
npm run build && npx cap sync
```

Then open the native project and run from there:

```bash
npx cap open ios       # opens Xcode
npx cap open android   # opens Android Studio
```

In Xcode: pick a simulator (or device), then ⌘R.
In Android Studio: pick an emulator (or device), then click ▶︎.

For a faster iteration loop during development, you can serve the dev server
to the simulator instead of rebuilding each time. Add to
`capacitor.config.ts`:

```ts
server: {
  url: 'http://localhost:5173',
  cleartext: true,
},
```

Then `npm run dev` and `npx cap run ios` or `npx cap run android`. Remove
this block before shipping.

## 9. App icons and splash screen

Capacitor doesn't generate these automatically. The easiest path:

```bash
npm install -D @capacitor/assets
# place a 1024x1024 icon and 2732x2732 splash image at:
#   resources/icon.png
#   resources/splash.png
npx capacitor-assets generate
```

You can use `public/voyager-stamp.svg` as the source — export it to a 1024px
PNG with a solid background first (the SVG has a paper background already,
but the perforations make the silhouette non-rectangular, so add an opaque
square behind it for the icon).

## 10. (Optional) Capgo OTA updates

Since this app lives on the Cap-go org, you almost certainly want OTA
updates so JS-only changes ship without store review:

```bash
npm install @capgo/capacitor-updater
npx cap sync
```

Then in `src/main.tsx`:

```ts
import { CapacitorUpdater } from '@capgo/capacitor-updater'

CapacitorUpdater.notifyAppReady()
```

Set up the channel and CI deploy as documented at
[capgo.app/docs](https://capgo.app/docs/).

---

That's the full path from "web app" to "shipping native app". The only
non-obvious step is permission strings — both stores will reject builds
without them.
