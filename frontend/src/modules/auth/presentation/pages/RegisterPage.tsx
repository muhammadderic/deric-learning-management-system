import { authService } from "../../infrastructure/authService";
import { RegistrationForm } from "../components/RegistrationForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <RegistrationForm onRegister={authService.register} />
    </div>
  );
}
