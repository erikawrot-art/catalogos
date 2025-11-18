
import React from 'react';
import { Item } from '../types';

interface VehicleCardProps {
    item: Item;
    onOpenModal: (item: Item) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ item, onOpenModal }) => {
    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden transform hover:-translate-y-1 transition-all duration-300 group flex flex-col border border-gray-100">
            <div className="relative h-48 overflow-hidden bg-gray-50">
                <img 
                    src={item.images[0]} 
                    alt={`${item.brand} ${item.model}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-[#D5232A] text-xs font-medium px-2.5 py-1 rounded-md shadow-sm border border-gray-100">
                    {item.year}
                </div>
            </div>
            <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-lg font-medium text-gray-800 truncate mb-1">{item.brand} {item.model}</h3>
                <p className="text-sm text-gray-500 mb-5 font-light truncate">{item.type}</p>
                <div className="mt-auto">
                     <button
                        onClick={() => onOpenModal(item)}
                        className="w-full bg-transparent border border-[#D5232A] text-[#D5232A] font-medium text-sm py-2.5 px-4 rounded-full group-hover:bg-[#D5232A] group-hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#D5232A]"
                    >
                        Ver Ficha
                    </button>
                </div>
            </div>
        </div>
    );
};
