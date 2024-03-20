export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <a href="/login">Login</a>
      <a href="/signup">Signup</a>
      <a href="/protected/dashboard">Protected</a>
      <a href="/protected/pricing">Pricing</a>
      <a href="/admin/recent">Admin</a>
    </div>
  );
}
