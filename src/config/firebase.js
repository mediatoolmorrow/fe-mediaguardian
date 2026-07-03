import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  browserLocalPersistence,
  setPersistence,
} from 'firebase/auth';

// Firebase configuration - Replace with your actual config
const firebaseConfig = {
  apiKey: "AIzaSyDbT8COEf4ASS9B0jNhjwSGodT5wpgGEfI",
  authDomain: "mediaguardian-d761f.firebaseapp.com",
  projectId: "mediaguardian-d761f",
  storageBucket: "mediaguardian-d761f.firebasestorage.app",
  messagingSenderId: "432777412441",
  appId: "1:432777412441:web:9fcc701fcd5bd97f221648",
  measurementId: "G-0K3KDPVRM0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ใช้ localStorage แทน sessionStorage เพื่อแก้ปัญหา in-app browser (LINE/Facebook)
// ที่บล็อก sessionStorage ทำให้ Firebase OAuth state หายระหว่าง redirect
setPersistence(auth, browserLocalPersistence).catch(() => {});

// Auth providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

// Configure providers
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

facebookProvider.setCustomParameters({
  display: 'popup'
});

appleProvider.setCustomParameters({
  locale: 'th'
});

export {
  auth,
  googleProvider,
  facebookProvider,
  appleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  browserLocalPersistence,
  setPersistence,
};
