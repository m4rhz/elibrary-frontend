import { useEffect, useRef, useState } from "react"
// import { LogOut, UserPen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfilePopup = ({ isVisible }) => {
    const ref = useRef(null)
    const navigate = useNavigate()

    const [maxHeight, setMaxHeight] = useState(0);

    useEffect(() => {
        if (ref.current) {
            setMaxHeight(ref.current.scrollHeight);
        }
    }, []);

    const handleProfile = () => {
        navigate('/profile')
    }

    const handleReadlist = () => {
        navigate('/book/readlist')
    }

    const handleAdmin = () => {
        navigate('/admin/books')
    }

    return (
        <div
            ref={ref}
            style={{ maxHeight: isVisible ? maxHeight : 0 }}
            className={`fixed transition-all p-4 z-40 top-16 right-0 bg-white w-full md:w-[320px] rounded-md shadow-md border overflow-hidden ${isVisible ? 'visible' : 'invisible'}`}>

            {/* <div className="pb-2 rounded-b rounded text-center">
                    <h1 className="font-light text-sm">Welcome back,</h1>
                    <h1 className="font-medium">{user?.username}!</h1>
                </div> */}
            <div onClick={handleProfile} className="flex flex-row cursor-pointer gap-x-2 bg-white hover:bg-red-100 transition-colors rounded-md p-2">
                {/* <UserPen size={16} strokeWidth={1.5} /> */}
                Profile
            </div>
            <div onClick={handleReadlist} className="flex flex-row cursor-pointer gap-x-2 bg-white hover:bg-red-100 transition-colors rounded-md p-2">
                {/* <LogOut size={16} strokeWidth={1.5} /> */}
                Daftar Bacaan
            </div>
            <div onClick={handleAdmin} className="flex flex-row cursor-pointer gap-x-2 bg-white hover:bg-red-100 transition-colors rounded-md p-2">
                {/* <LogOut size={16} strokeWidth={1.5} /> */}
                Manajemen Buku
            </div>
        </div>
    )
}

export default ProfilePopup