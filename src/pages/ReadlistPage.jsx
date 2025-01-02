import { useEffect, useState } from "react"
import { Button } from "../components/ui/button"
import buildPath from "../utils/buildPath"
import { useNavigate } from "react-router-dom"

const ReadlistPage = () => {
    const [search, setSearch] = useState('')
    const [books, setBooks] = useState([])
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    const fetchBookList = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/books/readlist`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
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
        fetchBookList()
    }, [])

    const handleDeleteBook = async (id) => {
        if (window.confirm("Yakin ingin menghapus buku?") == true) {
            try {
                const response = await fetch(`http://localhost:5000/api/books/${id}/readlist`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    fetchBookList()
                    alert("Buku berhasil dihapus!")
                } else {
                    throw new Error("Book Not Found")
                }
            } catch (error) {
                alert(error)
            }
        }
    }

    return (
        <div className="flex flex-col p-4 gap-4">
            <div className="flex flex-row gap-4 items-center">
                <div className="flex flex-row flex-1 border rounded-md gap-4 p-1 items-center">
                    <h1>Cari buku</h1>
                    <input className="p-1 rounded-md border flex-1 border-black" value={search} onChange={e => setSearch(e.target.value)} type="text" />
                </div>
            </div>
            <div className="flex flex-col">
                {books
                    .filter((book) => book.title.toLowerCase().includes(search.toLowerCase()))
                    .map((book, index) => (
                        <div className="flex flex-row border rounded-xl p-4 gap-4" key={book._id + index}>
                            <div className="flex flex-row border-r px-4 gap-4">
                                <img src={buildPath('uploads/' + book.cover)} className="w-full max-w-48 aspect-[3/4] object-cover" />
                                <div className="flex flex-col items-center">
                                    <h1 className="text-xl font-semibold">{book.title}</h1>
                                    <ul>
                                        <li><strong>Penulis:</strong> {book.information.author || "Tidak tersedia"}</li>
                                        <li><strong>Penerbit:</strong> {book.information.publisher || "Tidak tersedia"}</li>
                                        <li><strong>Tahun Terbit:</strong> {book.information.publicationYear || "Tidak tersedia"}</li>
                                        <li><strong>Tema:</strong>
                                            {book.information.theme.length > 0
                                                ? book.information.theme.join(", ")
                                                : "Tidak tersedia"}
                                        </li>
                                        <li><strong>Genre:</strong>
                                            {book.information.genre.length > 0
                                                ? book.information.genre.join(", ")
                                                : "Tidak tersedia"}
                                        </li>
                                        <li><strong>Demografi:</strong> {book.information.demographic || "Tidak tersedia"}</li>
                                        <li><strong>Jumlah Halaman:</strong> {book.information.pageCount || "Tidak tersedia"}</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="flex flex-1">
                                <p>{book.synopsys}</p>
                            </div>
                            <div className="flex flex-col gap-4">
                                <Button onClick={() => navigate(`/book/${book._id}`)}>Detail</Button>
                                <Button onClick={() => handleDeleteBook(book._id)}>Hapus</Button>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default ReadlistPage