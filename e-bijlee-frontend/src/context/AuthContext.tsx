// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axiosClient from "../api/axiosClient";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  meterId?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (payload: {
    name: string;
    email: string;
    meterId: string;
    password: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  setUserState: (u: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load token from localStorage on initial mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      // optional: set default header (also handled in axiosClient)
      axiosClient.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;

      // fetch /auth/me to get user details
      axiosClient
        .get("/auth/me")
        .then((res) => {
          if (res.data && res.data.success) setUser(res.data.data);
        })
        .catch((err) => {
          console.warn("Unable to rehydrate user from token:", err);
          // invalid token -> remove it
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // LOGIN
  const login = async (email: string, password: string) => {
    try {
      const res = await axiosClient.post("/auth/login", { email, password });

      if (res.data?.success && res.data?.token && res.data?.data?.user) {
        const t = res.data.token;
        const u = res.data.data.user;

        // store
        localStorage.setItem("token", t);
        setToken(t);
        setUser(u);

        // ensure axios has header too
        axiosClient.defaults.headers.common["Authorization"] = `Bearer ${t}`;

        return { success: true };
      } else {
        return { success: false, message: res?.data?.message || "Login failed" };
      }
    } catch (err: any) {
      console.error("Login error:", err?.response?.data || err.message || err);
      return {
        success: false,
        message: err?.response?.data?.message || "Login error",
      };
    }
  };

  // REGISTER
  const register = async (payload: {
    name: string;
    email: string;
    meterId: string;
    password: string;
  }) => {
    try {
      const res = await axiosClient.post("/auth/register", payload);

      if (res.data?.success) {
        // if your register API returns a token + user, use same pattern as login
        // otherwise return success so frontend can call login afterwards
        if (res.data?.token && res.data?.data?.user) {
          const t = res.data.token;
          const u = res.data.data.user;
          localStorage.setItem("token", t);
          setToken(t);
          setUser(u);
          axiosClient.defaults.headers.common["Authorization"] = `Bearer ${t}`;
        }
        return { success: true };
      } else {
        return { success: false, message: res.data?.message || "Register failed" };
      }
    } catch (err: any) {
      console.error("Register error:", err?.response?.data || err.message || err);
      return {
        success: false,
        message: err?.response?.data?.message || "Register error",
      };
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    // remove default header
    delete axiosClient.defaults.headers.common["Authorization"];
  };

  const setUserState = (u: User | null) => setUser(u);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        setUserState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
