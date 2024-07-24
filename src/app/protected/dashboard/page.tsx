"use client";
import { validateEmail } from "@/lib/util/validators";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Dashboard() {
  const [passwordResetEmail, setPasswordResetEmail] = useState("");
  const [file, setFile] = useState<File>();

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const currentFile = event.target.files[0];
      setFile(currentFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
    });
    const { signedUrl } = await response.json();
    console.log("Upload URL: ", signedUrl);
    await fetch(signedUrl, {
      method: "PUT",
      body: formData,
    });
  };
  return (
    <div>
      <h1>Dashboard</h1>
      <div className="flex flex-col gap-1">
        <button
          className="btn btn-primary w-[150px]"
          onClick={() => (window.location.href = "/admin/recent")}
        >
          Admin
        </button>
        <button
          className="btn btn-primary w-[150px]"
          onClick={() => (window.location.href = "/protected/pricing")}
        >
          Pricing
        </button>
        <button
          className="btn btn-primary w-[150px]"
          onClick={() => router.push("/protected/billing")}
        >
          Billing
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
        <div className="mt-4">
          <label
            htmlFor="file-upload"
            className="underline hover:cursor-pointer"
          >
            <span>Upload a file</span>
            <input
              type="file"
              accept="application/pdf"
              id="file-upload"
              name="file-upload"
              className="sr-only"
              onChange={handleFileChange}
            />
          </label>
        </div>
        <button
          type="submit"
          className="btn btn-primary w-[150px]"
          onClick={handleUpload}
        >
          Upload
        </button>
      </div>
    </div>
  );
}
