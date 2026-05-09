import { createContext, useContext, useState, type ReactNode } from "react";
import { Alert } from "../components";

type AlertType = "success" | "info" | "error";

type AlertData = {
  id: number;
  text: string;
  type: AlertType;
};

type ContextType = {
  pushAlert: (text: string, type?: AlertType) => void;
};

const AlertContext = createContext<ContextType | null>(null);

export const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) {
    throw new Error("useAlert must be used inside AlertProvider");
  }

  return ctx;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);

  const pushAlert = (text: string, type: AlertType = "info") => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setAlerts((prev) => prev.filter((x) => x.id !== id));
    }, 3000);
  };

  return (
    <AlertContext.Provider value={{ pushAlert }}>
      {children}

      <div className="alert-container">
        {alerts.map((alert) => (
          <Alert key={alert.id} text={alert.text} type={alert.type} />
        ))}
      </div>
    </AlertContext.Provider>
  );
};
