import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ForumDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [forum, setForum] = useState(null);
    const [replies, setReplies] = useState([]); // State untuk balasan
    const [newReply, setNewReply] = useState(''); // State untuk input balasan

    useEffect(() => {
        const fetchForum = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/forums/${id}`);
                const data = await response.json();

                if (response.ok) {
                    setForum(data);
                    setReplies(data.replies || []); // Set balasan dari data API
                } else {
                    console.error('Failed to fetch forum:', data.message);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchForum();
        fetchReplies();
    }, [id]);

    const fetchReplies = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/forums/${id}/comments`);
            const data = await response.json();

            if (response.ok) {
                setReplies(data || []); // Set balasan dari data API
            } else {
                console.error('Failed to fetch forum:', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus forum ini?')) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token otorisasi tidak ditemukan.');
                return;
            }

            const response = await fetch(`http://localhost:5000/api/forums/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                console.log('Forum berhasil dihapus.');
                navigate('/forum'); // Kembali ke daftar forum
            } else {
                const errorData = await response.json();
                console.error('Gagal menghapus forum:', errorData.message || response.statusText);
            }
        } catch (error) {
            console.error('Error saat menghapus forum:', error);
        }
    };

    const handleAddReply = async () => {
        if (!newReply.trim()) {
            alert('Balasan tidak boleh kosong.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token otorisasi tidak ditemukan.');
                return;
            }

            const response = await fetch(`http://localhost:5000/api/forums/${id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ message: newReply }),
            });

            if (response.ok) {
                const addedReply = await response.json();
                console.log('Balasan berhasil ditambahkan:', addedReply);
                fetchReplies()
                setNewReply(''); // Reset input balasan
            } else {
                const errorData = await response.json();
                console.error('Gagal menambahkan balasan:', errorData.message || response.statusText);
            }
        } catch (error) {
            console.error('Error saat menambahkan balasan:', error);
        }
    };

    if (!forum) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <button onClick={() => navigate('/forum')} className="mb-4">
                &larr; Kembali ke Forum
            </button>
            <div className="bg-white p-6 shadow rounded-md">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold">{forum.title}</h1>
                    <p className="text-sm text-gray-500">
                        {new Date(forum.timestamp).toLocaleString()} oleh {forum.author.username}
                    </p>
                </div>
                <p className="mb-4">{forum.description}</p>
                <div className="flex space-x-4">
                    <button
                        onClick={() => navigate(`/forum/${forum._id}/edit`)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-md"
                    >
                        Ubah
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-md"
                    >
                        Hapus
                    </button>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Balasan</h2>
                <textarea
                    placeholder="Tulis balasan..."
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md mb-4"
                    rows="4"
                ></textarea>
                <button
                    onClick={handleAddReply}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                    Kirim
                </button>

                {replies.length > 0 ? (
                    <ul className="mt-4 space-y-4">
                        {replies.map((reply, index) => (
                            <li key={index} className="bg-gray-100 p-4 rounded-md">
                                <p className="text-sm text-gray-500">
                                    {new Date(reply.created_at).toLocaleString()} oleh {reply.author?.username}
                                </p>
                                <p>{reply.message}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-4 text-gray-500">Belum ada balasan</p>
                )}
            </div>
        </div>
    );
};

export default ForumDetailPage;
