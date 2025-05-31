import React from 'react';

const About = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow p-8 border-t-4 border-green-400">
        <h1 className="font-lora text-3xl font-bold text-green-900 mb-4">About SchedKo</h1>
        <p className="font-jost text-lg text-green-900 mb-4">
          <strong>SchedKo</strong> is a smart exam schedule generator built for students. It takes the hassle out of finding your exam dates by turning messy, university-issued PDF schedules into a clean, personalized calendar—just for you.
        </p>
        <ul className="list-disc pl-6 font-jost text-green-900 mb-4">
          <li>Upload your exam schedule file once—no searching line by line</li>
          <li>Powerful OCR extracts and organizes data behind the scenes</li>
          <li>Find your section easily with smart search and auto-matching</li>
          <li>See your exams in a Google Calendar–style view</li>
          <li>Download your schedule or sync it to your calendar app</li>
        </ul>
        <p className="font-jost text-green-900">
          Designed for simplicity, speed, and the students who just want clarity during exam season. SchedKo is your exam schedule—on your terms.
        </p>
      </div>
    </div>
  </div>
);

export default About;