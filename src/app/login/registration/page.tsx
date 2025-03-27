"use client";

import { useState } from "react";

import { RegistrationProvider } from "@/component/ContextProvider";
import { RegistrationCheck } from "@/component/registrationCheck";
import { RegistrationInput } from "@/component/registrationInput";

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
