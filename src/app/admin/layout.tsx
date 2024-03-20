export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1>Dashboard</h1>

      <div role="tablist" className="tabs tabs-bordered">
        <a role="tab" className="tab tab-active" href="recent">
          Recent
        </a>
        <a role="tab" className="tab" href="admin-users">
          Admin Users
        </a>
        <a role="tab" className="tab" href="db-controls">
          Database
        </a>
      </div>
      {children}
    </div>
  );
}
