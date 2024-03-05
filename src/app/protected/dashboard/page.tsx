"use client";

export default function Dashboard() {
  const callProtected = async () => {
    window.location.href = "/protected/pricing";
  };
  return (
    <div>
      <h1>Dashboard</h1>
      <button
        className="btn btn-primary"
        onClick={() => callProtected()}
      >
        Pricing
      </button>
    </div>
  );
}
