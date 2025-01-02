import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SupportAndHelpCenter = () => {
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState('');

  const handleSubmit = () => {
    // Lakukan sesuatu dengan pengaduan, seperti mengirim ke backend
    console.log('Pengaduan:', complaint);
    alert('Pengaduan telah dikirim!');
    setComplaint(''); // Reset input setelah submit
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate(-1)} // Kembali ke halaman sebelumnya
              className="text-gray-600 hover:text-gray-900"
            >
              &larr; Support and Help Center
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-semibold mb-4">Pengaduan</h2>
        <textarea
          className="w-full h-40 p-4 bg-gray-200 rounded-lg resize-none text-gray-700"
          placeholder="Ketik Pengaduan ..."
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
        ></textarea>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            className="flex items-center space-x-2 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <span>Submit</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default SupportAndHelpCenter;
