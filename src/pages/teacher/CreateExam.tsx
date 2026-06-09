import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";
import type { StudentClass } from "../../types";

interface QuestionForm {
  text: string;
  options: [string, string, string, string];
  correctAnswer: number;
}

export default function CreateExam() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [examClass, setExamClass] = useState<StudentClass>("9th");
  const [duration, setDuration] = useState(30);
  const [questions, setQuestions] = useState<QuestionForm[]>([
    { text: "", options: ["", "", "", ""], correctAnswer: 0 },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const classes: StudentClass[] = ["9th", "10th", "11th", "12th"];

  const addQuestion = () => {
    setQuestions([...questions, { text: "", options: ["", "", "", ""], correctAnswer: 0 }]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    if (field === "text") {
      updated[index].text = value;
    } else if (field === "correctAnswer") {
      updated[index].correctAnswer = value;
    }
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Validate
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].text.trim()) {
        setFormError(`Question ${i + 1} text is required`);
        return;
      }
      for (let j = 0; j < 4; j++) {
        if (!questions[i].options[j].trim()) {
          setFormError(`Question ${i + 1}, Option ${String.fromCharCode(65 + j)} is required`);
          return;
        }
      }
    }

    setSubmitting(true);

    const result = await apiFetch("/api/exams", {
      method: "POST",
      body: JSON.stringify({
        title,
        subject,
        class: examClass,
        duration,
        questions,
      }),
    });

    if (result.success) {
      navigate("/teacher/exams");
    } else {
      setFormError(result.error || "Failed to create exam");
    }
    setSubmitting(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Create Exam</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Exam Details */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Exam Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="e.g., Physics Mid-Term" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
              <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="e.g., Physics" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Class</label>
              <select value={examClass} onChange={(e) => setExamClass(e.target.value as StudentClass)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                {classes.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Duration (minutes)</label>
              <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} min={1} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Questions */}
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Question {qIndex + 1}</h3>
              {questions.length > 1 && (
                <button type="button" onClick={() => removeQuestion(qIndex)} className="text-red-600 hover:text-red-800 text-sm">
                  Remove
                </button>
              )}
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={q.text}
                onChange={(e) => updateQuestion(qIndex, "text", e.target.value)}
                required
                placeholder="Enter question text"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`correct-${qIndex}`}
                      checked={q.correctAnswer === oIndex}
                      onChange={() => updateQuestion(qIndex, "correctAnswer", oIndex)}
                      className="w-4 h-4 text-emerald-600"
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                      required
                      placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500">Select the radio button next to the correct answer</p>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
        >
          + Add Question
        </button>

        {formError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{formError}</div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium rounded-lg transition-colors"
        >
          {submitting ? "Submitting..." : `Submit Exam (${questions.length} questions)`}
        </button>
      </form>
    </div>
  );
}
