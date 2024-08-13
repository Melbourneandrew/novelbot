"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import LoadingIndicator from "@/components/LoadingIndicator";
import ErrorMessage from "@/components/ErrorMessage";
import { Fetch } from "@/lib/util/Fetch";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const passwordResetToken = useSearchParams().get("token");

  const submitNewPassword = async () => {
    setIsLoading(true);
    const res = await Fetch("/api/password/reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newPassword,
        token: passwordResetToken,
      }),
    });
    setIsLoading(false);
    if (!res.ok) {
      const data = await res.text();
      setError(data);
    }

    const data = await res.json();
    alert(data);
  };

  return (
    <div className="flex flex-col gap-2 items-start">
      <h3>Enter new password</h3>
      <input
        type="text"
        placeholder="Type here"
        className="input input-bordered w-full max-w-xs"
        value={newPassword}
        onChange={(event) => setNewPassword(event.target.value)}
      />
      <h3>Confirm new password</h3>
      <input
        type="text"
        placeholder="Type here"
        className="input input-bordered w-full max-w-xs"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
      />
      <button className="btn btn-primary w-[150px]" onClick={submitNewPassword}>
        Submit
      </button>
      <a href="/login">Login</a>
      {error && <ErrorMessage message={error} />}
      {isLoading && <LoadingIndicator />}
    </div>
  );
}
