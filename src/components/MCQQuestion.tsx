interface MCQQuestionProps {
  questionNumber: number;
  text: string;
  options: string[];
  selectedAnswer: number;
  onSelect: (index: number) => void;
}

export default function MCQQuestion({
  questionNumber,
  text,
  options,
  selectedAnswer,
  onSelect,
}: MCQQuestionProps) {
  const labels = ["A", "B", "C", "D"];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-start space-x-3 mb-4">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm flex-shrink-0">
          {questionNumber}
        </span>
        <p className="text-slate-800 font-medium pt-1">{text}</p>
      </div>

      <div className="space-y-2 ml-11">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
              selectedAnswer === index
                ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border mr-3 text-xs font-bold">
              {labels[index]}
            </span>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
