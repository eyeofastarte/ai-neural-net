export interface MNISTModel {
  id: string;
  name: string;
  description: string;
  url: string;
  accuracy?: string;
  size?: string;
}

/**
 * Available MNIST models for digit recognition.
 * Add more models by adding entries to this array.
 * Model URLs should point to TensorFlow.js model.json files.
 */
export const MNIST_MODELS: MNISTModel[] = [
  {
    id: 'mnist_transfer_cnn_v1',
    name: 'MNIST Transfer CNN v1',
    description: 'Default transfer learning CNN model (recommended)',
    url: 'https://storage.googleapis.com/tfjs-models/tfjs/mnist_transfer_cnn_v1/model.json',
    accuracy: '~98%',
    size: '~1.2 MB',
  }
];

export function getModelById(id: string): MNISTModel | undefined {
  return MNIST_MODELS.find((model) => model.id === id);
}