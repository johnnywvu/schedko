import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


const Hero = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [validationStatus, setValidationStatus] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileSelect = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setValidationStatus(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        setValidationStatus(true);
        setShowConfirmation(true); // Show confirmation modal
      } else {
        setValidationStatus(false);
      }
    } catch (error) {
      setValidationStatus(false);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-20">
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 animate-modalPop">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">File Uploaded!</h2>
            <p className="mb-6 text-gray-600">Your exam schedule file was uploaded successfully.</p>
            <button
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              onClick={() => setShowConfirmation(false)}
            >OK</button>
          </div>
        </div>
      )}

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

                          {/* File Upload Content */}
                          <div className="mb-4">
                              {isUploading ? (
                                  <div className="text-center">
                                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                      <p className="text-gray-600">Uploading and validating...</p>
                                  </div>
                              ) : validationStatus === true ? (
                                  <div className="text-center">
                                      <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                      </svg>
                                      <p className="text-green-600 mt-2">Valid exam schedule file!</p>
                                  </div>
                              ) : validationStatus === false ? (
                                  <div className="text-center">
                                      <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                      </svg>
                                      <p className="text-red-600 mt-2">Invalid exam schedule file</p>
                                  </div>
                              ) : (
                                  <>
                                      <svg
                                          className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors duration-300"
                                          stroke="currentColor"
                                          fill="none"
                                          viewBox="0 0 48 48"
                                      >
                                          <path
                                              d="M28 8H12a4 4 0 00-4 4v20m0 0v4a4 4 0 004 4h20a4 4 0 004-4V28m0 0V12a4 4 0 00-4-4h-4m4 20H8m24 0l-8-8m0 0l-8 8m8-8v20"
                                              strokeWidth="2"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                          />
                                      </svg>
                                      <p className="mt-4 text-sm text-gray-600">
                                          Drag and drop your PDF here, or click to select
                                      </p>
                                      <p className="mt-1 text-xs text-gray-500">PDF up to 30MB</p>
                                  </>
                              )}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>


    
  )
}

export default Hero