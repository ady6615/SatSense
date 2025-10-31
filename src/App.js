import React, { useEffect, useState } from "react";
import { auth, provider } from "./firebase";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage"; // Import the LandingPage component
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const handleLogin = async (userData) => {
    // User is automatically set by onAuthStateChanged
    // This function is called from LandingPage after successful login
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      {!user ? (
        <LandingPage onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;