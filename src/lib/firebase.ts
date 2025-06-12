
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';

// User-provided Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGDpgh1-RTkJWRSMOO36OYtuGtOr5SxRw",
  authDomain: "memetrade-pro.firebaseapp.com",
  projectId: "memetrade-pro",
  storageBucket: "memetrade-pro.firebasestorage.app",
  messagingSenderId: "598241230075",
  appId: "1:598241230075:web:3c44f44049bc08ae6f045e"
  // measurementId is optional and was not included in the user-provided snippet.
  // If needed, it can be added here from process.env or hardcoded if also provided.
};

// Log the configuration being used for debugging (this log is very important)
console.log('👉 Firebase Config being used by src/lib/firebase.ts (Hardcoded):', firebaseConfig);

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);

export { app, auth };
