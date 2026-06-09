import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { apiFetch } from "../../utils/api";
import type { Exam, ExamStatus } from "../../types";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function ManageExams() {
  const { data: exams, loading, error, refetch } = useApi<Exam[]>("/api/exams");
  const [filter, setFilter] = useState<ExamStatus | "all">("all");

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    const result = await apiFetch("/api/exams", {
      method: "PUT",
      body: JSON.stringify({ id, status }),
    });
    if (result.success) refetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this exam?")) return;
    const result = await apiFetch("/api/exams", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    if (result.success) refetch();
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  const filtered = filter === "all" ? exams : exams?.filter((e) => e.status === filter);

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Manage Exams</h1>

      {/* Filter */}
      <div className="flex space-x-2 mb-6">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f ? "bg-emerald-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered && filtered.length > 0 ? (
          filtered.map((exam) => (
            <div key={exam.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{exam.title}</h3>
                  <div className="flex items-center space-x-3 mt-2 text-sm text-slate-500">
                    <span>{exam.subject}</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">{exam.class}</span>
                    <span>{exam.duration} min</span>
                    <span>{exam.questions.length} questions</span>
                  </div>
                  <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${statusColors[exam.status]}`}>
                    {exam.status}
                  </span>
                </div>
                <div className="flex space-x-2">
                  {exam.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleAction(exam.id, "approved")}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(exam.id, "rejected")}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(exam.id)}
                    className="px-3 py-1.5 text-red-600 hover:bg-red-50 text-sm rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Questions preview */}
              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="text-sm font-medium text-slate-700 mb-2">Questions ({exam.questions.length})</p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {exam.questions.map((q, i) => (
                    <div key={q.id} className="text-sm text-slate-600 bg-slate-50 rounded p-2">
                      <span className="font-medium">{i + 1}.</span> {q.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
            No exams found
          </div>
        )}
      </div>
    </div>
  );
}
