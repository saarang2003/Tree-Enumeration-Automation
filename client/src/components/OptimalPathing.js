import React, { useState, useEffect, useRef } from 'react';
import { Upload, Loader, X, ArrowRight } from 'lucide-react';

const OptimalPathing = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isOpencvReady, setOpencvReady] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    // Check if OpenCV is loaded
    const checkOpenCv = () => {
      if (window.cv) {
        setOpencvReady(true);
        console.log("OpenCV.js is ready");
      } else {
        console.log("Loading OpenCV.js...");
        setTimeout(checkOpenCv, 100); // Retry until OpenCV is ready
      }
    };

    checkOpenCv();
  }, []);

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Load image via file input
  const loadImage = (e) => {
    handleFile(e.target.files[0]);
  };

  const resetState = () => {
    setImageSrc(null);
  };

  // Process the image when the button is clicked
  const processImage = () => {
    if (!isOpencvReady) {
      console.error("OpenCV.js is not ready yet!");
      return;
    }

    setLoading(true);
    let imgElement = document.getElementById("imageSrc");
    let src = window.cv.imread(imgElement); // Use window.cv since it's global
    let gray = new window.cv.Mat();
    let thresh = new window.cv.Mat();

    // Convert image to grayscale
    window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY, 0);

    // Threshold image
    window.cv.threshold(gray, thresh, 128, 255, window.cv.THRESH_BINARY);

    // Find contours
    let contours = new window.cv.MatVector();
    let hierarchy = new window.cv.Mat();
    window.cv.findContours(thresh, contours, hierarchy, window.cv.RETR_EXTERNAL, window.cv.CHAIN_APPROX_SIMPLE);

    // Draw contours with a red line
    for (let i = 0; i < contours.size(); ++i) {
      window.cv.drawContours(src, contours, i, new window.cv.Scalar(255, 0, 0, 255), 2); // Red stroke line with thickness 2
    }

    // Show result
    window.cv.imshow("outputCanvas", src);

    // Clean up
    src.delete();
    gray.delete();
    thresh.delete();
    contours.delete();
    hierarchy.delete();

    setLoading(false);
  };


  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
              Optimal Pathing
            </h1>
            <p className="mt-2 text-gray-400">
              Path detection
            </p>
          </div>
        </div>

        {!imageSrc ? (
          <div
            className={`relative rounded-xl border-2 p-12
              ${dragActive
                ? 'border-emerald-400 bg-emerald-400/10'
                : 'border-gray-800 hover:border-gray-700 hover:bg-gray-900/50'}
              transition-all duration-300 ease-out
              backdrop-blur-sm
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={loadImage}
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-800 mb-4">
                <Upload className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload aerial imagery</h3>
              <p className="text-gray-400">Drag and drop or click to select</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="relative">
              <button
                onClick={resetState}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/75  transition-colors duration-200 backdrop-blur-sm"
              >
                <X className="h-5 w-5" />
              </button>
              <img
                id="imageSrc"
                src={imageSrc}
                alt="Preview"
                className="w-full rounded-xl object-cover max-h-[600px]"
              />
            </div>

            {!loading ? (
              <button
                onClick={processImage}
                disabled={!isOpencvReady}
                className="group flex items-center justify-center w-full py-4 px-6 
                         bg-emerald-500 hover:bg-emerald-600 rounded-xl font-medium
                         transition-all duration-200 disabled:opacity-50
                         disabled:cursor-not-allowed"
              >
                Process Image
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <div className="flex items-center justify-center py-4 px-6 
                            bg-emerald-500/20 rounded-xl font-medium text-emerald-400">
                <Loader className="animate-spin mr-3 h-5 w-5" />
                Processing your image...
              </div>
            )}

            <canvas
              id="outputCanvas"
              className="mt-8 border border-gray-500 rounded-lg shadow-lg"
            ></canvas>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptimalPathing;