export default function LandingNavBar() {
  return (
    <header className="bg-white">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <a className="block font-extrabold text-2xl no-underline" href="/">
          Novelbot 🤖
        </a>

        <div className="flex flex-1 items-center justify-end md:justify-between">
          {/* Nav links */}
          <nav aria-label="Global" className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm">
              <li>
                <a
                  className="text-gray-500 transition hover:text-gray-500/75"
                  href="#"
                >
                  {" "}
                  About{" "}
                </a>
              </li>

              <li>
                <a
                  className="text-gray-500 transition hover:text-gray-500/75"
                  href="/pricing"
                >
                  {" "}
                  Pricing{" "}
                </a>
              </li>

              <li>
                <a
                  className="text-gray-500 transition hover:text-gray-500/75"
                  href="#"
                >
                  {" "}
                  Socials{" "}
                </a>
              </li>
            </ul>
          </nav>
          {/* Login / Signup buttons */}
          <div className="flex items-center gap-4">
            <div className="sm:flex sm:gap-4">
              <button
                className="btn btn-primary btn-outline"
                onClick={() => (window.location.href = "/login")}
              >
                Login
              </button>

              <button
                className="btn btn-primary"
                onClick={() => (window.location.href = "/signup/author")}
              >
                Sign Up
              </button>
            </div>

            <button className="block rounded bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden">
              <span className="sr-only">Toggle menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
