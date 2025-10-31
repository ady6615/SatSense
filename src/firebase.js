// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCRVkLAIFXTE18IMFhT7IZ59xtSxRKsuBc",
  authDomain: "satsense-c4465.firebaseapp.com",
  projectId: "satsense-c4465",
  storageBucket: "satsense-c4465.firebasestorage.app",
  messagingSenderId: "358178616219",
  appId: "1:358178616219:web:35aebae962f8ff3c34273e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
