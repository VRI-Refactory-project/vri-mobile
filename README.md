# vri-mobile

VRI Mobile frontend — React Native (Expo SDK 57, TypeScript).

## Getting started

```bash
npm install
cp .env.example .env   # then set EXPO_PUBLIC_API_URL for your setup
npm start              # scan the QR code with Expo Go, or press a / i / w
```

## Scripts

| Command                           | What it does                 |
| --------------------------------- | ---------------------------- |
| `npm start`                       | Start the Expo dev server    |
| `npm run android` / `ios` / `web` | Start and open on a platform |
| `npm run lint`                    | ESLint (eslint-config-expo)  |
| `npm run typecheck`               | TypeScript check             |

Add packages with `npx expo install <pkg>` (not `npm install`) so versions match the Expo SDK.

## Git hooks

Run `sh setup-hooks.sh` once after cloning to block direct commits to `main`.
