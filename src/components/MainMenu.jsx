import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneCall } from 'lucide-react';
import buildPath from '../utils/buildPath';

const MainMenu = () => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('token') !== null;
    const [books, setBooks] = useState([])

    const fetchBookList = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/books`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const books = await response.json();
                setBooks(books)
            } else {
                throw new Error("Book Not Found")
            }
        } catch (error) {
            alert(error)
        }
    }

    useEffect(() => {
        const fetchUserData = async () => {
            if (isLoggedIn) {
                try {
                    const response = await fetch('http://localhost:5000/api/users/profile', {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    const data = await response.json();
                    setUsername(data.user.username);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, [isLoggedIn]);

    useEffect(() => {
        fetchBookList()
    }, [])

    return (
        <>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {books.map((book, index) => (
                        <div
                        onClick={() => navigate(`/book/${book._id}`)}
                            key={index}
                            className="cursor-pointer bg-gray-200 rounded-lg p-4 flex flex-col items-center justify-center gap-4"
                        >
                            <img
                                src={buildPath(`uploads/${book.cover}`)}
                                alt={book.title}
                                className="w-full max-h-64 object-cover rounded flex-1"
                            />
                            <h1>{book.title}</h1>
                        </div>
                    ))}
                </div>
            </main>

            {/* Support Button */}
            <div className="fixed bottom-8 left-8">
                <button
                    onClick={() => navigate('/support')} // Navigasi ke halaman Support.js
                    className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700"
                >
                    <PhoneCall size={20} />
                    <span>Support and Help Center</span>
                </button>
            </div>
        </>
    );
};

export default MainMenu;
