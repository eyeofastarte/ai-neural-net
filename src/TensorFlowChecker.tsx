import { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs'; // includes webgl + cpu
import '@tensorflow/tfjs-backend-wasm'; // includes wasm (WebAssembly)

interface BackendStatus {
  name: string;
  available: boolean;
  active: boolean;
  error?: string;
}

export default function TensorFlowChecker() {
  const [backends, setBackends] = useState<BackendStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [tfVersion, setTfVersion] = useState('');

  useEffect(() => {
    const checkBackends = async () => {
      setLoading(true);
      setTfVersion(tf.version.tfjs);

      const backendNames = ['webgl', 'webgpu', 'cpu', 'wasm'];
      const results: BackendStatus[] = [];

      for (const backendName of backendNames) {
        try {
          // Try to set the backend
          const success = await tf.setBackend(backendName);
          
          if (success) {
            await tf.ready();
            const isActive = tf.getBackend() === backendName;
            
            results.push({
              name: backendName.toUpperCase(),
              available: true,
              active: isActive,
            });
          } else {
            results.push({
              name: backendName.toUpperCase(),
              available: false,
              active: false,
              error: 'Backend not supported',
            });
          }
        } catch (error) {
          results.push({
            name: backendName.toUpperCase(),
            available: false,
            active: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      // Set back to the best available backend
      await tf.setBackend('webgl').catch(() => tf.setBackend('cpu'));
      await tf.ready();

      setBackends(results);
      setLoading(false);
    };

    checkBackends();
  }, []);

  const getStatusIcon = (available: boolean) => {
    return available ? 'OK' : 'FAIL';
  };


  return (
    <div className="w-full">
      <h1 className="text-4xl mb-4 bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">TensorFlow.js System Check</h1>
      <p className="text-slate-400 mb-8 text-base">TensorFlow.js Version: {tfVersion}</p>

      {loading ? (
        <div className="p-8 text-xl text-slate-400">
          <p>Checking available backends...</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 my-8">
          {backends.map((backend) => (
            <div
              key={backend.name}
              className={`rounded-xl p-6 shadow-lg transition-all duration-200 border-2 hover:-translate-y-1 hover:shadow-xl bg-slate-900/50 ${
                backend.available
                  ? 'bg-linear-to-br from-blue-500/20 to-cyan-500/20 border-emerald-400'
                  : 'bg-linear-to-br from-red-500/10 to-red-400/10 border-red-500'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="m-0 text-2xl font-bold text-slate-100">{backend.name}</h2>
                <span className={`text-3xl font-bold ${
                  backend.available ? 'text-emerald-400' : 'text-red-500'
                }`}>
                  {getStatusIcon(backend.available)}
                </span>
              </div>
              <div className="text-left">
                {backend.available ? (
                  <>
                    <p className="text-lg font-semibold my-2 text-slate-200">Successfully Connected</p>
                    {backend.active && (
                      <p className="inline-block bg-emerald-500 text-slate-900 px-3 py-1 rounded-full text-sm font-semibold mt-2">Currently Active</p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-lg font-semibold my-2 text-slate-200">Failed to Connect</p>
                    {backend.error && (
                      <p className="text-sm text-red-400 mt-2 italic">{backend.error}</p>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 p-8 bg-blue-500/10 rounded-xl text-left border border-blue-500/20">
        <h3 className="mt-0 text-blue-400 mb-4">Backend Information</h3>
        <ul className="list-none p-0">
          <li className="py-2 border-b border-blue-500/20 last:border-b-0 text-slate-300"><strong className="text-blue-400 mr-2">WebGL:</strong> GPU-accelerated backend for browsers (recommended)</li>
          <li className="py-2 border-b border-blue-500/20 last:border-b-0 text-slate-300"><strong className="text-blue-400 mr-2">WebGPU:</strong> Next-gen GPU backend (experimental, limited browser support)</li>
          <li className="py-2 border-b border-blue-500/20 last:border-b-0 text-slate-300"><strong className="text-blue-400 mr-2">CPU:</strong> JavaScript-based CPU backend (fallback)</li>
          <li className="py-2 border-b border-blue-500/20 last:border-b-0 text-slate-300"><strong className="text-blue-400 mr-2">WASM:</strong> WebAssembly CPU backend (faster than plain CPU)</li>
        </ul>
      </div>
    </div>
  );
}