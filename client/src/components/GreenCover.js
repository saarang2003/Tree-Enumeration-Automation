import React, { useState } from 'react';

function GreenCover() {
    const [uploadedImage, setUploadedImage] = useState('');
    const [processedImage, setProcessedImage] = useState('');
    const [greenCoverPercentage, setGreenCoverPercentage] = useState('');
    const [idleLandPercentage, setIdleLandPercentage] = useState('');

    const processImage = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                let blackPixelCount = 0;

                let totalGreen = 0;
                for (let i = 1; i < imageData.data.length; i += 4) {
                    totalGreen += imageData.data[i];
                }
                const meanGreen = totalGreen / (imageData.data.length / 4);

                for (let i = 0; i < imageData.data.length; i += 4) {
                    let gray = imageData.data[i + 1] * 0.587;

                    if (gray < meanGreen / 1.5) {
                        gray = 0;
                        blackPixelCount++;
                    } else {
                        gray = 255;
                    }

                    imageData.data[i] = gray;
                    imageData.data[i + 1] = gray;
                    imageData.data[i + 2] = gray;
                    imageData.data[i + 3] = 255;
                }

                ctx.putImageData(imageData, 0, 0);

                setProcessedImage(canvas.toDataURL());
                const greenCoverPercent = ((blackPixelCount / (canvas.width * canvas.height)) * 100).toFixed(2);
                setGreenCoverPercentage(greenCoverPercent);
                setIdleLandPercentage((100 - greenCoverPercent).toFixed(2));
            };

            img.src = reader.result;
            setUploadedImage(reader.result);
        };

        reader.readAsDataURL(file);
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
            <input
                type="file"
                accept="image/*"
                onChange={processImage}
                className="block mb-4 p-2 w-full text-sm text-gray-500 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
            />
            <div className="flex justify-around mb-4">
                {uploadedImage && <img src={uploadedImage} alt="Uploaded" className="w-1/2 object-cover mr-2" />}
                {processedImage && <img src={processedImage} alt="Processed" className="w-1/2 object-cover" />}
            </div>
            <div className="text-lg">
                <p className="mb-2">
                    <span className="font-bold">Green Cover Percentage:</span> {greenCoverPercentage}%
                </p>
                <p>
                    <span className="font-bold">Idle Land Percentage:</span> {idleLandPercentage}%
                </p>
            </div>
        </div>
    );
}

export default GreenCover;