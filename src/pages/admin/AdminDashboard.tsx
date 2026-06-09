import { Link } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import type { AdminDashboard as AdminDashboardType } from "../../types";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AdminDashboard() {
  const { data, loading, error } = useApi<AdminDashboardType>("/api/dashboard");

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!data) return null;

  const cards = [
    { label: "Total Students", value: data.stats.totalStudents, color: "bg-blue-500", link: "/admin/students" },
    { label: "Total Teachers", value: data.stats.totalTeachers, color: "bg-purple-500", link: "/admin/teachers" },
    { label: "Pending Exams", value: data.stats.pendingExams, color: "bg-amber-500", link: "/admin/exams", highlight: data.stats.pendingExams > 0 },
    { label: "Total Results", value: data.stats.totalResults, color: "bg-emerald-500", link: "/admin/exams" },
    { label: "Active Bans", value: data.stats.activeBans, color: "bg-red-500", link: "/admin/bans" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className={`bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow ${
              card.highlight ? "ring-2 ring-amber-400" : ""
            }`}
          >
            <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center mb-3`}>
              <span className="text-white font-bold text-lg">{card.value}</span>
            </div>
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/students"
            className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all"
          >
            <p className="font-medium text-slate-900">Add Student</p>
            <p className="text-sm text-slate-500">Create new student account</p>
          </Link>
          <Link
            to="/admin/teachers"
            className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all"
          >
            <p className="font-medium text-slate-900">Add Teacher</p>
            <p className="text-sm text-slate-500">Create new teacher account</p>
          </Link>
          <Link
            to="/admin/exams"
            className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all"
          >
            <p className="font-medium text-slate-900">Manage Exams</p>
            <p className="text-sm text-slate-500">Approve or reject exams</p>
          </Link>
          <Link
            to="/admin/bans"
            className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all"
          >
            <p className="font-medium text-slate-900">Manage Bans</p>
            <p className="text-sm text-slate-500">Ban or unban users</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
