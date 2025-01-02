import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditForumPage = () => {
    const { id } = useParams()
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const fetchForum = async () => {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:5000/api/forums/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const forum = await response.json();
            setTitle(forum.title)
            setDescription(forum.description)
        } else {
        }
    }

    useEffect(() => {
        fetchForum()
    }, [])

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`http://localhost:5000/api/forums/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    description,
                }),
            });

            if (response.ok) {
                navigate(`/forum/${id}`); // Arahkan ke halaman ForumDetailPage berdasarkan ID
            } else {
                console.error('Gagal membuat forum:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Buat Forum Baru</h1>
            <form onSubmit={handleUpdate}>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                        Judul Diskusi
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="Tulis judul baru"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                        Deskripsi
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        rows="5"
                        placeholder="Tulis isi diskusi"
                        required
                    ></textarea>
                </div>
                <div className="flex space-x-4">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Buat
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/forum')} // Kembali ke halaman forum jika dibatalkan
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                        Batal
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditForumPage;
