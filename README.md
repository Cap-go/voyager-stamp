# Voyagestamp

A small mobile-first app for collecting postage stamps from your travels. Take a
photo or pick one from your gallery and it lands on a wall of perforated,
postcard-edged tiles.

Stage 1 (this repo): pure web app — React + Vite + IndexedDB, runs in any
mobile browser. Stage 2: wrap with Capacitor for iOS/Android.

## Stack

- React 19 + Vite + TypeScript
- Tailwind CSS v4
- React Router (grid + detail)
- `idb-keyval` for image storage in IndexedDB
- Vitest + Testing Library + fake-indexeddb

## Running locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run test
npm run build
```

## Project shape

```
src/
  pages/
    GridPage.tsx     header + grid + FAB
    DetailPage.tsx   full-screen photo, back, delete
  components/
    StampFrame.tsx   reusable wrapper that paints the perforated edges
    StampTile.tsx    StampFrame + <img>
    Fab.tsx          bottom-right circular "+" (rotates to × when open)
    AddSheet.tsx     Material-style speed dial: Take Photo / Choose from Gallery
  lib/
    storage.ts       list / add / get / delete stamps (idb-keyval)
    capture.ts       capturePhoto / pickFromGallery (file inputs)
    useObjectUrl.ts  hook that turns a Blob into a revocable object URL
```

The perforated stamp edges are a CSS mask in `src/index.css` (`.stamp-frame`):
a solid inner rectangle plus four repeating radial gradients that punch
semicircular notches around the perimeter.

## Stage 2: Capacitor

To wrap this as a native iOS / Android app, see [CAPACITOR.md](./CAPACITOR.md).
The only file that needs to change is `src/lib/capture.ts` — IndexedDB
storage works as-is inside the WebView.
