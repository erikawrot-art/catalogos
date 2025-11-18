
import React from 'react';

const ContactInfoItem: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
    <div className="flex items-center space-x-3 text-stone-300 font-light text-sm">
        <span className="text-[#D5232A] opacity-80">{icon}</span>
        <span>{text}</span>
    </div>
);

export const Footer: React.FC = () => {
    return (
        <footer id="footer" className="bg-[#4A4A4A] text-white py-12 font-light">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                <div className="flex flex-col items-center md:items-start">
                    <h3 className="text-2xl font-medium text-[#D5232A] tracking-wider mb-4">
                        <span className="text-3xl">A</span>ZILUT
                    </h3>
                    <p className="text-stone-400 max-w-xs">
                        División alquileres
                    </p>
                </div>
                <div className="md:col-span-2">
                    <h3 className="font-medium text-lg mb-6 text-white/90 border-b border-stone-600 pb-2 inline-block">Información de Contacto</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                        <ContactInfoItem
                            icon={<MailIcon />}
                            text="administracion@azilutsa.com.ar"
                        />
                        <ContactInfoItem
                            icon={<PhoneIcon />}
                            text="221 483-0093 / 483-5670"
                        />
                         <ContactInfoItem
                            icon={<PhoneIcon />}
                            text="221 4312522"
                        />
                        <ContactInfoItem
                            icon={<GlobeIcon />}
                            text="www.azilut.com.ar"
                        />
                        <ContactInfoItem
                            icon={<LocationIcon />}
                            text="115 Bis Nº333 / Tolosa / La Plata"
                        />
                    </div>
                </div>
            </div>
            <div className="text-center text-stone-500 mt-12 border-t border-stone-700 pt-6 text-xs">
                &copy; {new Date().getFullYear()} Azilut S.A. Todos los derechos reservados.
            </div>
        </footer>
    );
};


const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);

const GlobeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9m-9 9a9 9 0 00-9-9" />
    </svg>
);

const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
