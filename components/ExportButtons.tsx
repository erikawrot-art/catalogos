
import React from 'react';
import { Item } from '../types';
import { exportListToExcel } from '../services/exportService';

interface ExportButtonsProps {
    data: Item[];
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ data }) => {
    return (
        <div className="flex justify-center items-center space-x-4 mb-12">
            <button
                onClick={() => exportListToExcel(data)}
                className="flex items-center space-x-2 bg-white text-gray-700 font-medium py-2 px-4 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors duration-300 shadow-sm"
            >
                <DownloadIcon />
                <span>Exportar Listado (Excel)</span>
            </button>
        </div>
    );
};

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);
