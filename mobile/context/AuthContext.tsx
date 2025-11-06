import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import * as SecureStore from 'expo-secure-store';

type Props = {
  children: ReactNode;
};

const AuthContext = createContext({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: Props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        setIsLoggedIn(true);
      }
      setLoading(false);
    };
    loadToken();
  }, []);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    SecureStore.deleteItemAsync('token');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
