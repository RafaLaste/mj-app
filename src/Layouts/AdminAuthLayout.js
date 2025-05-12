import { useState, useEffect } from "react";

function AdminAuthLayout({ children }) {
    const [loading, setLoading] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => setLoading(false), 300);
        }, 600);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="overflow-hidden px-4 sm:px-8 bg-tertiary">
            {loading ? (
                <div className={`fixed left-0 top-0 z-[999999] flex h-screen w-screen items-center justify-center bg-white transition-opacity duration-300 ${fadeOut ? "opacity-0" : "opacity-100"}`}>
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                </div>
            ) : (
                <div className="flex h-screen flex-col items-center justify-center overflow-hidden">
                    <div className="no-scrollbar overflow-y-auto w-full py-8 md:py-5 2xl:py-20">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminAuthLayout;