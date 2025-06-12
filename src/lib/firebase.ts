
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';

// Explicitly load environment variables
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID; // Optional

// Enhanced check for critical Firebase config variables
if (!apiKey || apiKey === "YOUR_API_KEY" || apiKey.length < 10) {
  console.error(
    "🛑 CRITICAL FIREBASE CONFIG ERROR: NEXT_PUBLIC_FIREBASE_API_KEY is missing, a placeholder, or invalid." +
    "\n\n  ➡️ Please ensure the following:" +
    "\n    1. You have a '.env' file in the root of your project." +
    "\n    2. It contains the line: NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_ACTUAL_KEY_FROM_FIREBASE" +
    "\n       (Replace YOUR_ACTUAL_KEY_FROM_FIREBASE with the real key from your Firebase project)." +
    "\n    3. All other NEXT_PUBLIC_FIREBASE_... variables (authDomain, projectId, etc.) are also correctly set in '.env'." +
    "\n    4. You obtained these keys from your Firebase project: Go to Project Settings (gear icon) -> General tab -> Your Web App section." +
    "\n    5. 🔥 MOST IMPORTANT: After creating or modifying the '.env' file, YOU MUST RESTART your Next.js development server (e.g., stop 'npm run dev' and run it again)." +
    `\n\n  Current value found for NEXT_PUBLIC_FIREBASE_API_KEY: '${apiKey}'` +
    "\n  If the value above is 'undefined' or still a placeholder, your .env file is not set up correctly or not being loaded."
  );
}
if (!authDomain) {
  console.warn("⚠️ FIREBASE CONFIG WARNING: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is missing from .env. This is usually required.");
}
if (!projectId) {
  console.warn("⚠️ FIREBASE CONFIG WARNING: NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing from .env. This is usually required.");
}


const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId,
};

// Log the configuration being used for debugging (this log is very important)
console.log('👉 Firebase Config being used by src/lib/firebase.ts (CHECK THIS CAREFULLY):', firebaseConfig);

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);

export { app, auth };
