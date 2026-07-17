'use client';

import React, { useRef, useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import Link from 'next/link';

export default function ScannerClient({ liveData }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [scannedNumbers, setScannedNumbers] = useState([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [matchResult, setMatchResult] = useState(null);

  // Flatten live data into an array of winning numbers
  const allWinningNumbers = React.useMemo(() => {
    const numbers = [];
    const extract = (operator) => {
      if (!operator) return;
      ['p1', 'p2', 'p3', ...Array.from({ length: 10 }, (_, i) => `s${i + 1}`), ...Array.from({ length: 10 }, (_, i) => `c${i + 1}`)].forEach(key => {
        if (operator[key] && operator[key] !== '----') {
          numbers.push({ number: operator[key], operator: operator.name || 'Provider', category: key });
        }
      });
    };
    extract({ ...liveData.magnum, name: 'Magnum' });
    extract({ ...liveData.toto, name: 'Toto' });
    extract({ ...liveData.damacai, name: 'Da Ma Cai' });
    return numbers;
  }, [liveData]);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Camera API is not supported in this browser. Please ensure you are using HTTPS or a secure context.");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("Unable to access camera. Please check permissions or ensure you are on HTTPS.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const scanFrame = async () => {
    if (!videoRef.current || !canvasRef.current || !cameraActive) return;
    
    setScanning(true);
    setMatchResult(null);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Draw current video frame to canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    try {
      const result = await Tesseract.recognize(canvas, 'eng', {
        logger: m => console.log(m),
      });
      
      const text = result.data.text;
      // Find all 4-digit numbers in the text
      const matches = text.match(/\b\d{4}\b/g) || [];
      const uniqueNumbers = [...new Set(matches)];
      
      setScannedNumbers(uniqueNumbers);
      
      // Check against live data
      const won = uniqueNumbers.find(num => allWinningNumbers.some(win => win.number === num));
      if (won) {
        const detail = allWinningNumbers.find(win => win.number === won);
        setMatchResult({ status: 'win', number: won, detail });
      } else if (uniqueNumbers.length > 0) {
        setMatchResult({ status: 'no_match' });
      } else {
        setMatchResult({ status: 'no_numbers_found' });
      }
      
    } catch (err) {
      console.error(err);
      setMatchResult({ status: 'no_numbers_found' });
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="text-red-500 font-bold hover:text-red-400">
          &larr; Back
        </Link>
        <h1 className="text-xl font-bold">Ticket Scanner OCR</h1>
        <div className="w-10"></div>
      </div>

      <div className="bg-neutral-900 rounded-2xl p-4 shadow-xl border border-neutral-800">
        {!cameraActive ? (
          <div className="h-64 flex flex-col items-center justify-center bg-neutral-950 rounded-xl border-2 border-dashed border-neutral-700">
            <p className="text-neutral-400 mb-4 text-center px-4">Point your camera at your physical 4D ticket to automatically check if you won.</p>
            <button 
              onClick={startCamera}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold shadow-lg"
            >
              Open Camera
            </button>
          </div>
        ) : (
          <div className="relative rounded-xl overflow-hidden bg-black">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full object-cover h-64 opacity-80"
            />
            {/* Target Reticle */}
            <div className="absolute inset-0 border-2 border-red-500/50 m-8 rounded-lg pointer-events-none shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"></div>
            
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {cameraActive && (
          <div className="mt-6 flex justify-center gap-4">
            <button 
              onClick={scanFrame}
              disabled={scanning}
              className={`${scanning ? 'bg-neutral-600 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'} text-white px-8 py-3 rounded-full font-bold shadow-lg flex items-center gap-2`}
            >
              {scanning ? 'Analyzing (Takes 5-10s)...' : 'Scan Now'}
            </button>
            <button 
              onClick={stopCamera}
              className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-3 rounded-full font-bold"
            >
              Stop
            </button>
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="mt-6">
        {scannedNumbers.length > 0 && (
          <div className="mb-4 text-sm text-neutral-400">
            Scanned Numbers: {scannedNumbers.join(', ')}
          </div>
        )}

        {matchResult?.status === 'win' && (
          <div className="bg-green-600 text-white p-6 rounded-2xl shadow-xl animate-pulse text-center border-4 border-green-400">
            <h2 className="text-3xl font-black mb-2">WINNER! 🎉</h2>
            <p className="text-xl font-bold">{matchResult.number}</p>
            <p className="text-green-100 mt-2">
              Matched {matchResult.detail.operator} - {matchResult.detail.category.toUpperCase()}
            </p>
          </div>
        )}

        {matchResult?.status === 'no_match' && (
          <div className="bg-neutral-800 text-neutral-300 p-4 rounded-xl text-center border border-neutral-700">
            <p>No matching numbers found for today's draw.</p>
          </div>
        )}

        {matchResult?.status === 'no_numbers_found' && (
          <div className="bg-neutral-800 text-yellow-300 p-4 rounded-xl text-center border border-yellow-900/50">
            <p>Could not clearly detect any 4-digit numbers. Try moving closer to the ticket.</p>
          </div>
        )}
      </div>
    </div>
  );
}
