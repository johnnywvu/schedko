import React from 'react';

const Support = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
    <div className="max-w-3xl w-full px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow p-8 border-t-4 border-yellow-400">
        <h1 className="font-lora text-3xl font-bold text-green-900 mb-4">Need Help?</h1>
        <p className="font-jost text-lg text-green-900 mb-4">
          If you're having trouble using <strong>SchedKo</strong>, this page is here to help. Below are common issues and how to solve them.
        </p>

        <h2 className="font-lora text-2xl font-bold text-green-900 mt-6 mb-2">Frequently Asked Questions</h2>
        <ul className="list-disc pl-6 font-jost text-green-900 mb-4">
          <li><strong>Why isn’t my file uploading?</strong>  
            <br />Make sure it’s a PDF file and under 10MB in size.
          </li>
          <li><strong>The system didn’t detect my section.</strong>  
            <br />Double-check your spelling or formatting. Try searching with no spaces or dashes (e.g. <code>bsit2a</code>).
          </li>
          <li><strong>My schedule looks wrong.</strong>  
            <br />The exam file might have poor scan quality. Try adjusting brightness and reuploading.
          </li>
          <li><strong>Can I reupload a file?</strong>  
            <br />Yes — just select a new file and your schedule will update automatically.
          </li>
        </ul>

        <h2 className="font-lora text-2xl font-bold text-green-900 mt-6 mb-2">Still Stuck?</h2>
        <p className="font-jost text-green-900 mb-2">
          If you encounter a bug or have suggestions, feel free to reach out via email:
        </p>
        <p className="font-jost text-green-900 font-semibold">
          📩 <a href="johnny.vu2004@gmail.com" className="underline">johnny.vu2004@gmail.com</a>
        </p>
      </div>
    </div>
  </div>
);

export default Support;
