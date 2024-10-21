import { createContext, useContext, useState, useEffect } from "react";
import { NavigateFunction } from "react-router-dom";

interface IAuthData {
  isAuthenticated: boolean;
  user: any;
  isAdmin: boolean;
  isEmployer: boolean;
}

interface IAuthContext {
  addAuthData: (authData: IAuthData) => void;
  logout: (navigate: NavigateFunction) => Promise<void>;
  removeAuthData: () => void;
  setUser: React.Dispatch<React.SetStateAction<null>>;
}

interface IAuthChildren {
  children: JSX.Element;
}

// Create auth context
export const AuthContext = createContext<IAuthData & IAuthContext>({
  user: null,
  isAdmin: false,
  isEmployer: false,
  isAuthenticated: false,
  addAuthData: () => {},
  logout: async () => {},
  removeAuthData: () => {},
  setUser: () => {},
});

export const AuthProvider = ({ children }: IAuthChildren) => {
  // State variables
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isEmployer, setIsEmployer] = useState<boolean>(false);

  // Load initial auth data from local storage
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");
    if (authToken && userData) {
      const parsedUser = JSON.parse(userData);
      setIsAuthenticated(true);
      setIsAdmin(parsedUser.isAdmin);
      setIsEmployer(parsedUser.isEmployer);
      setUser(parsedUser);
    }
  }, []);

  // Add auth data
  const addAuthData = (authData: IAuthData) => {
    setIsAuthenticated(authData.isAuthenticated);
    setIsAdmin(authData.isAdmin);
    setIsEmployer(authData.isEmployer);
    setUser(authData.user);
    localStorage.setItem("user", JSON.stringify(authData.user));
  };

  // Reset auth data
  const removeAuthData = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setIsAdmin(false);
    setIsEmployer(false);
    setUser(null);
  };

  // Logout function
  const logout = async (navigate: NavigateFunction) => {
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      setIsAdmin(false);
      setIsEmployer(false);
      setUser(null);
      navigate("/login");
    } catch (err: any) {}
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        isEmployer,
        user,
        addAuthData,
        logout,
        removeAuthData,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Using Context
export const useAuth = () => useContext(AuthContext);
