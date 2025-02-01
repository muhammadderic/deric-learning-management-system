import { useState } from "react";

import type { RegisterResponse } from "../../domain/interfaces/registerResponse";

interface RegistrationFormProps {
  onRegister: (email: string, password: string) => Promise<RegisterResponse>;
}

export function RegistrationForm({ onRegister }: RegistrationFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await onRegister(email, password);
      setEmail("");
      setPassword("");
      alert("Registration successful!"); // simple feedback
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-[#111827]">Register Form</h2>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-[#111827]">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/20 transition-colors duration-200"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-[#111827]">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
            className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/20 transition-colors duration-200"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer w-full py-2 bg-[#1D4ED8] hover:bg-[#2563EB] text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Registering...</span>
            </div>
          ) : (
            "Register"
          )}
        </button>
      </form>
    </div>
  );
}
