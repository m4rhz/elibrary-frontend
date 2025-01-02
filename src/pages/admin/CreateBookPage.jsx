import { useEffect, useState } from "react"
import { Input } from "../../components/ui/input"
import { useNavigate } from "react-router-dom"

const CreateBookPage = () => {
    const navigate = useNavigate()
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({
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
        }
    })

    const uploadFile = async (file) => {
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
            return result.filename; // Mengembalikan nama file yang diunggah
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (submitting)
            return
        setSubmitting(true)

        try {
            let coverFilename = formData.cover;

            if (formData.cover instanceof File) {
                coverFilename = await uploadFile(formData.cover);
            }

            const requestBody = { ...formData, cover: coverFilename }

            const token = localStorage.getItem('token')
            const response = await fetch(`http://localhost:5000/api/books`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                navigate(`/admin/books`); // Arahkan ke halaman ForumDetailPage berdasarkan ID
            } else {
                alert('Gagal membuat buku:', response.statusText);
            }
        } catch (error) {

        }
        setSubmitting(false)
    }

    return (
        <div className="py-10 px-4 md:px-10 lg:px-20">
            <div className="p-4 border rounded-xl">
                <form onSubmit={handleSubmit}>
                    <h2 className="text-xl font-bold mb-4">Judul</h2>
                    <Input
                        className="mb-4"
                        required
                        value={formData.title}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, title: e.target.value }))
                        }
                        placeholder="Judul"
                    />

                    <h2 className="text-xl font-bold mb-4">Cover</h2>
                    <Input
                        type="file"
                        required
                        className="mb-4"
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                cover: e.target.files[0],
                            }))
                        }
                    />

                    <h2 className="text-xl font-bold mb-4">Sinopsis</h2>
                    <textarea
                        placeholder="Tulis sinopsis..."
                        required
                        value={formData.synopsys}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, synopsys: e.target.value }))
                        }
                        className="w-full px-3 py-2 border rounded-md mb-4"
                        rows="4"
                    ></textarea>

                    <h2 className="text-xl font-bold mb-4">Informasi Tambahan</h2>

                    <div className="mb-4">
                        <label className="block font-bold mb-1">Penulis</label>
                        <Input
                            value={formData.information.author}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    information: { ...prev.information, author: e.target.value },
                                }))
                            }
                            placeholder="Penulis"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-bold mb-1">Penerbit</label>
                        <Input
                            value={formData.information.publisher}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    information: { ...prev.information, publisher: e.target.value },
                                }))
                            }
                            placeholder="Penerbit"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-bold mb-1">Tahun Publikasi</label>
                        <Input
                            type="number"
                            value={formData.information.publicationYear}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    information: {
                                        ...prev.information,
                                        publicationYear: Number(e.target.value),
                                    },
                                }))
                            }
                            placeholder="Tahun Publikasi"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-bold mb-1">Tema</label>
                        <Input
                            value={formData.information.theme.join(", ")}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    information: {
                                        ...prev.information,
                                        theme: e.target.value.split(",").map((item) => item.trim()),
                                    },
                                }))
                            }
                            placeholder="Tema (pisahkan dengan koma)"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-bold mb-1">Genre</label>
                        <Input
                            value={formData.information.genre.join(", ")}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    information: {
                                        ...prev.information,
                                        genre: e.target.value.split(",").map((item) => item.trim()),
                                    },
                                }))
                            }
                            placeholder="Genre (pisahkan dengan koma)"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-bold mb-1">Demografi</label>
                        <Input
                            value={formData.information.demographic}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    information: {
                                        ...prev.information,
                                        demographic: e.target.value,
                                    },
                                }))
                            }
                            placeholder="Demografi"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-bold mb-1">Jumlah Halaman</label>
                        <Input
                            type="number"
                            value={formData.information.pageCount}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    information: {
                                        ...prev.information,
                                        pageCount: Number(e.target.value),
                                    },
                                }))
                            }
                            placeholder="Jumlah Halaman"
                        />
                    </div>

                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        onClick={() => console.log(formData)}
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting . . . ' : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreateBookPage