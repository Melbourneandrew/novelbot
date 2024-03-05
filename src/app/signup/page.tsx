"use client";
import { useState } from 'react'
import LoadingWheel from "@/components/LoadingWheel";

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;
    setIsLoading(true);
    const signupResponse = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setIsLoading(false);
    if (signupResponse.ok) {
      console.log("Signed up");
      window.location.href = "/protected/dashboard";
    } else {
      const error = await signupResponse.text();
      console.error(error);
      setErrorMessage("There was an error with your signup request.");
    }
  };
  return (
    <div className="flex flex-col items-center">
      <h1>Signup</h1>
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
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {isLoading ? <LoadingWheel /> :
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        }
        <a href="/login">Login</a>

      </form>
    </div>
  );
}
