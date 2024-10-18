import React, { useState } from 'react';
import axios from 'axios';

function TreeCount() {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [preprocessedImage, setPreprocessedImage] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const loadImageBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async () => {
    if (file) {
      setLoading(true); // Start loading

      const imageBase64 = await loadImageBase64(file);
      setPreprocessedImage(imageBase64);
      
      axios.post('http://localhost:5000/api/tree-count/detect', { image: imageBase64 })
        .then(response => {
          const predictions = response.data.predictions;
          setOutput(`Tree Count: ${predictions.length}`);
          drawBoundingBoxes(predictions);
        })
        .catch(error => {
          console.log('Error:', error.message);
        })
        .finally(() => {
          setLoading(false); // Stop loading
        });
    }
  };

  const drawBoundingBoxes = (predictions) => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = imagePreview;

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0, image.width, image.height);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;

      predictions.forEach(prediction => {
        const { x, y, width, height } = prediction;
        ctx.strokeRect(x - width / 2, y - height / 2, width, height);
      });
    };
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Upload an Image to Count Trees</h1>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <button 
        onClick={handleSubmit} 
        className="px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition"
        disabled={loading} // Disable button when loading
      >
        Submit
      </button>

      {loading && (
        <div className="mt-4">
          <p className="text-lg font-medium text-gray-800">Processing...</p>
          <div className="loader"></div> {/* Add your spinner here */}
        </div>
      )}

      {/* Use conditional classes for visibility */}
      <div className={`${imagePreview ? '' : 'hidden'} mt-6`}>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Uploaded Image:</h3>
        <img id="image-preview" src={imagePreview} alt="Uploaded" className="max-w-full h-auto rounded border border-gray-300 shadow" />
      </div>

      <div className={`${preprocessedImage ? '' : 'hidden'} mt-6`}>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Preprocessed Image (Base64):</h3>
        <img id="preprocessed-preview" src={preprocessedImage} alt="Preprocessed" className="max-w-full h-auto rounded border border-gray-300 shadow" />
      </div>

      <div className={`${output ? '' : 'hidden'} mt-6`}>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Detected Trees (Highlighted):</h3>
        <canvas id="canvas" className="border border-gray-300 rounded shadow"></canvas>
      </div>
      
      <p id="output" className="text-lg font-medium text-gray-800 mt-4">{output}</p>
    </div>
  );
}

export default TreeCount;
