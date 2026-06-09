import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import { useApi } from "../../hooks/useApi";
import type { Result } from "../../types";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function ResultCard() {
  const { resultId } = useParams<{ resultId: string }>();
  const { data: result, loading, error } = useApi<Result>(`/api/results?resultId=${resultId}`);
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!result) return <div className="text-center py-8 text-slate-500">Result not found</div>;

  const passed = result.percentage >= 40;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.download = `result-${result.id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download result card");
    }

    setDownloading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Result Card</h1>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg transition-colors"
        >
          {downloading ? "Downloading..." : "Download HD"}
        </button>
      </div>

      {/* Result Card */}
      <div ref={cardRef} className="bg-white rounded-2xl shadow-lg border-2 border-emerald-200 overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-600 p-6 text-center">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-emerald-600 font-bold text-lg">SH</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Study Hub Lahore</h2>
          <p className="text-emerald-100 text-sm mt-1">Official Result Card</p>
        </div>

        {/* Student Info */}
        <div className="p-6 border-b border-slate-100">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 uppercase">Student Name</p>
              <p className="text-sm font-semibold text-slate-900">{result.studentName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Class</p>
              <p className="text-sm font-semibold text-slate-900">{result.studentClass}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Exam Title</p>
              <p className="text-sm font-semibold text-slate-900">{result.examTitle}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Date</p>
              <p className="text-sm font-semibold text-slate-900">
                {new Date(result.submittedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Score */}
        <div className="p-6 border-b border-slate-100">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-slate-900">{result.score}/{result.totalMarks}</p>
              <p className="text-xs text-slate-500 mt-1">Score</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className={`text-2xl font-bold ${result.percentage >= 50 ? "text-emerald-600" : "text-red-600"}`}>
                {result.percentage}%
              </p>
              <p className="text-xs text-slate-500 mt-1">Percentage</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-slate-900">{result.grade}</p>
              <p className="text-xs text-slate-500 mt-1">Grade</p>
            </div>
          </div>
        </div>

        {/* Pass/Fail */}
        <div className="p-6 text-center">
          <div
            className={`inline-block px-8 py-3 rounded-full text-lg font-bold ${
              passed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
            }`}
          >
            {passed ? "PASSED" : "FAILED"}
          </div>
          <div className="mt-4 text-xs text-slate-400">
            <p>Time Taken: {Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s</p>
            <p className="mt-1">Result ID: {result.id}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 text-center">
          <p className="text-xs text-slate-400">
            This is a computer-generated result card from Study Hub Lahore
          </p>
        </div>
      </div>
    </div>
  );
}
