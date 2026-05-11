import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authStore, keyStore } from "@/services";
import { useAlert } from "./AlertProvider";
import { useLanguage } from "./LanguageProvider";

type AuthContextType = {
  token: string | null;
  userId: string | null;
  privateKey: CryptoKey | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (params: {
    token: string;
    userId: string;
    privateKey: CryptoKey;
  }) => Promise<void>;
  logout: () => Promise<void>;
  setPrivateKey: (privateKey: CryptoKey) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [privateKey, setPrivateKeyState] = useState<CryptoKey | null>(null);
  const [isReady, setIsReady] = useState(false);
  const { pushAlert } = useAlert();
  const { t } = useLanguage();

  // restore auth on app startup
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = authStore.token.get();
        const storedUserId = authStore.userId.get();
        if (!storedToken || !storedUserId) {
          setIsReady(true);
          return;
        }

        setToken(storedToken);
        setUserId(storedUserId);

        // restore private key from indexeddb
        const storedPrivateKey = await keyStore.get(storedUserId);
        if (storedPrivateKey) {
          setPrivateKeyState(storedPrivateKey);
        }
      } catch (error) {
        pushAlert(`${t("alert.failed_session_restore")}:${error}`, "error");
      } finally {
        setIsReady(true);
      }
    };

    restoreSession();
  }, []);

  const login = async ({
    token,
    userId,
    privateKey,
  }: {
    token: string;
    userId: string;
    privateKey: CryptoKey;
  }) => {
    authStore.token.set(token);
    authStore.userId.set(userId);
    await keyStore.set(userId, privateKey);
    setToken(token);
    setUserId(userId);
    setPrivateKeyState(privateKey);
  };

  const logout = async () => {
    if (userId) {
      await keyStore.clear(userId);
    }
    authStore.clearAll();
    setToken(null);
    setUserId(null);
    setPrivateKeyState(null);
  };

  const setPrivateKey = async (privateKey: CryptoKey) => {
    if (!userId) return;

    await keyStore.set(userId, privateKey);
    setPrivateKeyState(privateKey);
  };

  const value = useMemo(
    () => ({
      token,
      userId,
      privateKey,
      isAuthenticated: !!token && !!userId && !!privateKey,
      isReady,
      login,
      logout,
      setPrivateKey,
    }),
    [token, userId, privateKey, isReady],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
