"use client";
import { useState } from "react";
import LoadingIndicator from "@/components/LoadingIndicator";
import ErrorMessage from "@/components/ErrorMessage";
import { Fetch } from "@/lib/util/Fetch";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;
    setIsLoading(true);
    const loginResponse = await Fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setIsLoading(false);
    if (!loginResponse.ok) {
      const error = await loginResponse.text();
      console.error(error);
      setErrorMessage(error);
      return;
    }
    const { userIs } = await loginResponse.json();
    console.log(userIs);
    if (userIs === "reader") {
      window.location.href = "/reader";
    } else if (userIs === "author") {
      window.location.href = "/author";
    } else {
      setErrorMessage("User is of unknown type. Please contact support.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1>Login</h1>
      <form
        className="flex flex-col w-[500px] items-center space-y-3"
        onSubmit={handleSubmit}
      >
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
        {errorMessage && <ErrorMessage message={errorMessage} />}
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        )}
        <a href="/reset-password">Reset Password</a>
        <a href="/signup">Signup</a>
      </form>
    </div>
  );
}
