#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 SymptomAI APK Builder');
console.log('========================\n');

// Check if EAS CLI is installed
try {
  execSync('eas --version', { stdio: 'ignore' });
  console.log('✅ EAS CLI is installed');
} catch (error) {
  console.log('❌ EAS CLI not found. Installing...');
  execSync('npm install -g @expo/eas-cli', { stdio: 'inherit' });
  console.log('✅ EAS CLI installed');
}

// Check if user is logged in
try {
  execSync('eas whoami', { stdio: 'ignore' });
  console.log('✅ Logged in to Expo');
} catch (error) {
  console.log('❌ Not logged in to Expo');
  console.log('Please run: eas login');
  process.exit(1);
}

// Check if project is configured
if (!fs.existsSync(path.join(__dirname, 'eas.json'))) {
  console.log('❌ EAS not configured');
  console.log('Please run: eas build:configure');
  process.exit(1);
}

console.log('✅ EAS configured');

// Get build profile from command line argument
const profile = process.argv[2] || 'preview';
const validProfiles = ['preview', 'production', 'development'];

if (!validProfiles.includes(profile)) {
  console.log(`❌ Invalid profile: ${profile}`);
  console.log(`Valid profiles: ${validProfiles.join(', ')}`);
  process.exit(1);
}

console.log(`\n🔨 Building APK with profile: ${profile}`);
console.log('This may take 10-20 minutes...\n');

try {
  execSync(`eas build --platform android --profile ${profile}`, { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  
  console.log('\n🎉 Build completed successfully!');
  console.log('📱 Check your Expo dashboard for download link');
  console.log('🔗 Or run: eas build:list');
  
} catch (error) {
  console.log('\n❌ Build failed');
  console.log('🔍 Check the error above or run: eas build:list');
  process.exit(1);
}