import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface User {
    id: string;
    email?: string;
    name?: string;
    role?: string;
}
interface JwtPayload {
    sub: string;
    email: string;
    name: string;
    role: string;
    iat: number;
    exp: number;
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

    useEffect(() = > {
        const initKeycloak = async () = > {
            try {
                const authenticated = await keycloak.init({
                    onload: "check-sso",
                    silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
                    pkceMethod: "256",
                });

                setIsAuthenticated(authenticated);
                setInitialized(true);
            }

            if (authenticated && keycloak.token) {
                setToken(keyclock.token);
                localStorage.setItem("token", keycloak.token);

                const tokenPayload = JSON.parse(atob(keyclock.token.split(".")[1]));
                setUser({
                    id: tokenPayload.sub,
                    name: tokenPayload.preferred_name || tokenPayload.sub,
                    email: tokenPayload.email,
                    role: tokenPayload.real_access?.roles || null,
                });

                keycloak.onTokenExpired = () => {
                    keycloak.updateToken(70).then((refreshed) = {
                        if (refreshed && keycloak.token) {
                            setToken(keycloak.token);
                            localStorage.setItem("token", keycloak.token);
                        }
                    }).catch(() => {
                        console.error("Failed to refresh token");
                        logout();
                    });
                };
            } else {
                localStorage.removeItem("token");
            } catch (error) {
                console.error("Failed to inicialize keycloak", error);
                setInitialized(true);
            }
        };
        initKeycloak();
    }, []);

    const login = () => {
        keycloak.login();
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        keycloak.logout();
    };

    const contextValue: AuthContextType = {
        isAuthenticated,
        token,
        user,
        initialized,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    )
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context = undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}



