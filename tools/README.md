# buzz2 spike tooling

Backup of the sandbox-side tooling and the Android Auto differential sample
used during the v0.1.0 → v0.2.3 car-spike work. None of this is part of the
buzz2 app itself.

## aa-hello-diff/
Minimal Google-style car-app "helloworld" (com.example.aahellodiff, label
"AA Hello Diff"), car-app library 1.7.0, correct `minCarApiLevel` placement
(meta-data inside the `<service>` block, the bug v0.2.3 fixed in buzz2).
Served as the differential control for the "invisible in Customize launcher"
debug on AA 17.6.663464. Its compiled APK ships as a release asset:
`aa-hello-diff-1.7.0-debug.apk` on the `v0.2.3-car-spike` release.

Build: `tools/build-sample.sh` (expects the sandbox JDK/SDK/gradle layout;
paths at the top of the script).

## build-apk.sh
buzz2 debug-APK build: hermit flutter + sandbox JDK/SDK, runs
`flutter build apk --debug --no-pub` from `mobile/`. Used for every
v0.1.x–v0.2.x release.

## ocr/
Band-OCR scripts (tesseract.js) used to parse Android Auto settings
screenshots during the launcher-visibility debug:
- `ocr_shot.mjs <input.png>` — parameterized 4-band OCR (final version)
- `ocr_aa.mjs`, `ocr_bbox.mjs` — earlier hardcoded variants
