import { authService } from "../../infrastructure/authService";
import { LoginForm } from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <LoginForm onLogin={authService.login} />
    </div>
  );
}
