import React, { useRef } from 'react';
import { Item } from '../types';
import { generatePortableHtml } from '../services/publishService';

interface BackupManagerProps {
    items: Item[];
    onRestore: (items: Item[]) => void;
}

export const BackupManager: React.FC<BackupManagerProps> = ({ items, onRestore }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDownloadBackup = () => {
        const dataStr = JSON.stringify(items, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `respaldo_flota_${new Date().toISOString().split('T')[0]}.json`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = event.target?.result as string;
                const parsedItems = JSON.parse(json) as Item[];
                
                if (Array.isArray(parsedItems) && parsedItems.length > 0 && parsedItems[0].id) {
                    if(window.confirm(`Se van a restaurar ${parsedItems.length} ítems. Esto sobreescribirá los datos actuales. ¿Continuar?`)) {
                        onRestore(parsedItems);
                        alert("Datos restaurados correctamente.");
                    }
                } else {
                    alert("El archivo no tiene un formato válido.");
                }
            } catch (error) {
                console.error("Error parsing backup file:", error);
                alert("Error al leer el archivo de respaldo.");
            }
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        };
        reader.readAsText(file);
    };

    const handleDownloadPortable = () => {
        const htmlContent = generatePortableHtml(items);
        const blob = new Blob([htmlContent], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = "catalogo_azilut.html";
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-stone-200 py-6 px-4 border-t border-stone-300 mt-auto">
            <div className="container mx-auto flex flex-col xl:flex-row justify-between items-center gap-4">
                <div className="text-stone-600 text-xs md:text-sm max-w-2xl">
                    <strong className="text-[#D5232A]">Panel de Control:</strong> Utilice "Copia de Seguridad" para guardar su trabajo mientras edita. Utilice "Descargar App Portátil" cuando quiera el archivo final para enviar a clientes.
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                    <button 
                        onClick={handleDownloadBackup}
                        className="bg-stone-600 hover:bg-stone-700 text-white text-xs font-medium py-2 px-4 rounded shadow flex items-center gap-2 transition-colors"
                        title="Guarda un archivo para restaurar después si se borra algo"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                        Copia de Seguridad (.json)
                    </button>
                    
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-stone-600 hover:bg-stone-700 text-white text-xs font-medium py-2 px-4 rounded shadow flex items-center gap-2 transition-colors"
                        title="Carga un archivo de respaldo anterior"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Restaurar
                    </button>

                    <div className="w-px h-8 bg-stone-400 mx-2 hidden md:block"></div>

                    <button 
                        onClick={handleDownloadPortable}
                        className="bg-[#D5232A] hover:bg-red-700 text-white text-xs font-bold py-2 px-5 rounded shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
                        title="Genera un archivo HTML único listo para enviar a clientes"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        📦 Descargar App Portátil (.html)
                    </button>

                    <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleRestoreBackup} />
                </div>
            </div>
        </div>
    );
};