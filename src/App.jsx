import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Registration from './components/Registration';
import Login from './components/Login';
import MainMenu from './components/MainMenu';
import Profile from './components/Profile';
import Forum from './components/Forum';
import CreateForumPage from './components/CreateForumPage';
import ForumDetailPage from './components/ForumDetailPage';
import Support from './components/Support';
import EditForumPage from './components/EditForumPage';
import BookDetailPage from './components/BookDetailPage';
import MainLayout from './layouts/MainLayout';
import BookListPage from './pages/admin/BookListPage';
import CreateBookPage from './pages/admin/CreateBookPage';
import EditBookPage from './pages/admin/EditBookPage';
import { ModalProvider } from './contexts/ModalContext';
import { Toaster } from 'react-hot-toast';
import ReadlistPage from './pages/ReadlistPage';



// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('token') !== null;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

function App() {
    return (
        <ModalProvider>
            <Toaster />
            <Router>
                <Routes>
                    <Route path="/register" element={<Registration />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<MainLayout />}>
                        <Route path="/home" element={<MainMenu />} />
                        <Route path="/books" element={<MainMenu />} />
                        <Route path="/forum" element={<Forum />} />
                        <Route path="/forum/:id" element={<ForumDetailPage />} />
                        <Route path="/book/readlist" element={<ReadlistPage />} />
                        <Route path="/book/:id" element={<BookDetailPage />} />
                    </Route>
                    <Route path="/forum/create" element={<CreateForumPage />} />
                    <Route path="/forum/:id/edit" element={<EditForumPage />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/admin" element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>}
                    >
                        <Route path="/admin/books" element={<BookListPage />} />
                        <Route path="/admin/books/new" element={<CreateBookPage />} />
                        <Route path="/admin/books/:id/edit" element={<EditBookPage />} />
                    </Route>

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/" element={<Navigate to="/home" replace />} />
                </Routes>
            </Router>
        </ModalProvider>
    );
}

export default App;