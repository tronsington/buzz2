#!/usr/bin/env bash
export JAVA_HOME=/var/lib/buzz-acp/.toolchain/jdk
export ANDROID_HOME=/var/lib/buzz-acp/.toolchain/android-sdk
export ANDROID_SDK_ROOT=$ANDROID_HOME
export PATH=$JAVA_HOME/bin:$PATH
GRADLE_BIN=$(ls -d /var/lib/buzz-acp/.gradle/wrapper/dists/gradle-8.14.5-all/*/gradle-8.14.5/bin/gradle 2>/dev/null | head -n1)
[ -z "$GRADLE_BIN" ] && GRADLE_BIN=$(ls -d ~/.gradle/wrapper/dists/gradle-8.14.5-all/*/gradle-8.14.5/bin/gradle 2>/dev/null | head -n1)
echo "gradle: $GRADLE_BIN"
cd /var/lib/buzz-acp/.scratch/aa-helloworld
"$GRADLE_BIN" --no-daemon assembleDebug 2>&1
echo "EXIT:$?"
