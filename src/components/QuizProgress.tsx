interface QuizProgressProps {
  current: number;
  total: number;
}

const QuizProgress = ({ current, total }: QuizProgressProps) => {
  const pct = Math.round((current / total) * 100);
  const remainingSecs = Math.round(((total - current) / total) * 120);
  const timeLabel =
    remainingSecs >= 60
      ? `~${Math.ceil(remainingSecs / 60)} min restantes`
      : remainingSecs > 0
        ? "menos de 1 min"
        : "quase pronto!";

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-white/70 sm:text-sm">
          Etapa <span className="text-white/90">{current}</span> de{" "}
          <span className="text-white/90">{total}</span>
        </p>
        <p className="text-xs text-white/45">{timeLabel}</p>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 via-violet-400 to-fuchsia-400 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default QuizProgress;