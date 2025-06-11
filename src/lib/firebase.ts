
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Adicionando verificação explícita para a chave de API
if (!firebaseConfig.apiKey) {
  console.error(
    "ERRO CRÍTICO: A Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) está ausente ou indefinida." +
    " Verifique se ela está corretamente configurada no seu arquivo .env e se o servidor de desenvolvimento foi reiniciado." +
    " Você pode obter esta chave no console do Firebase, nas configurações do seu projeto web."
  );
  // Considerar lançar um erro aqui pode ser útil em alguns cenários de build,
  // mas para desenvolvimento, um log claro pode ser suficiente inicialmente.
  // Ex: throw new Error("Configuração do Firebase incompleta: API Key ausente.");
}

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);

export { app, auth };
