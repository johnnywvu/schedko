import React from 'react';
import Lottie from 'lottie-react';
import uploadAnimation from '../../public/upload-lottie.json'
import parsingAnimation from '../../public/data-clean-lottie.json'
import scheduleAnimation from '../../public/schedule-lottie.json'

const HowItWorks = () => {
  const steps = [
    {
      title: "Upload your schedule PDF",
      animation: uploadAnimation,
      subtext: "Simply drag and drop the provided exam schedule PDF or clock to upload - it only takes a second!"
    },
    {
      title: "We parse and clean your data",
      animation: parsingAnimation,
      subtext: "The system extracts and organizes the exam schedules by class code, and looks for yours."
    },
    {
      title: "Custom made exam schedule just for you!",
      animation: scheduleAnimation,
      subtext: "Obtain a fully customized exam schedule calendar tailored specifically for you!"
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-lora text-3xl font-bold text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="font-jost mt-4 text-xl text-gray-600">
            Three simple steps to get your schedule organized
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              > <div className='flex items-center justify-center w-32 h-32 mb-4'>
                  <Lottie
                    animationData={step.animation}
                    loop={true}
                    autoplay={true}
                    rendererSettings={{
                      preserveAspectRatio: 'xMidYMid slice'
                    }}
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>


                <h3 className="font-lora text-xl font-semibold text-gray-900">
                  {step.title}
                </h3>
                
                <p className='font-jost'>
                  {step.subtext}
                </p>
                
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
