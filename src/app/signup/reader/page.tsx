"use client";
import { useState } from "react";
import LoadingIndicator from "@/components/LoadingIndicator";
import {
  validateEmail,
  validatePassword,
  validateDisplayName,
} from "@/lib/util/validators";

export default function ReaderSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    const displayName = form.displayName.value;
    const displayNameValidation = validateDisplayName(displayName);
    if (displayNameValidation != "") {
      setErrorMessage(displayNameValidation);
      return;
    }

    const email = form.email.value;
    const emailValidation = validateEmail(email);
    if (!emailValidation) {
      setErrorMessage("Enter a valid email address");
      return;
    }

    const password = form.password.value;
    const passwordValidation = validatePassword(password);
    if (passwordValidation != "") {
      setErrorMessage(passwordValidation);
      return;
    }

    setIsLoading(true);
    const signupResponse = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, displayName, role: "reader" }),
    });
    setIsLoading(false);
    if (signupResponse.ok) {
      console.log("Signed up");
      window.location.href = "/reader";
    } else {
      const error = await signupResponse.text();
      console.error(error);
      setErrorMessage(error);
    }
  };
  return (
    <div className="flex flex-col items-center">
      <h1>Reader Signup</h1>
      <form
        className="flex flex-col w-[500px] items-center space-y-3"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Display Name"
          name="displayName"
          className="input input-bordered w-full max-w-xs"
        />
        <input
          type="text"
          placeholder="Email"
          name="email"
          className="input input-bordered w-full max-w-xs"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input input-bordered w-full max-w-xs"
          required
          current-password="true"
        />
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        )}
        <a href="/login">Login</a>
      </form>
    </div>
  );
}
