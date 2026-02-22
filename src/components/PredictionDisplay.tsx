interface Props {
  predictions: number[];
}

export default function PredictionDisplay({ predictions }: Props) {
  if (predictions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-sm h-64 text-gray-500">
        <p className="text-lg">Draw a digit and click Predict!</p>
      </div>
    );
  }

  const best = predictions.indexOf(Math.max(...predictions));
  const bestConfidence = predictions[best];

  return (
    <div className="flex flex-col gap-3 w-full max-w-sm">
      <div className="text-center p-6 bg-linear-to-br from-indigo-900/50 to-purple-900/50 rounded-xl border border-indigo-500/30">
        <span className="text-8xl font-black text-indigo-400 drop-shadow-lg">
          {best}
        </span>
        <p className="text-gray-300 mt-2 text-lg font-semibold">
          {(bestConfidence * 100).toFixed(1)}% confidence
        </p>
      </div>

      <div className="flex flex-col gap-2 mt-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2">
          All Predictions
        </h3>
        {predictions.map((prob, digit) => (
          <div key={digit} className="flex items-center gap-3">
            <span
              className={`w-6 text-right text-sm font-bold ${
                digit === best ? 'text-indigo-400' : 'text-gray-500'
              }`}
            >
              {digit}
            </span>
            <div className="flex-1 bg-gray-700 rounded-full h-5 overflow-hidden shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  digit === best ? 'bg-linear-to-r from-indigo-500 to-purple-500' : 'bg-gray-500'
                }`}
                style={{ width: `${(prob * 100).toFixed(1)}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 w-12 text-right font-mono">
              {(prob * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
