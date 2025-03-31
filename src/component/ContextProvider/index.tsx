import { createContext, ReactNode, useContext, useState } from "react";

type UserData = {
  user: string;
  pass: string;
};

// useContextで管理したい構造
type RegistrationContextType = {
  // データ構造そのもの
  userData: UserData;
  // データ構造変更のためのuseStateなHook
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
};

// contextの作成
// 公式にて「デフォルト値が必要ない場合は null を指定します」とあるため初期値はnull
export const RegistrationContext =
  createContext<RegistrationContextType | null>(null);

// プロバイダーは、contextの提供者
// contextを使用したいルートコンポーネントをラップすることでcontextを使用する範囲を指定することができる
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

// useContextはその名の通り、contextで管理されているデータにアクセスすることができる関数
// プロバイダーでラップされた範囲で、この関数を呼び出すことでcontextで管理されているデータを使用することができる。
export const useRegistrationContext = (): RegistrationContextType => {
  const context = useContext(RegistrationContext);

  if (!context) {
    throw new Error(
      "useRegistrationContext must be used within a RegistrationProvider"
    );
  }

  return context;
};
