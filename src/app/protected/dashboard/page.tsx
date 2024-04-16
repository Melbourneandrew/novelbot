"use client";
import { validateEmail } from "@/lib/util/validators";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Dashboard() {
  const [passwordResetEmail, setPasswordResetEmail] = useState("");
  const router = useRouter();

  const callProtected = async () => {
    window.location.href = "/protected/pricing";
  };
  const requestPasswordReset = async () => {
    if (passwordResetEmail == "") {
      return;
    }
    const emailValidation = validateEmail(passwordResetEmail);
    if (!emailValidation) {
      alert("Invalid email");
      return;
    }

    const res = await fetch("/api/password/request-reset", {
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
      alert(data);
      return;
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="flex flex-col gap-1">
        <button
          className="btn btn-primary w-[150px]"
          onClick={() => callProtected()}
        >
          Pricing
        </button>
        <div>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            value={passwordResetEmail}
            onChange={(event) => setPasswordResetEmail(event.target.value)}
          />
          <button
            className="btn btn-primary w-[150px]"
            onClick={() => requestPasswordReset()}
          >
            Reset password
          </button>
        </div>
        <button
          className="btn btn-primary w-[150px]"
          onClick={() => router.push("/protected/billing")}
        >
          Billing
        </button>
      </div>
    </div>
  );
}
