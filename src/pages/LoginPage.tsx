import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../types";

export default function LoginPage() {
  const [role, setRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const roles: { value: UserRole; label: string; icon: string; color: string }[] = [
    { value: "admin", label: "Admin", icon: "👑", color: "emerald" },
    { value: "teacher", label: "Teacher", icon: "📚", color: "blue" },
    { value: "student", label: "Student", icon: "🎓", color: "purple" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password, role);
    if (success) {
      navigate("/redirect");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">SH</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Study Hub Lahore</h1>
          <p className="text-slate-500 mt-2">Sign in to your account</p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {roles.map((r) => (
            <button
              key={r.value}
              onClick={() => setRole(r.value)}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                role === r.value
                  ? "border-emerald-500 bg-emerald-50 shadow-md"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="text-2xl mb-1">{r.icon}</div>
              <div
                className={`text-sm font-medium ${
                  role === r.value ? "text-emerald-700" : "text-slate-600"
                }`}
              >
                {r.label}
              </div>
            </button>
          ))}
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-4"
        >
          {role !== "admin" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium rounded-lg transition-colors"
          >
            {loading ? "Signing in..." : `Sign in as ${role}`}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Contact admin if you don't have an account
        </p>
      </div>
    </div>
  );
}
