import { useRef, useEffect } from 'react';

interface Props {
  onPredict: (canvas: HTMLCanvasElement) => void;
}

export default function DrawingCanvas({ onPredict }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  const getPos = (e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return { x: (e as MouseEvent).offsetX, y: (e as MouseEvent).offsetY };
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const gridSize = 28; // 28x28 grid (what the AI sees)
    const cellSize = canvas.width / gridSize; // 280 / 28 = 10 pixels per cell
    
    ctx.strokeStyle = '#e0e0e0'; // Light gray grid lines
    ctx.lineWidth = 0.5;
    
    // Draw vertical lines
    for (let i = 0; i <= gridSize; i++) {
      const x = i * cellSize;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let i = 0; i <= gridSize; i++) {
      const y = i * cellSize;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize canvas with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid pattern
    drawGrid(ctx, canvas);
    
    // Set drawing styles
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const start = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      drawing.current = true;
      const { x, y } = getPos(e, canvas);
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      if (!drawing.current) return;
      const { x, y } = getPos(e, canvas);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const stop = () => {
      drawing.current = false;
      ctx.beginPath();
    };

    // Mouse events
    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stop);
    canvas.addEventListener('mouseleave', stop);

    // Touch events
    canvas.addEventListener('touchstart', start);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stop);
    canvas.addEventListener('touchcancel', stop);

    return () => {
      canvas.removeEventListener('mousedown', start);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stop);
      canvas.removeEventListener('mouseleave', stop);
      canvas.removeEventListener('touchstart', start);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stop);
      canvas.removeEventListener('touchcancel', stop);
    };
  }, []);

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Redraw grid after clearing
    drawGrid(ctx, canvas);
    // Restore drawing styles
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        width={280}
        height={280}
        className="border-4 border-indigo-500 rounded-xl cursor-crosshair bg-white shadow-2xl touch-none"
      />
      <div className="flex gap-3">
        <button
          onClick={clear}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-semibold transition-colors shadow-lg"
        >
          Clear
        </button>
        <button
          onClick={() => {
            if (canvasRef.current) {
              onPredict(canvasRef.current);
            }
          }}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-colors shadow-lg"
        >
          Predict
        </button>
      </div>
    </div>
  );
}
