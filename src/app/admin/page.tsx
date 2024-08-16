export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <a href="/author">Authors</a>
      <a href="/reader">Readers</a>
      <br></br>
      <a href="/signup/author">Author Signup</a>
      <a href="/signup/reader">Reader Signup</a>
      <br></br>
      <a href="/login">Login</a>
      <a href="/signup">Signup</a>
      <a href="/protected/dashboard">Protected</a>
      <a href="/protected/pricing">Pricing</a>
      <a href="/admin/recent">Admin</a>
    </div>
  );
}
