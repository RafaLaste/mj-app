import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import MenuAside from '../Components//Manager/MenuAside';
import HeaderUser from '../Components/Manager/HeaderUser';
import HeaderNotifications from '../Components/Manager/HeaderNotifications';
import { NotificationMessage } from '../Components/NotificationMessage';

function AdminLayout({ children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (location.state?.message) {
            setNotification(location.state.message);

            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    return (
        <>
            <div className="flex h-screen overflow-hidden">
                <MenuAside isMenuOpen={isMenuOpen} />
                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    <header className="sticky top-0 z-50 flex w-full bg-tertiary lg:bg-white drop-shadow-md">
                        <div className="flex flex-grow items-center justify-between px-4 py-3 2xl:py-4 shadow-2 md:px-6 2xl:px-11">
                            <div className="flex items-center gap-4 sm:gap-6 lg:hidden">
                                <button className="transform lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                    <div className="flex items-center">
                                        <div className="relative w-5 h-[14px]">
                                            <div
                                                className={`absolute top-0 bg-secondary h-0.5 w-5 transition-all duration-300 ${isMenuOpen ? 'rotate-45 !top-[6px]' : ''}`}
                                                style={{
                                                    transitionDelay: isMenuOpen ? '0ms, 400ms' : '0ms',
                                                    transitionProperty: 'top, transform'
                                                }}
                                            ></div>
                                            <div
                                                className={`absolute top-[6px] bg-secondary h-0.5 w-5 transition-all duration-300 ${isMenuOpen ? 'scale-x-0 !top-[6px]' : ''}`}
                                                style={{
                                                    transitionDelay: isMenuOpen ? '0ms, 400ms' : '0ms',
                                                    transitionProperty: 'top, transform'
                                                }}
                                            ></div>
                                            <div
                                                className={`absolute bottom-0 bg-secondary h-0.5 w-5 transition-all duration-300 ${isMenuOpen ? '-rotate-45 bottom-[6px]' : ''}`}
                                                style={{
                                                    transitionDelay: isMenuOpen ? '0ms, 400ms' : '0ms',
                                                    transitionProperty: 'bottom, transform'
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </button>


                                <Link to="/promocao/manager" className="block flex-shrink-0 lg:hidden" href="index.html">
                                    <img src={`/promocao/assets/img/admin/logo.png`} className="w-24" alt="Logo" />
                                </Link>
                            </div>

                            <div className="flex items-center ml-auto gap-3 2xsm:gap-7">
                                {/*<HeaderNotifications />*/}
                                <HeaderUser />
                            </div>
                        </div>
                    </header>
                    <div className="App">
                        {children}
                    </div>
                </div>
            </div>
            
            {notification && (
                <NotificationMessage
                    type={notification.type}
                    message={notification.text}
                    show={true}
                    onClose={() => setNotification(null)}
                />
            )}
        </>
    );
}

export default AdminLayout;