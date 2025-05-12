import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const HelpNumbersModal = ({ setShowHelpNumbersModal }) => {
    const swiperRef = useRef(null);
    const prevButtonRef = useRef(null);
    const nextButtonRef = useRef(null);

    const receiptImages = [
        {
            src: 'https://promocao-media.marcusjames.com.br/uploads/examples/cupom-exemplo-1.png',
            text: 'Confira o número do cupom fiscal destacado em vermelho.'
        },
        {
            src: 'https://promocao-media.marcusjames.com.br/uploads/examples/cupom-exemplo-2.png',
            text: 'Confira o número do cupom fiscal destacado em vermelho.'
        },
        {
            src: 'https://promocao-media.marcusjames.com.br/uploads/examples/cupom-exemplo-3.png',
            text: 'Confira o número do cupom fiscal destacado em vermelho.'
        },
        {
            src: 'https://promocao-media.marcusjames.com.br/uploads/examples/cupom-exemplo-4.png',
            text: 'Confira o número do cupom fiscal destacado em vermelho.'
        }
    ];

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setShowHelpNumbersModal(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [setShowHelpNumbersModal]);

    useEffect(() => {
        if (swiperRef.current && prevButtonRef.current && nextButtonRef.current) {
            swiperRef.current.params.navigation.prevEl = prevButtonRef.current;
            swiperRef.current.params.navigation.nextEl = nextButtonRef.current;
            swiperRef.current.navigation.init();
            swiperRef.current.navigation.update();
        }
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[100]">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowHelpNumbersModal(false)}></div>
            <div className="bg-white rounded-xl max-w-3xl w-5/6 relative animate-fade-in-down overflow-hidden">
                <button 
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
                    onClick={() => setShowHelpNumbersModal(false)}
                >
                    <FontAwesomeIcon icon={faTimes} className="text-xl" />
                </button>
                
                <div className="p-4 pt-10 sm:p-6 text-center border-b">
                    <h2 className="text-lg sm:text-xl font-bold text-tertiary">
                        CUPOM FISCAL | DANFE | NFC-e | SAT
                    </h2>
                    <p className="text-gray-600 !text-sm sm:!text-base mt-2">
                        Confira onde está localizado o número do seu cupom fiscal.
                    </p>
                </div>
                
                <div className="relative px-8 sm:px-16 py-6">
                    <Swiper
                        pagination={{ clickable: true }}
                        modules={[Pagination, Navigation]}
                        loop
                        navigation={{
                            prevEl: prevButtonRef.current,
                            nextEl: nextButtonRef.current,
                        }}
                        onBeforeInit={(swiper) => {
                            swiperRef.current = swiper;
                            swiper.params.navigation.prevEl = prevButtonRef.current;
                            swiper.params.navigation.nextEl = nextButtonRef.current;
                        }}
                        className="product_carousel !pb-8 overflow-y-visible [&_.swiper-pagination]:flex [&_.swiper-pagination]:justify-center [&_.swiper-pagination]:gap-0 [&_.swiper-pagination-bullet]:w-10 [&_.swiper-pagination-bullet]:rounded-none [&_.swiper-pagination-bullet]:!h-1 [&_.swiper-pagination-bullet.swiper-pagination-bullet-active]:!bg-secondary"
                    >
                        {receiptImages.map((image, index) => (
                            <SwiperSlide key={index}>
                                <div className="flex flex-col items-center">
                                    <Zoom>
                                        <img 
                                            src={image.src} 
                                            alt={image.text} 
                                            className="block max-h-[55vh] sm:max-h-[60vh] object-contain mb-2"
                                        />
                                    </Zoom>
                                    <p className="!text-sm text-gray-600 text-center px-4">
                                        {image.text}
                                    </p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    
                    <button
                        ref={prevButtonRef}
                        className="absolute top-1/2 -translate-y-1/2 -mt-4 left-10 opacity-50 transition-all hover:opacity-80"
                    >
                        <FontAwesomeIcon icon={faChevronLeft} className="text-neutral-600 text-2xl" />
                    </button>

                    <button
                        ref={nextButtonRef}
                        className="absolute top-1/2 -translate-y-1/2 -mt-4 right-10 opacity-50 transition-all hover:opacity-80"
                    >
                        <FontAwesomeIcon icon={faChevronRight} className="text-neutral-600 text-2xl" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelpNumbersModal;