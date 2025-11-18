
import React, { useState, useRef } from 'react';
import { Item } from '../types';
import { exportItemToPdf } from '../services/exportService';

interface VehicleModalProps {
    item: Item;
    onClose: () => void;
    onImageUpdate: (itemId: number, newImageUrl: string) => void;
    onTechnicalSheetUpdate?: (itemId: number, fileBase64: string) => void;
}

export const VehicleModal: React.FC<VehicleModalProps> = ({ item, onClose, onImageUpdate, onTechnicalSheetUpdate }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const techSheetInputRef = useRef<HTMLInputElement>(null);

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % item.images.length);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + item.images.length) % item.images.length);
    };

    const handlePhotoUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleTechSheetUploadClick = () => {
        techSheetInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                onImageUpdate(item.id, base64String);
                setCurrentImageIndex(0);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTechSheetFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onTechnicalSheetUpdate) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                onTechnicalSheetUpdate(item.id, base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const openTechnicalSheet = () => {
        if (item.technicalSheet) {
            // Open Base64 PDF/Image in new tab
            const win = window.open();
            if (win) {
                win.document.write(
                    `<iframe src="${item.technicalSheet}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
                );
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-stone-900/70 z-50 flex justify-center items-center p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row" onClick={(e) => e.stopPropagation()}>
                {/* Image Gallery */}
                <div className="w-full md:w-3/5 relative bg-gray-100 flex flex-col items-center justify-center h-64 md:h-auto p-4 group">
                    <img 
                        src={item.images[currentImageIndex]} 
                        alt={`${item.brand} ${item.model}`} 
                        className="w-full h-full object-contain max-h-[70vh]" 
                    />
                    
                    {/* Change Photo Button - RESTORED */}
                    <button 
                        onClick={handlePhotoUploadClick}
                        className="absolute top-4 right-4 bg-white/90 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm hover:bg-[#D5232A] hover:text-white transition-all duration-200 flex items-center gap-2 z-10 border border-gray-200"
                        title="Subir foto real del vehículo"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Cambiar Foto
                    </button>
                    
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileChange}
                    />

                    {item.images.length > 1 && (
                        <>
                            <button onClick={handlePrevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full hover:bg-white hover:text-[#D5232A] transition-all shadow-md">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button onClick={handleNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full hover:bg-white hover:text-[#D5232A] transition-all shadow-md">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/40 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                        {currentImageIndex + 1} / {item.images.length}
                    </div>
                </div>

                {/* Details */}
                <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col overflow-y-auto bg-white">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-medium text-[#D5232A] mb-1 leading-tight">{item.brand} {item.model}</h2>
                            <p className="text-gray-500 font-light text-lg">{item.type}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-[#D5232A] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="space-y-4 text-sm flex-grow text-gray-600 font-light">
                        <DetailRow label="Categoría" value={item.category} />
                        <DetailRow label="Año" value={item.year.toString()} />
                        <DetailRow label="Dominio" value={item.domain} />
                        <DetailRow label="Combustible" value={item.fuel} />
                        
                        {/* Only show Capacity if it exists and is not empty */}
                        {item.capacity && item.capacity.trim() !== '' && (
                            <DetailRow label="Capacidad" value={item.capacity} />
                        )}
                        
                        {item.equipment !== 'N/A' && <DetailRow label="Equipamiento" value={item.equipment} />}
                        <DetailRow label="Rastreo Satelital" value={item.rastreoSatelital} />
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3">
                        
                        {/* Technical Information Button */}
                        {item.technicalSheet && (
                            <button 
                                onClick={openTechnicalSheet}
                                className="w-full bg-orange-500 text-white font-medium py-3 px-5 rounded-full hover:bg-orange-600 transition-all duration-300 shadow-md flex items-center justify-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>📄 Ver Información Técnica</span>
                            </button>
                        )}

                        {/* Upload Technical Sheet (Hidden input + Small text button) */}
                        <input 
                            type="file" 
                            ref={techSheetInputRef} 
                            className="hidden" 
                            accept="application/pdf,image/*" 
                            onChange={handleTechSheetFileChange}
                        />
                        
                        {/* Management Links */}
                        <div className="flex justify-center gap-4 py-1">
                             <button 
                                onClick={handleTechSheetUploadClick}
                                className="text-xs text-gray-400 hover:text-[#D5232A] underline transition-colors text-center"
                            >
                                {item.technicalSheet ? 'Actualizar Ficha Técnica' : 'Cargar Ficha Técnica'}
                            </button>
                        </div>

                        <button 
                            onClick={() => exportItemToPdf(item)}
                            className="w-full bg-[#D5232A] text-white font-medium py-3 px-5 rounded-full hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 group">
                            <DownloadIcon />
                            <span className="group-hover:translate-x-1 transition-transform">Descargar Ficha (PDF)</span>
                        </button>
                        
                        <button 
                            onClick={onClose}
                            className="w-full bg-transparent border border-gray-300 text-gray-600 font-medium py-3 px-5 rounded-full hover:bg-gray-50 hover:text-gray-800 transition-all duration-300 flex items-center justify-center">
                            <span>Volver al Listado</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex justify-between items-baseline border-b border-gray-50 py-2.5">
        <span className="font-medium text-gray-500 text-xs uppercase tracking-wide shrink-0 mr-4">{label}</span>
        <span className="text-gray-800 text-right font-normal whitespace-pre-line">{value}</span>
    </div>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);
