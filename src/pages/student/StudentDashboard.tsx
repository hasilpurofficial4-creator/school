import { Link } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import type { StudentDashboard as StudentDashboardType, Exam } from "../../types";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function StudentDashboard() {
  const { data, loading, error } = useApi<StudentDashboardType>("/api/dashboard");

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!data) return null;

  const cards = [
    { label: "Available Exams", value: data.stats.availableExams, color: "bg-blue-500" },
    { label: "Completed", value: data.stats.completedExams, color: "bg-emerald-500" },
    { label: "Average Score", value: `${data.stats.averageScore}%`, color: "bg-purple-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Student Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center mb-3`}>
              <span className="text-white font-bold text-sm">{card.value}</span>
            </div>
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Available Exams */}
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Available Exams</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {data.availableExams.length > 0 ? (
          data.availableExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))
        ) : (
          <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
            No exams available right now
          </div>
        )}
      </div>

      {/* Recent Results */}
      {data.results.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Results</h2>
          <div className="space-y-3">
            {data.results.slice(0, 5).map((result) => (
              <Link
                key={result.id}
                to={`/student/results/${result.id}`}
                className="block bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-slate-900">{result.examTitle}</h3>
                    <p className="text-sm text-slate-500">
                      {result.score}/{result.totalMarks} - {result.percentage}%
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    result.percentage >= 50 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                  }`}>
                    {result.grade}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ExamCard({ exam }: { exam: Exam }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900">{exam.title}</h3>
      <div className="flex items-center space-x-3 mt-2 text-sm text-slate-500">
        <span>{exam.subject}</span>
        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">{exam.class}</span>
      </div>
      <div className="flex items-center space-x-4 mt-3 text-sm text-slate-600">
        <span>{exam.duration} minutes</span>
        <span>{exam.questions.length} questions</span>
      </div>
      <Link
        to={`/student/exam/${exam.id}`}
        className="mt-4 inline-block w-full text-center py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
      >
        Start Exam
      </Link>
    </div>
  );
}
