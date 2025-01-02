import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, LogOut, Upload } from 'lucide-react';
import buildPath from '../utils/buildPath';

const Profile = () => {
    const navigate = useNavigate();
    const [activeView, setActiveView] = useState('main');
    const [user, setUser] = useState({
        username: '',
        aboutMe: '',
        profileImage: ''
    });
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const handleBack = () => {
        if (activeView === 'edit') {
            setActiveView('main');
            setPreviewImage(null);
        } else {
            navigate('/home');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/users/profile', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                setUser(data.user);
                if (data.user.profileImage) {
                    setPreviewImage(data.user.profileImage);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const MainProfileView = () => (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-lg font-medium flex items-center gap-2">
                    <button onClick={handleBack} className="hover:text-gray-600">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    Profile Management
                </h1>
            </div>

            {/* Profile Content */}
            <div className="flex flex-col items-center">
                {/* Profile Image */}
                <div className="w-24 h-24 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center mb-6 overflow-hidden">
                    {user.profileImage ? (
                        <img
                            src={buildPath(`uploads/${user.profileImage}`)}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                console.error('Error loading image');
                                e.target.src = ''; // Reset to default if error
                                e.target.onerror = null;
                            }}
                        />
                    ) : (
                        <svg className="w-16 h-16 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    )}
                </div>

                <div className="space-y-4 w-full max-w-xs">
                    {/* Username Display */}
                    <div className="text-center">
                        <h2 className="text-xl font-semibold">{user.username}</h2>
                        <p className="text-gray-600">{user.aboutMe || 'No bio added yet'}</p>
                    </div>

                    {/* Edit Profile Button */}
                    <button
                        onClick={() => setActiveView('edit')}
                        className="w-full px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                        Edit Profile
                    </button>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors gap-2"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );

    const EditProfileView = () => {
        const [formData, setFormData] = useState({
            username: user.username,
            aboutMe: user.aboutMe || '',
            profileImage: user.profileImage || ''
        });

        const handleImageChange = async (e) => {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('http://localhost:5000/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('File upload failed');
                }

                const result = await response.json();
                setFormData(prev => ({ ...prev, profileImage: result.filename })); // Mengembalikan nama file yang diunggah
                setPreviewImage(result.filename)
            } catch (error) {
                console.error('Error uploading file:', error);
                throw error;
            }
        };

        // Di Profile.js, dalam handleSubmit:
        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                const response = await fetch('http://localhost:5000/api/users/profile', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ...formData, profileImage: previewImage })
                });

                const data = await response.json();

                if (response.ok) {
                    setUser(data.user);
                    setShowSuccessModal(true);

                    setTimeout(() => {
                        setShowSuccessModal(false);
                        setActiveView('main');
                    }, 2000);
                } else {
                    alert(data.message || 'Error updating profile');
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                alert('Error updating profile');
            }
        };



        const uploadFile = async (file) => {
        };

        return (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg relative">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-lg font-medium flex items-center gap-2">
                        <button onClick={handleBack} className="hover:text-gray-600">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        Edit Profile
                    </h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Image Section */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-24 h-24 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                            {previewImage ? (
                                <img
                                    src={buildPath(`uploads/${previewImage}`)}
                                    alt="Profile Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <svg className="w-16 h-16 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="file"
                                id="profileImage"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <label
                                htmlFor="profileImage"
                                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 cursor-pointer"
                            >
                                <Upload size={18} />
                                Upload Photo
                            </label>
                        </div>
                    </div>

                    {/* Username Input */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Username</label>
                        <input
                            type="text"
                            placeholder="Ketik Username....."
                            className="w-full p-2 bg-gray-100 rounded-md"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>

                    {/* About Me Input */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">About Me</label>
                        <textarea
                            placeholder="Tell us about yourself..."
                            rows={3}
                            className="w-full p-2 bg-gray-100 rounded-md"
                            value={formData.aboutMe}
                            onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
                        />
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>

                {/* Success Modal */}
                {showSuccessModal && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-gray-800 text-white p-6 rounded-lg flex items-center gap-3">
                            <Award className="w-6 h-6" />
                            <span>Profile Berhasil disimpan</span>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4">
            {activeView === 'main' && <MainProfileView />}
            {activeView === 'edit' && <EditProfileView />}
        </div>
    );
};

export default Profile;