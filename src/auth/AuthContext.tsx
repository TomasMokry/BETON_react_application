import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { BASE_URL } from "../config";

interface User {
  id: string;
  email?: string;
  name?: string;
  role?: string;
}
interface JwtPayload {
  sub: string;
  email?: string;
  name?: string;
  role?: string;
  iat: number;
  exp: number;
}

interface JwtResponse {
  token: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  const setAuthentication = (accessToken: string) => {
    const decodedToken = jwtDecode<JwtPayload>(accessToken);
    setToken(accessToken);
    setIsAuthenticated(true);
    setUser({
      id: decodedToken.sub,
      email: decodedToken.email,
      name: decodedToken.name,
      role: decodedToken.role,
    });
    localStorage.setItem("token", accessToken);
  };

  const clearAuthentication = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await fetch(`${BASE_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
        console.error("Token refreshed");
        if (response.ok) {
          const data: JwtResponse = await response.json();
          setAuthentication(data.token);
        } else {
          clearAuthentication();
        }
      } catch (error) {
        console.error("Failed to initialize authentication:", error);
        clearAuthentication();
      } finally {
        setInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error("Invalid email or password");
    }
    const data: JwtResponse = await response.json();
    setAuthentication(data.token);
  };
  const logout = async () => {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearAuthentication();
    }
  };
  const contextValue: AuthContextType = {
    isAuthenticated,
    token,
    user,
    initialized,
    login,
    logout,
  };
  return (
    <AuthContext.Provider value={contextValue}>
      {" "}
      {children}{" "}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
