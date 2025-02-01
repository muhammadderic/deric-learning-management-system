import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-[#1D4ED8] text-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        {/* Logo / App Name */}
        <h1 className="text-xl font-bold text-white">MyApp</h1>

        {/* Navigation */}
        <nav className="flex space-x-6">
          <Link
            to="/"
            className="text-white font-medium hover:text-[#FBBF24] transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            to="/login"
            className="text-white font-medium hover:text-[#FBBF24] transition-colors duration-200"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-white font-medium hover:text-[#FBBF24] transition-colors duration-200"
          >
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
}
