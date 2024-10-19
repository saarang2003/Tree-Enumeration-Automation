import React, { useState, useEffect, useRef } from "react";

const OptimalPathing = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isOpencvReady, setOpencvReady] = useState(false);
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

  // Load image
  const loadImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Process the image when the button is clicked
  const processImage = () => {
    if (!isOpencvReady) {
      console.error("OpenCV.js is not ready yet!");
      return;
    }

    let imgElement = document.getElementById("imageSrc");
    let src = window.cv.imread(imgElement); // Use window.cv since it's global
    let dst = new window.cv.Mat();

    // Convert image to grayscale
    window.cv.cvtColor(src, dst, window.cv.COLOR_RGB2GRAY, 0);

    // Threshold image
    window.cv.threshold(dst, dst, 128, 255, window.cv.THRESH_BINARY);

    // Show result
    window.cv.imshow("outputCanvas", dst);
    src.delete();
    dst.delete();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Optimal Pathing</h1>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={loadImage}
        className="mb-4"
      />

      {imageSrc && (
        <div className="relative">
          <img id="imageSrc" src={imageSrc} alt="Uploaded" className="mb-4" />
        </div>
      )}

      <button
        onClick={processImage}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Process Image
      </button>

      <canvas id="outputCanvas" className="mt-4"></canvas>
    </div>
  );
};

export default OptimalPathing;