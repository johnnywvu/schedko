import React from 'react'
import { useState } from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


const Hero = () => {

    const [isDragging, setisDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setisDragging(true);
    }

    const handleDragLeave = () => {
        setisDragging(false);
    }

    const handleDrop = (e) => {
        e.preventDefault();
        setisDragging(false);
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    }

    const handleFileSelect = async (file) => {
        if (file && file.type === 'application/pdf'){
            if (file.size <= 30 * 1024 * 1024){
                setSelectedFile(file);
                await uploadFile(file);
            } else {
                alert('File size too big!');
            }
        } else {
            alert('Please select a PDF file');
        }
    }
    
    const uploadFile = async (file) => {
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('pdf', file);

            const response = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.error || 'Upload Failed');
            }

            alert('File uploaded successfully!');

        } catch (error) {
            console.error('Uplaod error:', error);
            alert('Error uploading file: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    }


  return (    <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
            {/* Left Side Container - Hero Text */}
            <div className="flex-1 flex flex-col gap-6 md:gap-8 justify-center max-w-2xl lg:max-w-none mx-auto">                <div className="text-center">                    <h1 className="font-lora text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 md:mb-6 drop-shadow-sm">
                        Personalized Exam <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 bg-clip-text text-transparent drop-shadow">Schedules,</span> Made <span className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 bg-clip-text text-transparent drop-shadow">Easy</span>
                    </h1>
                    <p className="font-jost text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-600 max-w-xl mx-auto drop-shadow-sm">
                        Upload your university exam file, select your program and section, and instantly view a clean, customized calendar just for you.
                    </p>
                </div>
            </div>

            {/* Right Side Container - Animation and Upload */}
            <div className="flex-1 flex flex-col items-center justify-center gap-6 md:gap-8 max-w-2xl lg:max-w-none mx-auto">                {/* Animation */}
                <div className="w-full max-w-[280px] sm:max-w-[400px] md:max-w-[480px] lg:max-w-[520px] xl:max-w-[600px] mx-auto">
                    <DotLottieReact
                        className="w-full h-auto"
                        src="hero-lottie.json"
                        loop
                        autoplay
                    />
                </div>

                {/* Upload Area */}
                <div className="w-full max-w-sm lg:max-w-md mx-auto">
                    <div
                        className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 md:p-10 lg:p-12 text-center cursor-pointer transition-all duration-300 ease-in-out
                                ${isDragging 
                                    ? 'border-transparent bg-blue-50 before:absolute before:inset-0 before:rounded-xl before:border-2 before:border-dashed before:border-blue-500 before:animate-pulse' 
                                    : 'border-gray-300 hover:border-gray-400 hover:shadow-lg'
                                }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('fileInput').click()}
                    >
                        <input
                            type="file"
                            id="fileInput"
                            className="hidden"
                            accept=".pdf"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                handleFileSelect(file);
                            }}
                        />

                        <div className="mb-4">
                            <svg
                                className="mx-auto h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-gray-400 group-hover:text-blue-500 transition-colors duration-300"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                            >
                                <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>

                        <p className="text-lg sm:text-xl font-medium text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors duration-300">
                        Drop your PDF here or click to upload
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                        Only accepts <span className='font-bold' >.pdf</span> | <span className='italic' >Max 5MB</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>


    
  )
}

export default Hero