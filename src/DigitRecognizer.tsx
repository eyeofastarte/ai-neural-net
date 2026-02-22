import { useState } from 'react';
import DrawingCanvas from './components/DrawingCanvas';
import PredictionDisplay from './components/PredictionDisplay';
import { useDigitModel } from './hooks/useDigitModel';
import { MNIST_MODELS, getModelById } from './models/mnistModels';

export default function DigitRecognizer() {
  const [selectedModelId, setSelectedModelId] = useState<string>(MNIST_MODELS[0].id);
  const { loading, error, predict } = useDigitModel(selectedModelId);
  const [predictions, setPredictions] = useState<number[]>([]);

  const handlePredict = (canvas: HTMLCanvasElement) => {
    const results = predict(canvas);
    setPredictions(results);
  };

  // const selectedModel = getModelById(selectedModelId);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-black mb-2 bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
        Digit Recognizer
      </h1>
      <p className="text-gray-400 mb-8 text-lg">
        Draw a digit (0-4) and let the AI guess!
      </p>

      {/* Model Selector */}
      {/* <div className="mb-6 flex flex-col items-center gap-2">
        <label htmlFor="model-select" className="text-gray-300 text-sm font-semibold">
          Select Model:
        </label>
        <select
          id="model-select"
          value={selectedModelId}
          onChange={(e) => {
            setSelectedModelId(e.target.value);
            setPredictions([]); // Clear predictions when switching models
          }}
          disabled={loading}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed min-w-[280px]"
        >
          {MNIST_MODELS.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name} {model.accuracy && `(${model.accuracy})`}
            </option>
          ))}
        </select>
        {selectedModel && (
          <p className="text-gray-500 text-xs mt-1 max-w-md text-center">
            {selectedModel.description}
            {selectedModel.size && ` • Size: ${selectedModel.size}`}
          </p>
        )}
      </div> */}

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
