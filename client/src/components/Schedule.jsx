import React from 'react';

const Schedule = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="font-lora text-3xl font-bold text-gray-900 mb-6">Your Exam Schedule</h1>
          
          {/* Schedule content will go here */}
          <div className="space-y-4">
            <p className="font-jost text-gray-600">Your schedule is being processed...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
