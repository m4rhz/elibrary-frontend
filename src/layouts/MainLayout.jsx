import { useState, useEffect, useContext, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom"
import ProfilePopup from "../components/ui/ProfilePopup";

const MainLayout = () => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate()
    const isLoggedIn = localStorage.getItem('token') !== null;
    const [profileOpen, setProfileOpen] = useState(false)
    const profileRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false)
            }
        };

        if (profileOpen) {
            document.addEventListener("click", handleClickOutside);
        }

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [profileOpen, setProfileOpen]);

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

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold">e-Library</h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            {!isLoggedIn ? (
                                <>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="px-4 py-2 text-gray-700 hover:text-gray-900"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => navigate('/register')}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Sign Up
                                    </button>
                                </>
                            ) : (
                                <button 
                                    onClick={() => setProfileOpen(prev => !prev)} ref={profileRef}
                                    className="relative flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                    <span>{username || 'User'}</span>

                                    <ProfilePopup isVisible={profileOpen} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="bg-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-12">
                        <div className="flex space-x-8">
                            <button
                                className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                onClick={() => navigate('/books')} // Untuk navigasi ke Buku
                            >
                                Buku
                            </button>
                            <button
                                className="text-gray-900 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                onClick={() => navigate('/forum')} // Navigasi ke Forum
                            >
                                Forum
                            </button>
                        </div>
                        <button className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                            Surprise Me!
                        </button>
                    </div>
                </div>
            </nav>

            <Outlet />
        </div>
    )
}

export default MainLayout