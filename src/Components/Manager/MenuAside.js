import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Link } from 'react-router-dom';
import { useToken } from '../TokenContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn, faWineBottle, faQuestionCircle, faClipboardList, faUser, faChartPie } from '@fortawesome/free-solid-svg-icons';
import { faIdBadge } from '@fortawesome/free-regular-svg-icons';

import MenuItem from './MenuItem';


function MenuAside({ isMenuOpen }) {
    const location = useLocation().pathname;
    const { tokenData } = useToken();

    const [openMenuIndex, setopenMenuIndex] = useState(null);

    const toggleMenu = (index) => {
        setopenMenuIndex(openMenuIndex === index ? null : index);
    };

    const menus = [
        {
            label: 'Promoção',
            icon: faBullhorn,
            locations: [
                /^\/promocao\/manager\/?$/,
            ],
            href: '/promocao/manager',
        },
        {
            label: 'Produtos',
            icon: faWineBottle,
            locations: [
                /^\/promocao\/manager\/produtos\/?$/,
                /^\/promocao\/manager\/produtos\/adicionar\/?$/,
                /^\/promocao\/manager\/produtos\/editar\/.*/
            ],
            href: '/promocao/manager/produtos'
        },
        {
            label: 'Dúvidas',
            icon: faQuestionCircle,
            href: '/promocao/manager/duvidas',
            locations: [
                /^\/promocao\/manager\/duvidas\/?$/,
                /^\/promocao\/manager\/duvidas\/adicionar\/?$/,
                /^\/promocao\/manager\/duvidas\/editar\/.*/
            ]
        },
        {
            label: 'Regulamento',
            icon: faClipboardList,
            href: '/promocao/manager/regulamento',
            locations: [
                /^\/promocao\/manager\/regulamento\/?$/,
            ]
        },
        {
            label: 'Participantes',
            icon: faUser,
            href: '/promocao/manager/participantes',
            locations: [
                /^\/promocao\/manager\/participantes\/?$/,
                /^\/promocao\/manager\/participantes\/visualizar\/.*/
            ]
        },
        {
            label: 'Relatórios',
            icon: faChartPie,
            locations: [
                /^\/promocao\/manager\/relatorios\/?$/,
            ],
            href: '/promocao/manager/relatorios',
        }
    ];

    return (
        <aside className={`fixed left-0 top-20 lg:top-0 max-lg:bottom-0 z-9999 flex h-screen w-50 md:w-64 xl:w-72 flex-col overflow-y-auto bg-tertiary duration-300 ease-linear lg:static z-[10] lg:translate-x-0 -translate-x-full${isMenuOpen ? ' translate-x-0' : ''}`}>
            <div className="hidden lg:flex items-center justify-between gap-2 px-6 py-5 lg:py-6">
                <Link to="/promocao/manager">
                    <img src={`/promocao/assets/img/admin/logo.png`} className="w-3/6" alt="Logo" />
                </Link>
            </div>

            <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
                <nav className="mt-2 px-4 py-4 lg:mt-5 lg:px-6">
                    <div>
                        <h3 className="mb-4 ml-4 text-sm font-medium text-white">MENU</h3>

                        <ul className="mb-6 flex flex-col gap-1.5">
                            {menus.map((menu, index) => (
                                <MenuItem
                                    key={index}
                                    index={index}
                                    label={menu.label}
                                    icon={menu.icon}
                                    subMenu={menu.subMenu}
                                    isOpen={openMenuIndex === index}
                                    onToggle={toggleMenu}
                                    location={location}
                                    locations={menu.locations}
                                    to={menu.href}
                                />
                            ))}
                        </ul>
                    </div>
                </nav>
            </div>
        </aside>
    );
}

export default MenuAside;