import { useEffect, useState } from "react"
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "./ui/button"
import buildPath from "../utils/buildPath"
import moment from 'moment'

const BookDetailPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [showReviewForm, setShowReviewForm] = useState(false)
    const [reviewForm, setReviewForm] = useState({ rate: '', review: '' })
    const [bookDetail, setBookDetail] = useState({
        title: "",
        cover: "",
        synopsys: "",
        information: {
            author: "",
            publisher: "",
            publicationYear: 0,
            theme: [],
            genre: [],
            demographic: "",
            pageCount: 0,
        },
        user_review: { rate: 0, review: 0 },
        user_reviews: [],
        user_readlist: { status: '' }
    })

    const token = localStorage.getItem('token')
    const isLoggedIn = token !== null

    const fetchBookDetail = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/books/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const book = await response.json();
                setBookDetail(book)
            } else {
                throw new Error("Book Not Found")
            }
            handleCancelReview()
        } catch (error) {
            alert(error)
        }
    }

    const toggleReviewForm = () => {
        setReviewForm({ rate: bookDetail?.user_review?.rate ?? '', review: bookDetail?.user_review?.review ?? '' })
        setShowReviewForm(prev => !prev)
    }

    const handleCancelReview = () => {
        setReviewForm({ rate: '', review: '' })
        setShowReviewForm(false)
    }

    const handleSendReview = async (e) => {
        try {
            const response = await fetch(`http://localhost:5000/api/books/${id}/review`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(reviewForm)
            });

            if (response.status == '200' || response.status == '201') {
                fetchBookDetail()
            } else {
                throw new Error("Book Not Found")
            }
        } catch (error) {
            alert(error)
        }
    }

    const handleReadlist = async (status) => {
        await toast.promise(
            (async () => {
                const response = await fetch(`http://localhost:5000/api/books/${id}/readlist`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status })
                });

                if (response.status === 200 || response.status === 201) {
                    await fetchBookDetail();
                } else {
                    throw new Error("Book Not Found");
                }
            })(),
            {
                loading: 'Mengupdate daftar pribadi...',
                success: 'Buku dalam daftar pribadi telah diupdate',
                error: (err) => err.message || 'Failed to update readlist!',
            }
        );
    }

    useEffect(() => {
        fetchBookDetail()
    }, [])

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
                        <h1 className="text-2xl font-bold">Detail Buku</h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-2 sm:px-3 lg:px-4 py-8">
                <div className="border-b p-2 md:p-4">
                    <h1 className="text-3xl font-bold">{bookDetail.title}</h1>
                </div>
                <div className="flex flex-row p-2 md:p-4 gap-2 md:gap-4 border-b">
                    <div className="flex flex-col w-80 shrink-0 grow-0">
                        <img className="max-h-[360px] object-cover" src={buildPath(`uploads/${bookDetail.cover}`)} alt="" />
                        <h3><strong>Informasi</strong></h3>
                        <ul>
                            <li><strong>Penulis:</strong> {bookDetail.information.author || "Tidak tersedia"}</li>
                            <li><strong>Penerbit:</strong> {bookDetail.information.publisher || "Tidak tersedia"}</li>
                            <li><strong>Tahun Terbit:</strong> {bookDetail.information.publicationYear || "Tidak tersedia"}</li>
                            <li><strong>Tema:</strong>
                                {bookDetail.information.theme.length > 0
                                    ? bookDetail.information.theme.join(", ")
                                    : "Tidak tersedia"}
                            </li>
                            <li><strong>Genre:</strong>
                                {bookDetail.information.genre.length > 0
                                    ? bookDetail.information.genre.join(", ")
                                    : "Tidak tersedia"}
                            </li>
                            <li><strong>Demografi:</strong> {bookDetail.information.demographic || "Tidak tersedia"}</li>
                            <li><strong>Jumlah Halaman:</strong> {bookDetail.information.pageCount || "Tidak tersedia"}</li>
                        </ul>

                    </div>
                    <div className="flex flex-col gap-3">
                        {!bookDetail?.user_readlist ?
                            <Button className="max-w-64" onClick={() => handleReadlist('to_read')}>+ Tambahkan ke daftar saya</Button>
                            :
                            <select onChange={e => handleReadlist(e.target.value)} defaultValue={bookDetail.user_readlist} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-64">
                                <option value="to_read">Akan Dibaca</option>
                                <option value="reading">Sedang Dibaca</option>
                                <option value="completed">Telah Dibaca</option>
                            </select>
                        }
                        <h3><strong>Sinopsis</strong></h3>
                        <p>{bookDetail.synopsys}</p>
                    </div>
                </div>
                <div className="flex flex-col p-2 md:p-4 gap-4">
                    <div className="flex flex-row items-center gap-2 md:gap-4">
                        <h1 className="text-2xl font-semibold">Review</h1>
                        {isLoggedIn &&
                            showReviewForm ?
                            <select className="px-4 py-2 border rounded-md" value={reviewForm.rate} onChange={e => setReviewForm(prev => ({ ...prev, rate: e.target.value }))} defaultValue="">
                                <option value="" disabled hidden>
                                    Pilih Rating
                                </option>
                                <option value="5">5</option>
                                <option value="4">4</option>
                                <option value="3">3</option>
                                <option value="2">2</option>
                                <option value="1">1</option>
                            </select>
                            :
                            <Button onClick={toggleReviewForm}>{bookDetail.user_review ? 'Ganti Rating dan Review' : 'Tulis Rating dan Review'}</Button>
                        }
                    </div>
                    {showReviewForm && <>
                        <textarea
                            placeholder="Tulis balasan..."
                            value={reviewForm.review}
                            onChange={(e) => setReviewForm(prev => ({ ...prev, review: e.target.value }))}
                            className="w-full px-3 py-2 border rounded-md mb-4"
                            rows="4"
                        ></textarea>
                        <div className="flex flex-row gap-4">
                            <button
                                onClick={handleSendReview}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                            >
                                Kirim
                            </button>

                            <button
                                onClick={handleCancelReview}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                            >
                                Batal
                            </button>
                        </div>
                    </>}
                    {bookDetail.user_reviews.map((review, index) => (
                        <div className="flex flex-row items-center gap-4 p-2 rounded-xl border" key={index}>
                            <img src={buildPath('uploads/' + review.user.profileImage)} className="rounded-full w-16 h-16 object-cover" alt="" />
                            <div className="flex flex-col flex-1">
                                <h3 className="text-sm font-medium">{review.user.username}</h3>
                                <p>{review.review}</p>
                            </div>
                            <div className="flex flex-col justify-end items-end text-right">
                                <h3 className="text-sm">{moment(review.updated_at).utcOffset("+07:00").format("D MMMM YYYY, HH:mm:ss")}</h3>
                                <h4>{review.rate} ⭐</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </main >
        </div >
    )
}

export default BookDetailPage