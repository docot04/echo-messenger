import { useRef, type ReactNode, createContext } from "react";

type StackContextType = {
  register: () => number;
  unregister: () => void;
  isTop: (id: number) => boolean;
};

export const StackContext = createContext<StackContextType | null>(null);

export const FocusStackProvider = ({ children }: { children: ReactNode }) => {
  const stack = useRef<number[]>([]);
  let idCounter = useRef(0);

  const register = () => {
    const id = ++idCounter.current;
    stack.current.push(id);
    return id;
  };

  const unregister = () => {
    stack.current.pop();
  };

  const isTop = (id: number) => {
    return stack.current[stack.current.length - 1] === id;
  };

  return (
    <StackContext.Provider value={{ register, unregister, isTop }}>
      {children}
    </StackContext.Provider>
  );
};
