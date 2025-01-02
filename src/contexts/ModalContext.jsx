import { createContext, useState } from "react"

export const ModalContext = createContext()

export const ModalProvider = ({ children }) => {
    const [modal, setModal] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const showModal = (modalContent) => {
        setModal(modalContent);
        setIsVisible(true); // Start rendering modal
        setTimeout(() => {
            setIsAnimating(true); // Trigger "show" animation
        }, 10); // Small delay to ensure modal is rendered before animation starts
    };

    const hideModal = () => {
        setIsAnimating(false); // Trigger "hide" animation
        setTimeout(() => {
            setIsVisible(false); // Stop rendering modal
            setModal(null); // Clear modal content
        }, 500); // Matches CSS transition duration
    };

    return (
        <ModalContext.Provider value={{ showModal, hideModal, modal }}>
            {children}
            {modal && (
                <div
                    className={`${isAnimating  ? 'visible opacity-100' : 'opacity-0 invisible pointer-events-none'
                        } flex justify-center items-center transition-all duration-500 z-50 fixed inset-0 h-screen w-screen`}
                >
                    <div
                        className={`absolute inset-0 bg-black duration-500 transition-all ${isAnimating  ? 'opacity-40' : 'opacity-0'
                            }`}
                        onClick={hideModal}
                    ></div>
                    <div
                        className={`absolute flex justify-center duration-500 items-center transition-transform ${isAnimating  ? 'translate-y-0' : 'translate-y-full'
                            }`}
                    >
                        {modal}
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
};