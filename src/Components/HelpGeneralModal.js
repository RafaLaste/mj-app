import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const HelpGeneralModal = ({ setShowHelpGeneralModal, imageSrc, imageText }) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setShowHelpGeneralModal(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setShowHelpGeneralModal]);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[100]">
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={() => setShowHelpGeneralModal(false)}
            ></div>

            <div className="bg-white rounded-xl max-w-3xl w-5/6 relative animate-fade-in-down overflow-hidden">
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
                    onClick={() => setShowHelpGeneralModal(false)}
                >
                    <FontAwesomeIcon icon={faTimes} className="text-xl" />
                </button>

                <div className="p-4 pt-10 sm:p-6 text-center border-b">
                    <h2 className="text-xl font-bold text-tertiary">
                        CUPOM FISCAL | DANFE | NFC-e | SAT
                    </h2>
                    <p className="text-gray-600 !text-sm sm:!text-base mt-2">
                        Confira onde estão localizadas as informações.
                    </p>
                </div>

                <div className="relative px-8 sm:px-16 py-6 text-center">
                    <Zoom>
                        <img
                            src={imageSrc}
                            alt={imageText}
                            className="block max-h-[55vh] sm:max-h-[60vh] mx-auto object-contain mb-4"
                        />
                    </Zoom>
                    <p className="!text-sm text-gray-600 px-4">{imageText}</p>
                </div>
            </div>
        </div>
    );
};

export default HelpGeneralModal;
