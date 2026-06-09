import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { apiFetch } from "../../utils/api";
import type { Exam } from "../../types";
import Timer from "../../components/Timer";
import MCQQuestion from "../../components/MCQQuestion";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function TakeExam() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { data: exam, loading, error } = useApi<Exam>(`/api/exams?examId=${examId}`);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [startTime] = useState(Date.now());
  const [currentQ, setCurrentQ] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const initAnswers = useCallback((questionCount: number) => {
    if (answers.length === 0 && questionCount > 0) {
      setAnswers(new Array(questionCount).fill(-1));
    }
  }, [answers.length]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!exam) return null;

  // Initialize answers array
  if (answers.length === 0) {
    initAnswers(exam.questions.length);
    return <LoadingSpinner />;
  }

  const durationSeconds = exam.duration * 60;

  const handleSelect = (qIndex: number, optIndex: number) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[qIndex] = optIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (submitted) return;
    if (!confirm("Are you sure you want to submit? You cannot change your answers after submission.")) return;

    setSubmitting(true);
    setSubmitted(true);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    const result = await apiFetch("/api/results", {
      method: "POST",
      body: JSON.stringify({ examId, answers, timeTaken }),
    });

    setSubmitting(false);

    if (result.success && result.data) {
      navigate(`/student/results/${(result.data as any).id}`);
    } else {
      alert(result.error || "Failed to submit exam");
      setSubmitted(false);
    }
  };

  const handleExpire = () => {
    if (submitted) return;
    alert("Time is up! Your exam will be submitted automatically.");
    handleSubmit();
  };

  const answeredCount = answers.filter((a) => a >= 0).length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{exam.title}</h1>
          <p className="text-sm text-slate-500">{exam.subject} - {exam.class}</p>
        </div>
        <Timer durationSeconds={durationSeconds} onExpire={handleExpire} />
      </div>

      {/* Question Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <p className="text-sm font-medium text-slate-700 mb-2">
          Questions ({answeredCount}/{exam.questions.length} answered)
        </p>
        <div className="flex flex-wrap gap-2">
          {exam.questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQ(i)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                currentQ === i
                  ? "bg-emerald-600 text-white"
                  : answers[i] >= 0
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Current Question */}
      <div className="mb-6">
        <MCQQuestion
          questionNumber={currentQ + 1}
          text={exam.questions[currentQ].text}
          options={exam.questions[currentQ].options}
          selectedAnswer={answers[currentQ]}
          onSelect={(opt) => handleSelect(currentQ, opt)}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
          disabled={currentQ === 0}
          className="px-4 py-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors"
        >
          Previous
        </button>

        {currentQ < exam.questions.length - 1 ? (
          <button
            onClick={() => setCurrentQ(currentQ + 1)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting || submitted}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
          >
            {submitting ? "Submitting..." : "Submit Exam"}
          </button>
        )}
      </div>
    </div>
  );
}
