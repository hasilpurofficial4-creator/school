import { useApi } from "../../hooks/useApi";
import type { Exam } from "../../types";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function TeacherExams() {
  const { data: exams, loading, error } = useApi<Exam[]>("/api/exams");

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Exams</h1>

      <div className="space-y-4">
        {exams && exams.length > 0 ? (
          exams.map((exam) => (
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
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[exam.status]}`}>
                  {exam.status}
                </span>
              </div>
              {exam.approvedAt && (
                <p className="text-xs text-slate-400 mt-2">
                  Approved on {new Date(exam.approvedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
            No exams created yet
          </div>
        )}
      </div>
    </div>
  );
}
