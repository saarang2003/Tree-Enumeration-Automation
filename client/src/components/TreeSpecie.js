import React, { useState } from 'react';
import axios from 'axios';

const TreeSpecie = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [detectedSpecies, setDetectedSpecies] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async () => {
        if (!selectedFile) {
            alert('Please upload an image');
            return;
        }

        try {
            // Convert the image to base64
            const base64 = await toBase64(selectedFile);

            // Send the image to the backend for processing
            const response = await axios.post('http://localhost:5000/api/tree-species/detect', {
                imageBase64: base64.split(',')[1],
            });

            const speciesList = response.data.predictions.map((pred) => pred.class).join(', ');
            setDetectedSpecies(speciesList);
        } catch (err) {
            setError('Error detecting tree species. Please try again.');
            console.error(err);
        }
    };

    const toBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    return (
        <div className="flex flex-col items-center p-5">
            <h1 className="text-2xl font-bold text-green-600 mb-5">Tree Species Detection</h1>

            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mb-3 p-2 border border-green-600 rounded"
            />

            {imagePreview && (
                <div className="mb-3">
                    <h2 className="text-lg mb-2">Uploaded Image</h2>
                    <img src={imagePreview} alt="Uploaded" className="w-72 border rounded" />
                </div>
            )}

            <button
                onClick={handleSubmit}
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-500"
            >
                Submit
            </button>

            {detectedSpecies && (
                <p className="mt-5 text-lg font-semibold text-gray-800">
                    Detected Tree Species: {detectedSpecies}
                </p>
            )}

            {error && (
                <p className="mt-5 text-red-500">{error}</p>
            )}
        </div>
    );
};

export default TreeSpecie;