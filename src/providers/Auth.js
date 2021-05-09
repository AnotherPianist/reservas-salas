import React, { useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [loaded, setLoaded] = useState(false);

  const value = { user, login, logout };

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut();
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        user.getIdTokenResult().then((token) => {
          console.log(user, token);
          setUser((prevState) => ({
            ...prevState,
            admin: token.claims.admin
          }));
        });
      }
    });
    setLoaded(true);
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {loaded && children}
    </AuthContext.Provider>
  );
}

export default useAuth;
