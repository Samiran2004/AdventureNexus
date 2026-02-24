#!/bin/bash

# Setup ANDROID_HOME if not exists
if [ -z "$ANDROID_HOME" ]; then
    export ANDROID_HOME=$HOME/Android/Sdk
    export PATH=$PATH:$ANDROID_HOME/emulator
    export PATH=$PATH:$ANDROID_HOME/platform-tools
    echo "✅ Temporary ANDROID_HOME set to $ANDROID_HOME"
else
    echo "ℹ️ ANDROID_HOME already set to $ANDROID_HOME"
fi

# Clear Expo/Metro Cache
echo "🧹 Cleaning Expo/Metro cache..."
npx expo start -c
