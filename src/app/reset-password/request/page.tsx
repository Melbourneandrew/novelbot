"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import LoadingIndicator from "@/components/LoadingIndicator";
import ErrorMessage from "@/components/ErrorMessage";
import { Fetch } from "@/lib/util/Fetch";
import { validateEmail } from "@/lib/util/validators";
import ButtonWithLoading from "@/components/ButtonWithLoading";

export default function RequestPasswordResetPage() {
  const [passwordResetEmail, setPasswordResetEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showCheckEmailMessage, setShowCheckEmailMessage] = useState(false);

  const requestPasswordReset = async () => {
    if (passwordResetEmail == "") {
      return;
    }

    const emailValidation = validateEmail(passwordResetEmail);
    if (!emailValidation) {
      alert("Invalid email");
      return;
    }

    const res = await Fetch("/api/password/request-reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: passwordResetEmail,
      }),
    });
    if (!res.ok) {
      const data = await res.text();
      console.log(data);
      setErrorMessage(data);
      return;
    }
    setShowCheckEmailMessage(true);
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <h1>Request Password Reset</h1>

      {showCheckEmailMessage ? (
        <p className="text-xl font-bold">
          Check your email for a link to reset your password.
        </p>
      ) : (
        <>
          <h3>Enter email</h3>
          <input
            type="text"
            placeholder="Email"
            className="input input-bordered w-full max-w-xs"
            value={passwordResetEmail}
            onChange={(event) => setPasswordResetEmail(event.target.value)}
          />
          <ButtonWithLoading
            className="btn btn-primary w-[150px]"
            action={requestPasswordReset}
          >
            Request Reset
          </ButtonWithLoading>
          <a href="/login">Login</a>
          <a href="/Signup">Sign Up</a>
          {errorMessage && <ErrorMessage message={errorMessage} />}
        </>
      )}
    </div>
  );
}
