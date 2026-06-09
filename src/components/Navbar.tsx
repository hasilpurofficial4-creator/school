import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const roleLinks: Record<string, { label: string; path: string }[]> = {
    admin: [
      { label: "Dashboard", path: "/admin" },
      { label: "Students", path: "/admin/students" },
      { label: "Teachers", path: "/admin/teachers" },
      { label: "Exams", path: "/admin/exams" },
      { label: "Bans", path: "/admin/bans" },
    ],
    teacher: [
      { label: "Dashboard", path: "/teacher" },
      { label: "Create Exam", path: "/teacher/create-exam" },
      { label: "My Exams", path: "/teacher/exams" },
    ],
    student: [
      { label: "Dashboard", path: "/student" },
      { label: "Results", path: "/student/results" },
    ],
  };

  const links = user ? roleLinks[user.role] || [] : [];

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SH</span>
              </div>
              <span className="font-bold text-lg text-slate-900">
                Study Hub Lahore
              </span>
            </Link>

            {user && (
              <div className="hidden md:flex space-x-1">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === link.path
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-slate-500">{user.name}</span>
                <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs capitalize">
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      {user && (
        <div className="md:hidden border-t border-slate-200 px-4 py-2 space-x-2 overflow-x-auto flex">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`inline-block px-3 py-1.5 rounded-md text-sm whitespace-nowrap ${
                location.pathname === link.path
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
