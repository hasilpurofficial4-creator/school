import { Link } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import type { TeacherDashboard as TeacherDashboardType } from "../../types";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function TeacherDashboard() {
  const { data, loading, error } = useApi<TeacherDashboardType>("/api/dashboard");

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!data) return null;

  const cards = [
    { label: "Total Exams", value: data.stats.totalExams, color: "bg-blue-500" },
    { label: "Pending Approval", value: data.stats.pendingExams, color: "bg-amber-500" },
    { label: "Approved", value: data.stats.approvedExams, color: "bg-emerald-500" },
    { label: "Results Submitted", value: data.stats.totalResults, color: "bg-purple-500" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Teacher Dashboard</h1>
        <Link
          to="/teacher/create-exam"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
        >
          + Create Exam
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center mb-3`}>
              <span className="text-white font-bold">{card.value}</span>
            </div>
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Exams */}
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Exams</h2>
      <div className="space-y-3">
        {data.exams.length > 0 ? (
          data.exams.slice(0, 5).map((exam) => (
            <div key={exam.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex justify-between items-center">
              <div>
                <h3 className="font-medium text-slate-900">{exam.title}</h3>
                <p className="text-sm text-slate-500">{exam.subject} - {exam.class} - {exam.duration} min</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                exam.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                exam.status === "pending" ? "bg-amber-100 text-amber-700" :
                "bg-red-100 text-red-700"
              }`}>
                {exam.status}
              </span>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
            No exams created yet. <Link to="/teacher/create-exam" className="text-emerald-600 hover:underline">Create your first exam</Link>
          </div>
        )}
      </div>
    </div>
  );
}
