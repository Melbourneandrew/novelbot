"use client";

export default function Dashboard() {
  const callProtected = async () => {
    const response = await fetch("/api/protected");
    if (response.ok) {
      console.log("Protected data", await response.json());
    } else {
      console.error("Error", await response.text());
    }
  };
  return (
    <div>
      <h1>Dashboard</h1>
      <button
        className="btn btn-primary"
        onClick={() => callProtected()}
      >
        Protected
      </button>
    </div>
  );
}
