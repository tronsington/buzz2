#!/usr/bin/env bash
# buzz2 v1 APK build: flutter build apk --debug with buzz2 AppOverrides identity.
set -euo pipefail
cd /var/lib/buzz-acp/REPOS/buzz-upstream
. ./bin/activate-hermit >/dev/null 2>&1
export JAVA_HOME=/var/lib/buzz-acp/.toolchain/jdk
export PATH="/var/lib/buzz-acp/.toolchain/jdk/bin:$PATH"
export ANDROID_HOME=/var/lib/buzz-acp/.toolchain/android-sdk
cd mobile
echo "[1] flutter build apk --debug (first run: gradle + deps download)"
flutter build apk --debug --no-pub 2>&1 | tail -25
echo "[2] artifact:"
ls -la build/app/outputs/flutter-apk/
echo "BUILD-DONE"
