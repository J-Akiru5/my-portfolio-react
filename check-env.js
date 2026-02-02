// Debug script to check environment variables during Docker build
console.log('='.repeat(80));
console.log('🔍 ENVIRONMENT VARIABLES CHECK');
console.log('='.repeat(80));

const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_MEASUREMENT_ID',
  'VITE_ADMIN_GATEWAY_KEY',
  'VITE_GEMINI_API_KEY'
];

let allPresent = true;

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value && value.length > 0) {
    // Show first 10 chars for security
    const preview = varName.includes('KEY') || varName.includes('ID') 
      ? value.substring(0, 10) + '...[' + value.length + ' chars total]'
      : value;
    console.log(`✅ ${varName}: ${preview}`);
  } else {
    console.log(`❌ ${varName}: MISSING OR EMPTY`);
    allPresent = false;
  }
});

console.log('='.repeat(80));
if (allPresent) {
  console.log('✅ All environment variables are present!');
  process.exit(0);
} else {
  console.log('❌ Some environment variables are missing!');
  process.exit(1);
}
