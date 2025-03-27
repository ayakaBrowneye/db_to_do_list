"use client";

import { useState } from "react";

import { RegistrationProvider } from "@/component/ContextProvider";

import RegistrationCheck from "./registrationCheck/page";
import RegistrationInput from "./registrationInput/page";

export default function Registration() {
  const [isCheckPage, setIsCheckPage] = useState<boolean>(false);

  return (
    <RegistrationProvider>
      {isCheckPage ? (
        <RegistrationCheck
          onBack={() => {
            setIsCheckPage(false);
          }}
        />
      ) : (
        <RegistrationInput
          onNext={() => {
            setIsCheckPage(true);
          }}
        />
      )}
    </RegistrationProvider>
  );
}
