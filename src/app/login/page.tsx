"use client";
export default function Login() {
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;
    const loginResponse = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (loginResponse.ok) {
      console.log("Logged in");
      window.location.href = "/protected/dashboard";
    } else {
      const error = await loginResponse.text();
      console.error(error);
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
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
        <a href="/login">Login</a>
      </form>
    </div>
  );
}
