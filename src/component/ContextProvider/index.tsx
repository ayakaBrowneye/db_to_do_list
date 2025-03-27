import { createContext, ReactNode, useContext, useState } from "react";

type UserData = {
  user: string;
  pass: string;
};

type RegistrationContextType = {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
};

export const RegistrationContext = createContext<
  RegistrationContextType | undefined
>(undefined);

export const RegistrationProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData>({
    user: "",
    pass: "",
  });

  return (
    <RegistrationContext.Provider value={{ userData, setUserData }}>
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistrationContext = (): RegistrationContextType => {
  const context = useContext(RegistrationContext);

  if (!context) {
    throw new Error(
      "useRegistrationContext must be used within a RegistrationProvider"
    );
  }

  return context;
};
