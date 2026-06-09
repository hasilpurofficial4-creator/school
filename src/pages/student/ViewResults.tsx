import { Link } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import type { Result } from "../../types";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function ViewResults() {
  const { data: results, loading, error } = useApi<Result[]>("/api/results");

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Results</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Exam</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Percentage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {results && results.length > 0 ? (
                results.map((result) => (
                  <tr key={result.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-900 font-medium">{result.examTitle}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{result.score}/{result.totalMarks}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`font-medium ${result.percentage >= 50 ? "text-emerald-600" : "text-red-600"}`}>
                        {result.percentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        result.percentage >= 50 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                      }`}>
                        {result.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(result.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link
                        to={`/student/results/${result.id}`}
                        className="text-emerald-600 hover:text-emerald-800 font-medium"
                      >
                        View Card
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No results yet. Take an exam to see your results here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
