import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Forum = () => {
  const navigate = useNavigate();
  const [discussions, setDiscussions] = useState([]); // State untuk menyimpan data diskusi
  const [loading, setLoading] = useState(true); // State untuk indikator loading

  // Fungsi untuk fetch data dari API
  useEffect(() => {
    fetch('http://localhost:5000/api/forums') // Ganti dengan endpoint API Anda
      .then((response) => response.json())
      .then((data) => {
        setDiscussions(data); // Simpan data diskusi ke state
        setLoading(false); // Matikan indikator loading
      })
      .catch((error) => {
        console.error('Error fetching discussions:', error);
        setLoading(false);
      });
  }, []);

  // Fungsi format tanggal dengan fallback ke tanggal hari ini
  const formatDateTime = (isoString) => {
    let date;
    try {
      date = new Date(isoString);
      if (isNaN(date.getTime())) throw new Error(); // Jika tanggal tidak valid
    } catch {
      date = new Date(); // Gunakan tanggal hari ini sebagai fallback
    }
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('/home')}
              className="text-gray-600 hover:text-gray-900"
            >
              &larr; Beranda
            </button>
            <h1 className="text-2xl font-bold">Forum</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tombol Buat Forum Baru */}
        <button
          onClick={() => navigate('/forum/create')}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Buat Forum Baru
        </button>

        {/* Indikator Loading */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="space-y-4">
            {discussions.map((discussion) => (
              <div
                key={discussion._id} // Gunakan ID unik dari database
                className="bg-white shadow rounded-lg p-4 flex justify-between items-center"
                onClick={() => navigate(`/forum/${discussion._id}`)} // Navigasi ke detail forum
                style={{ cursor: 'pointer' }}
              >
                <div>
                  <h2 className="text-lg font-bold">{discussion.title}</h2>
                  <p className="text-sm text-gray-500">
                    {formatDateTime(discussion.createdAt)} oleh{' '}
                    <span className="font-medium">{discussion.author.username}</span>
                  </p>
                  <p className="text-gray-700 mt-1">{discussion.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-4 text-center text-gray-500">Semua diskusi telah ditampilkan</p>
      </main>
    </div>
  );
};

export default Forum;
