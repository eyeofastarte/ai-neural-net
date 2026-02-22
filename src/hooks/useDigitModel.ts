import { useEffect, useState, useCallback, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { getModelById } from '../models/mnistModels';

export function useDigitModel(modelId: string) {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const modelRef = useRef<tf.LayersModel | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    setModel(null);

    const modelConfig = getModelById(modelId);
    if (!modelConfig) {
      setError(`Model ${modelId} not found`);
      setLoading(false);
      return;
    }

    tf.loadLayersModel(modelConfig.url)
      .then((loadedModel) => {
        if (mounted) {
          modelRef.current = loadedModel;
          setModel(loadedModel);
          setLoading(false);
        } else {
          loadedModel.dispose();
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message || 'Failed to load model');
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
      if (modelRef.current) {
        modelRef.current.dispose();
        modelRef.current = null;
      }
    };
  }, [modelId]);

  const predict = useCallback(
    (canvas: HTMLCanvasElement): number[] => {
      if (!model) return [];

      return tf.tidy(() => {
        // Canvas: white background (255) + black strokes (0)
        // MNIST expects: black background (0) + white digits (1)
        // So we need to invert: 1 - normalized_value
        
        const normalized = tf.browser
          .fromPixels(canvas, 1) // grayscale [H, W, 1], values 0-255
          .resizeBilinear([28, 28]) // [28, 28, 1]
          .toFloat()
          .div(255.0); // normalize to [0,1] where 0=black stroke, 1=white bg
        
        // Invert: 1 - value (so black strokes become white digits on black bg)
        const inverted = tf.scalar(1).sub(normalized);
        const batched = inverted.expandDims(0); // [1, 28, 28, 1]

        const output = model.predict(batched) as tf.Tensor;
        const predictions = Array.from(output.dataSync()); // [p0, p1, ..., p9]
        
        return predictions;
      });
    },
    [model]
  );

  return { model, loading, error, predict };
}
