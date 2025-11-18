
import React from 'react';

export const Header: React.FC = () => {
    const scrollToFooter = () => {
        document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <div className="text-3xl font-bold text-[#D5232A] tracking-wider">
                        <span className="text-4xl">A</span>ZILUT
                    </div>
                </div>
                <button
                    onClick={scrollToFooter}
                    className="bg-[#D5232A] text-white font-medium py-2 px-5 rounded-full hover:bg-red-700 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    Contactar
                </button>
            </div>
        </header>
    );
};
