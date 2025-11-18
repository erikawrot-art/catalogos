
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { VehicleCard } from './components/VehicleCard';
import { VehicleModal } from './components/VehicleModal';
import { ExportButtons } from './components/ExportButtons';
import { BackupManager } from './components/BackupManager';
import { vehicleData as initialVehicleData } from './data/vehicles';
import { Item, Category } from './types';

const App: React.FC = () => {
    // Initialize state with a SMART MERGE STRATEGY
    const [items, setItems] = useState<Item[]>(() => {
        try {
            const savedString = localStorage.getItem('vehicleData');
            if (savedString) {
                const savedData = JSON.parse(savedString) as Item[];
                
                // We iterate over the LATEST static data (initialVehicleData) which contains code updates.
                return initialVehicleData.map(staticItem => {
                    // We look for a matching item in localStorage
                    const savedItem = savedData.find(s => s.id === staticItem.id);
                    
                    if (savedItem) {
                        // CRITICAL LOGIC:
                        // 1. Take brand, model, equipment, etc. from staticItem (Code updates win for text)
                        // 2. Take images and technicalSheet from savedItem (User uploads win for media)
                        // 3. If savedItem has NO images (or just defaults), we fallback to staticItem.images
                        
                        // Check if the saved item has "real" data (Base64 usually implies user upload, or just different from default)
                        const hasCustomImages = savedItem.images && savedItem.images.length > 0;
                        
                        return {
                            ...staticItem, 
                            // Prioritize saved images if they exist, otherwise use the new static default
                            images: hasCustomImages ? savedItem.images : staticItem.images,
                            technicalSheet: savedItem.technicalSheet
                        };
                    }
                    // If no saved data for this ID, return static item
                    return staticItem;
                });
            }
            return initialVehicleData;
        } catch (e) {
            console.error("Failed to load from local storage", e);
            return initialVehicleData;
        }
    });

    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [activeCategory, setActiveCategory] = useState<Category>('Vehiculos');
    
    // Filter states
    const [brandFilter, setBrandFilter] = useState<string>('');
    const [typeFilter, setTypeFilter] = useState<string>('');

    // Save to localStorage whenever items change
    useEffect(() => {
        try {
            localStorage.setItem('vehicleData', JSON.stringify(items));
        } catch (e) {
            console.error("Failed to save to local storage", e);
        }
    }, [items]);

    // Reset filters when category changes
    useEffect(() => {
        setBrandFilter('');
        setTypeFilter('');
    }, [activeCategory]);

    const handleOpenModal = useCallback((item: Item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedItem(null);
    }, []);

    const handleImageUpdate = useCallback((itemId: number, newImageUrl: string) => {
        setItems(prevItems => prevItems.map(item => {
            if (item.id === itemId) {
                // Replace the first image with the new one, keep others if any
                const newImages = [newImageUrl, ...item.images.slice(1)];
                return { ...item, images: newImages };
            }
            return item;
        }));

        // Update selected item if it's the one being modified
        setSelectedItem(prev => {
            if (prev && prev.id === itemId) {
                 const newImages = [newImageUrl, ...prev.images.slice(1)];
                 return { ...prev, images: newImages };
            }
            return prev;
        });
    }, []);

    const handleTechnicalSheetUpdate = useCallback((itemId: number, fileBase64: string) => {
        setItems(prevItems => prevItems.map(item => {
            if (item.id === itemId) {
                return { ...item, technicalSheet: fileBase64 };
            }
            return item;
        }));

        setSelectedItem(prev => {
            if (prev && prev.id === itemId) {
                 return { ...prev, technicalSheet: fileBase64 };
            }
            return prev;
        });
    }, []);

    const handleRestoreData = useCallback((restoredItems: Item[]) => {
        // When restoring from backup, we trust the backup file completely
        setItems(restoredItems);
        // Also save immediately to local storage
        localStorage.setItem('vehicleData', JSON.stringify(restoredItems));
    }, []);

    // Derived data
    const categoryData = useMemo(() => {
        return items.filter(item => item.category === activeCategory);
    }, [activeCategory, items]);

    const availableBrands = useMemo(() => {
        return Array.from(new Set(categoryData.map(item => item.brand))).sort();
    }, [categoryData]);

    const availableTypes = useMemo(() => {
        const types = categoryData.map(item => item.type);
        return Array.from(new Set(types)).sort();
    }, [categoryData]);

    const filteredData = useMemo(() => {
        return categoryData.filter(item => {
            const matchesBrand = brandFilter ? item.brand === brandFilter : true;
            const matchesType = typeFilter ? item.type === typeFilter : true;
            return matchesBrand && matchesType;
        });
    }, [categoryData, brandFilter, typeFilter]);

    return (
        <div className="min-h-screen bg-[#FFF8F0] text-gray-800 font-light font-sans flex flex-col">
            <Header />

            <main className="container mx-auto px-4 py-8 md:py-12 flex-grow">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-medium text-[#D5232A] mb-3 tracking-tight">Nuestro Catálogo</h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto font-light">
                        Explora nuestra flota de vehículos y maquinaria, listos para tu proyecto.
                    </p>
                </div>

                {/* Category Toggle */}
                <div className="flex justify-center items-center mb-6">
                    <div className="bg-white/60 backdrop-blur-sm p-1.5 rounded-full shadow-sm inline-flex">
                        <button
                            onClick={() => setActiveCategory('Vehiculos')}
                            className={`px-8 py-2 rounded-full transition-all duration-300 text-sm tracking-wide ${activeCategory === 'Vehiculos' ? 'bg-[#D5232A] text-white shadow-md font-medium' : 'text-gray-500 hover:bg-red-50 font-light'}`}
                        >
                            Vehículos
                        </button>
                        <button
                            onClick={() => setActiveCategory('Maquinarias')}
                            className={`px-8 py-2 rounded-full transition-all duration-300 text-sm tracking-wide ${activeCategory === 'Maquinarias' ? 'bg-[#D5232A] text-white shadow-md font-medium' : 'text-gray-500 hover:bg-red-50 font-light'}`}
                        >
                            Maquinaria
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10 max-w-3xl mx-auto">
                    <div className="relative w-full sm:w-64">
                        <select 
                            value={brandFilter}
                            onChange={(e) => setBrandFilter(e.target.value)}
                            className="w-full appearance-none bg-white border border-gray-200 text-gray-600 py-2.5 px-4 pr-8 rounded-lg focus:outline-none focus:border-[#D5232A] focus:ring-1 focus:ring-[#D5232A] transition-colors cursor-pointer font-light"
                        >
                            <option value="">Todas las Marcas</option>
                            {availableBrands.map(brand => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>

                    <div className="relative w-full sm:w-64">
                        <select 
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="w-full appearance-none bg-white border border-gray-200 text-gray-600 py-2.5 px-4 pr-8 rounded-lg focus:outline-none focus:border-[#D5232A] focus:ring-1 focus:ring-[#D5232A] transition-colors cursor-pointer font-light"
                        >
                            <option value="">Todos los Tipos</option>
                            {availableTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>
                
                <ExportButtons data={items} />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {filteredData.length > 0 ? (
                        filteredData.map((item) => (
                            <VehicleCard key={item.id} item={item} onOpenModal={handleOpenModal} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-gray-400 font-light">
                            No se encontraron resultados con los filtros seleccionados.
                        </div>
                    )}
                </div>
            </main>
            
            <BackupManager items={items} onRestore={handleRestoreData} />
            <Footer />

            {isModalOpen && selectedItem && (
                <VehicleModal 
                    item={selectedItem} 
                    onClose={handleCloseModal} 
                    onImageUpdate={handleImageUpdate}
                    onTechnicalSheetUpdate={handleTechnicalSheetUpdate}
                />
            )}
        </div>
    );
};

export default App;
