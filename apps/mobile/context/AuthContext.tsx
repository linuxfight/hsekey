import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Props = {
  children: ReactNode;
};

const AuthContext = createContext({
  isLoggedIn: false,
  login: () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: Props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Here you would typically check for a token in AsyncStorage
    // For now, we'll just simulate a delay
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const login = () => {
    setIsLoggedIn(true);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
