import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

function MenuItem({ index, label, icon, subMenu, isOpen, onToggle, location, locations, to }) {
    const submenuRef = useRef(null);

    const { pathname } = useLocation();

    useEffect(() => {
        if (subMenu?.some(subItem => pathname.startsWith(subItem.href))) {
            onToggle(index);
        }
    }, []);

    if (subMenu) {
        return (
            <li>
                <button
                    className={`group w-full relative flex items-center gap-2 rounded-sm px-4 py-2 font-medium text-white duration-300 ease-in-out hover:bg-white hover:bg-opacity-10 ${locations.some(loc => 
                        typeof loc === 'string' ? loc === location : loc.test(location)
                    ) && ' bg-white bg-opacity-5'}`}
                    onClick={() => onToggle(index)}
                >
                    <FontAwesomeIcon icon={icon} className="w-5 text-secondary text-xl text-center" />
                    {label}
                    <FontAwesomeIcon icon={faChevronDown} className="absolute right-4 top-1/2 -translate-y-1/2 text-md" />
                </button>

                <div
                    ref={submenuRef}
                    className="transition-all duration-300 ease-in-out overflow-hidden"
                    style={{
                        maxHeight: isOpen ? `${submenuRef.current?.scrollHeight}px` : '0px',
                    }}
                >
                    <ul className="mb-5 mt-3 flex flex-col gap-1 pl-6">
                        {subMenu.map((subItem, index) => (
                            <li key={index}>
                                <Link className={`group relative block py-1 px-4 font-medium text-white text-opacity-75 duration-200 ease-in-out hover:text-opacity-100 ${pathname.startsWith(subItem.href) ? ' bg-white bg-opacity-5' : ''}`} to={subItem.href}>
                                    {subItem.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </li>
        );
    } else {
        return (
            <li>
                <Link
                    className={`group relative flex items-center gap-2 rounded-sm px-4 py-2 font-medium text-white duration-300 ease-in-out hover:bg-white hover:bg-opacity-10 ${locations.some(loc => 
                        typeof loc === 'string' ? loc === location : loc.test(location)
                    ) && ' bg-white bg-opacity-5'}`}
                    to={to}
                >
                    <FontAwesomeIcon icon={icon} className="w-5 text-secondary text-xl text-center" />
                    {label}
                </Link>
            </li>
        );
    }
}

export default MenuItem;