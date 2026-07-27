import React, { useRef, useState, useEffect } from 'react';
import { Camera, Flashlight, X, RefreshCw, Check, Image as ImageIcon } from 'lucide-react';

interface CameraScannerProps {
  onCapture: (imageDataUrl: string) => void;
  onClose: () => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function initCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        });
        activeStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err: any) {
        console.warn('Camera access unavailable or denied:', err);
        setCameraError('Camera access unavailable. You can upload or pick a sample photo.');
      }
    }

    initCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleSnap = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(dataUrl);
      }
    } else {
      // Fallback sample image snapshot if stream is inactive
      const sampleCanvas = document.createElement('canvas');
      sampleCanvas.width = 800;
      sampleCanvas.height = 1000;
      const ctx = sampleCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(0, 0, 800, 1000);
        ctx.fillStyle = '#1E293B';
        ctx.fillRect(40, 40, 720, 920);
        ctx.fillStyle = '#38BDF8';
        ctx.font = 'bold 36px sans-serif';
        ctx.fillText('METRO UTILITIES BILL', 80, 120);
        ctx.fillStyle = '#94A3B8';
        ctx.font = '20px sans-serif';
        ctx.fillText('Statement Date: 2026-07-24', 80, 170);
        ctx.fillText('Account #: 4829-1029', 80, 200);
        ctx.fillStyle = '#F8FAFC';
        ctx.fillText('Standard Energy Usage: $93.00', 80, 300);
        ctx.fillText('Peak Demand Surcharge: $22.50', 80, 350);
        ctx.fillText('Grid Maintenance Fee: $18.00', 80, 400);
        ctx.fillStyle = '#38BDF8';
        ctx.font = 'bold 42px sans-serif';
        ctx.fillText('TOTAL DUE: $148.50', 80, 520);
      }
      setCapturedImage(sampleCanvas.toDataURL('image/jpeg', 0.9));
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between text-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 z-20 bg-gradient-to-b from-black/80 to-transparent">
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-slate-900/60 backdrop-blur-md text-white hover:bg-slate-800"
        >
          <X className="w-6 h-6" />
        </button>
        <span className="text-sm font-bold tracking-wider uppercase">
          Bill Scanner
        </span>
        <button
          onClick={() => setFlashEnabled(!flashEnabled)}
          className={`p-2 rounded-full backdrop-blur-md ${
            flashEnabled ? 'bg-amber-500 text-slate-950' : 'bg-slate-900/60 text-white'
          }`}
        >
          <Flashlight className="w-6 h-6" />
        </button>
      </div>

      {/* Viewfinder / Capture Canvas */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-slate-950">
        {capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured Bill"
            className="w-full h-full object-contain"
          />
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Document Alignment Frame Overlay */}
            <div className="absolute inset-8 border-2 border-dashed border-indigo-400/80 rounded-2xl pointer-events-none flex flex-col justify-between p-4 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
              <div className="flex justify-between">
                <div className="w-6 h-6 border-t-4 border-l-4 border-indigo-400 rounded-tl-lg" />
                <div className="w-6 h-6 border-t-4 border-r-4 border-indigo-400 rounded-tr-lg" />
              </div>

              <div className="text-center bg-black/60 backdrop-blur-md py-1.5 px-3 rounded-full mx-auto text-xs font-semibold text-indigo-200">
                Align bill within frame
              </div>

              <div className="flex justify-between">
                <div className="w-6 h-6 border-b-4 border-l-4 border-indigo-400 rounded-bl-lg" />
                <div className="w-6 h-6 border-b-4 border-r-4 border-indigo-400 rounded-br-lg" />
              </div>
            </div>
          </>
        )}

        {/* Flash Simulation Overlay */}
        {flashEnabled && !capturedImage && (
          <div className="absolute inset-0 bg-white/20 pointer-events-none" />
        )}
      </div>

      {/* Bottom Controls */}
      <div className="p-6 bg-gradient-to-t from-black via-black/90 to-transparent flex items-center justify-around z-20">
        {capturedImage ? (
          <>
            <button
              onClick={() => setCapturedImage(null)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 text-slate-200 font-bold text-sm hover:bg-slate-700 active:scale-95 transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Retake
            </button>
            <button
              onClick={handleConfirm}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 active:scale-95 shadow-lg shadow-indigo-600/40 transition-all"
            >
              <Check className="w-5 h-5 stroke-[3]" /> Use Photo
            </button>
          </>
        ) : (
          <div className="w-full flex items-center justify-around">
            <button
              onClick={onClose}
              className="p-3 rounded-full bg-slate-800 text-slate-300 hover:text-white"
            >
              <ImageIcon className="w-6 h-6" />
            </button>

            {/* Shutter Button */}
            <button
              onClick={handleSnap}
              className="w-18 h-18 rounded-full border-4 border-white flex items-center justify-center p-1 hover:scale-105 active:scale-95 transition-transform"
            >
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center shadow-lg">
                <Camera className="w-8 h-8 text-slate-900" />
              </div>
            </button>

            <div className="w-12 h-12" /> {/* Spacer */}
          </div>
        )}
      </div>
    </div>
  );
};
