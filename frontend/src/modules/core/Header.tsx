import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="p-4 bg-gray-800 text-white flex justify-between">
      <h1 className="font-bold">MyApp</h1>
      <nav>
        <Link to="/" className="mr-4 hover:underline">
          Home
        </Link>
        <Link to="/register" className="hover:underline">
          Register
        </Link>
      </nav>
    </header>
  );
}
