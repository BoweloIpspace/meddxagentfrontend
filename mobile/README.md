# MEDDxAgent mobile shell

This directory adds native mobile packaging around the existing React/Vite application. It does not replace or fork the web UI.

## Architecture

- `../src` remains the single application UI and clinical workflow implementation.
- `../dist` remains the Vite production output.
- Capacitor copies that same built output into the native Android project.
- `android/` is a native source artifact and is committed after generation.

## Android development

From the repository root:

```bash
npm ci
npm --prefix mobile ci
npm --prefix mobile run android:sync
npm --prefix mobile run android:open
```

The first command builds/installs the existing web application dependencies. `android:sync` runs the unchanged web production build and syncs it into the Android shell. `android:open` opens the native project in Android Studio.

## Application ID

The Android application ID is currently `com.meddxagent.app`. Treat this as permanent once an app using that ID is published to Google Play. Change it before the first store upload if a different organization-owned identifier is required.

## Release signing

No signing key, keystore, password, API token, or other secret belongs in this repository. Release signing should be configured through Android Studio/Gradle secret handling or CI secret storage when the Google Play release phase begins.

## Web safety

Mobile-specific work belongs under `mobile/` unless a cross-platform abstraction is deliberately introduced. Do not change the existing web presentation just to satisfy the Android wrapper.
