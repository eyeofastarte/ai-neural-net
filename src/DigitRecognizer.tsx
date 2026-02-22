import { useState } from 'react';
import DrawingCanvas from './components/DrawingCanvas';
import PredictionDisplay from './components/PredictionDisplay';
import { useDigitModel } from './hooks/useDigitModel';

export default function DigitRecognizer() {
  const { loading, error, predict } = useDigitModel();
  const [predictions, setPredictions] = useState<number[]>([]);

  const handlePredict = (canvas: HTMLCanvasElement) => {
    const results = predict(canvas);
    setPredictions(results);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-black mb-2 bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
        Digit Recognizer
      </h1>
      <p className="text-gray-400 mb-8 text-lg">
        Draw a digit (0-9) and let the AI guess!
      </p>

      {loading && (
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="text-indigo-400 font-semibold">Loading AI model...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 max-w-md">
          <p className="text-red-400 font-semibold">Model Error:</p>
          <p className="text-red-300 text-sm mt-1">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <DrawingCanvas onPredict={handlePredict} />
          <PredictionDisplay predictions={predictions} />
        </div>
      )}
    </div>
  );
}
