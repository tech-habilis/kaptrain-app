#!/bin/sh

# Install Node.js using Homebrew

brew install node

# Install CocoaPods using Homebrew

brew install cocoapods

# Go to root of the project
pushd ../..

# Install Node.js dependencies
npm ci

# Go back to the ios directory
popd

# Install dependencies managed with CocoaPods
pod install
