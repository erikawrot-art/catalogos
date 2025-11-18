
import { Item } from '../types';

export const generatePortableHtml = (items: Item[]) => {
    // Serialize data safely
    const dataScript = `window.CATALOG_DATA = ${JSON.stringify(items)};`;

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Azilut - Catálogo de Flota</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Poppins', sans-serif; background-color: #FFF8F0; margin: 0; padding: 0; }
        .hidden { display: none !important; }
        
        /* Fallback CSS in case Tailwind doesn't load */
        .container { max-width: 1200px; margin: 0 auto; padding: 1rem; }
        .grid { display: grid; gap: 2rem; }
        @media(min-width: 640px) { .grid { grid-template-columns: repeat(2, 1fr); } }
        @media(min-width: 1024px) { .grid { grid-template-columns: repeat(3, 1fr); } }
        @media(min-width: 1280px) { .grid { grid-template-columns: repeat(4, 1fr); } }
        
        .card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: flex; flex-direction: column; border: 1px solid #eee; }
        .card-img { height: 200px; width: 100%; object-fit: cover; background: #f9fafb; }
        .card-body { padding: 1.25rem; display: flex; flex-direction: column; flex-grow: 1; }
        .btn-primary { background-color: #D5232A; color: white; border: none; padding: 0.5rem 1.5rem; border-radius: 9999px; cursor: pointer; font-weight: 500; text-decoration: none; display: inline-block; }
        .btn-primary:hover { background-color: #b91c1c; }
        .btn-outline { background-color: transparent; color: #D5232A; border: 1px solid #D5232A; padding: 0.5rem 1rem; border-radius: 9999px; cursor: pointer; width: 100%; text-align: center; margin-top: auto; }
        .btn-outline:hover { background-color: #D5232A; color: white; }

        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #D5232A; border-radius: 4px; }
    </style>
</head>
<body class="text-gray-800 font-light bg-[#FFF8F0]">

    <!-- Header -->
    <header class="bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div class="container mx-auto px-4 py-3 flex justify-between items-center">
            <div class="text-3xl font-bold text-[#D5232A] tracking-wider select-none">
                <span class="text-4xl">A</span>ZILUT
            </div>
            <a href="mailto:administracion@azilutsa.com.ar" class="bg-[#D5232A] text-white font-medium py-2 px-5 rounded-full hover:bg-red-700 transition shadow-md no-underline">
                Contactar
            </a>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-10 min-h-screen">
        <div class="text-center mb-10">
            <h1 class="text-4xl md:text-5xl font-medium text-[#D5232A] mb-3">Nuestro Catálogo</h1>
            <p class="text-lg text-gray-500 max-w-2xl mx-auto">División Alquileres</p>
        </div>

        <!-- Filters -->
        <div class="flex justify-center mb-8">
            <div class="bg-white/60 p-1.5 rounded-full shadow-sm inline-flex gap-2">
                <button onclick="filterData('Vehiculos')" id="btn-vehiculos" class="px-6 py-2 rounded-full transition-all text-sm bg-[#D5232A] text-white shadow-md font-medium border-0 cursor-pointer">Vehículos</button>
                <button onclick="filterData('Maquinarias')" id="btn-maquinarias" class="px-6 py-2 rounded-full transition-all text-sm text-gray-500 hover:bg-red-50 bg-transparent border-0 cursor-pointer">Maquinaria</button>
            </div>
        </div>

        <!-- Grid -->
        <div id="grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            <!-- JS Generated Content -->
            <div class="col-span-full text-center text-gray-400 py-10">Cargando catálogo...</div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="bg-[#4A4A4A] text-white py-12 mt-12 text-sm font-light">
        <div class="container mx-auto px-4 text-center">
            <p class="mb-2 opacity-80">115 Bis Nº333 / Tolosa / La Plata</p>
            <p class="mb-2 opacity-80">administracion@azilutsa.com.ar | 221 483-0093</p>
            <p class="text-[#D5232A] font-medium mt-4">www.azilut.com.ar</p>
        </div>
    </footer>

    <!-- Modal -->
    <div id="modal" class="fixed inset-0 bg-stone-900/80 z-[100] hidden flex items-center justify-center p-4 backdrop-blur-sm" onclick="closeModal()">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative animate-fade-in" onclick="event.stopPropagation()">
            <button onclick="closeModal()" class="absolute top-4 right-4 z-20 text-gray-400 hover:text-red-500 bg-white rounded-full p-1 shadow-sm border-0 cursor-pointer">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            
            <!-- Gallery -->
            <div class="w-full md:w-3/5 bg-gray-100 relative h-64 md:h-auto flex items-center justify-center group">
                <img id="modal-img" src="" class="w-full h-full object-contain max-h-[70vh]" />
                
                <!-- Slider Controls -->
                <div id="slider-controls" class="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 hidden">
                    <button onclick="prevImage()" class="bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md border-0 cursor-pointer">❮</button>
                    <button onclick="nextImage()" class="bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md border-0 cursor-pointer">❯</button>
                </div>
                <div id="img-counter" class="absolute bottom-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur">1 / 1</div>
            </div>

            <!-- Details -->
            <div class="w-full md:w-2/5 p-8 overflow-y-auto bg-white flex flex-col text-left">
                <h2 id="modal-title" class="text-2xl font-medium text-[#D5232A] mb-1 mt-0"></h2>
                <p id="modal-subtitle" class="text-gray-500 text-lg mb-6 mt-0"></p>
                
                <div id="modal-details" class="space-y-3 text-sm text-gray-600 flex-grow"></div>

                <div class="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3">
                     <button id="btn-technical" onclick="openTechnical()" class="hidden w-full bg-orange-500 text-white font-medium py-3 rounded-full hover:bg-orange-600 transition shadow-md flex items-center justify-center gap-2 border-0 cursor-pointer">
                        <span>📄 Ver Ficha Técnica</span>
                    </button>
                    <button onclick="downloadPdf()" class="w-full bg-[#D5232A] text-white font-medium py-3 rounded-full hover:bg-red-700 transition shadow-md flex items-center justify-center gap-2 border-0 cursor-pointer">
                        <span>⬇ Descargar PDF</span>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script>
        // DATA INJECTION
        ${dataScript}

        let currentCategory = 'Vehiculos';
        let currentItem = null;
        let currentImgIndex = 0;

        // INIT
        document.addEventListener('DOMContentLoaded', () => {
            try {
                renderGrid();
            } catch (e) {
                console.error("Error initializing app:", e);
                document.getElementById('grid').innerHTML = '<div class="col-span-full text-center text-red-500">Error al cargar el catálogo. Por favor, recargue la página.</div>';
            }
        });

        window.filterData = function(cat) {
            currentCategory = cat;
            // Update button styles
            const activeClass = 'px-6 py-2 rounded-full transition-all text-sm bg-[#D5232A] text-white shadow-md font-medium border-0 cursor-pointer';
            const inactiveClass = 'px-6 py-2 rounded-full transition-all text-sm text-gray-500 hover:bg-red-50 bg-transparent border-0 cursor-pointer';
            
            document.getElementById('btn-vehiculos').className = cat === 'Vehiculos' ? activeClass : inactiveClass;
            document.getElementById('btn-maquinarias').className = cat === 'Maquinarias' ? activeClass : inactiveClass;
            renderGrid();
        }

        function renderGrid() {
            const grid = document.getElementById('grid');
            grid.innerHTML = '';
            
            if (!window.CATALOG_DATA) return;

            const items = window.CATALOG_DATA.filter(i => i.category === currentCategory);
            
            if(items.length === 0) {
                grid.innerHTML = '<div class="col-span-full text-center py-10 text-gray-400">No hay elementos en esta categoría</div>';
                return;
            }

            items.forEach(item => {
                const card = document.createElement('div');
                // Combined Tailwind and Fallback classes
                card.className = 'bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col card';
                card.innerHTML = \`
                    <div class="relative h-48 bg-gray-50 overflow-hidden group cursor-pointer" onclick="openModal(\${item.id})">
                        <img src="\${item.images[0]}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 card-img" />
                        <div class="absolute top-2 right-2 bg-white/90 text-[#D5232A] text-xs font-bold px-2 py-1 rounded">\${item.year}</div>
                    </div>
                    <div class="p-5 flex flex-col flex-grow card-body">
                        <h3 class="text-lg font-medium text-gray-800 truncate mt-0">\${item.brand} \${item.model}</h3>
                        <p class="text-sm text-gray-500 mb-4 truncate">\${item.type}</p>
                        <button onclick="openModal(\${item.id})" class="mt-auto w-full border border-[#D5232A] text-[#D5232A] py-2 rounded-full text-sm hover:bg-[#D5232A] hover:text-white transition btn-outline">Ver Ficha</button>
                    </div>
                \`;
                grid.appendChild(card);
            });
        }

        window.openModal = function(id) {
            currentItem = window.CATALOG_DATA.find(i => i.id === id);
            if(!currentItem) return;
            
            currentImgIndex = 0;
            updateModalImage();
            
            document.getElementById('modal-title').innerText = currentItem.brand + ' ' + currentItem.model;
            document.getElementById('modal-subtitle').innerText = currentItem.type;
            
            const details = document.getElementById('modal-details');
            details.innerHTML = \`
                <div class="flex justify-between border-b border-gray-50 py-2"><span class="font-medium text-gray-400 uppercase text-xs">Dominio</span> <span class="text-right">\${currentItem.domain}</span></div>
                <div class="flex justify-between border-b border-gray-50 py-2"><span class="font-medium text-gray-400 uppercase text-xs">Año</span> <span class="text-right">\${currentItem.year}</span></div>
                <div class="flex justify-between border-b border-gray-50 py-2"><span class="font-medium text-gray-400 uppercase text-xs">Combustible</span> <span class="text-right">\${currentItem.fuel}</span></div>
                \${(currentItem.capacity && currentItem.capacity.trim() !== '') ? \`<div class="flex justify-between border-b border-gray-50 py-2"><span class="font-medium text-gray-400 uppercase text-xs">Capacidad</span> <span class="text-right">\${currentItem.capacity}</span></div>\` : ''}
                \${currentItem.equipment !== 'N/A' ? \`<div class="flex justify-between border-b border-gray-50 py-2"><span class="font-medium text-gray-400 uppercase text-xs">Equipamiento</span> <span class="text-right">\${currentItem.equipment}</span></div>\` : ''}
                <div class="flex justify-between border-b border-gray-50 py-2"><span class="font-medium text-gray-400 uppercase text-xs">Rastreo Satelital</span> <span class="text-right">\${currentItem.rastreoSatelital}</span></div>
            \`;

            const btnTech = document.getElementById('btn-technical');
            if (currentItem.technicalSheet) {
                btnTech.classList.remove('hidden');
            } else {
                btnTech.classList.add('hidden');
            }

            document.getElementById('modal').classList.remove('hidden');
        }

        window.closeModal = function() {
            document.getElementById('modal').classList.add('hidden');
        }

        window.updateModalImage = function() {
            if(!currentItem) return;
            const img = document.getElementById('modal-img');
            img.src = currentItem.images[currentImgIndex];
            
            const controls = document.getElementById('slider-controls');
            if(currentItem.images.length > 1) {
                controls.classList.remove('hidden');
            } else {
                controls.classList.add('hidden');
            }
            document.getElementById('img-counter').innerText = (currentImgIndex + 1) + ' / ' + currentItem.images.length;
        }

        window.nextImage = function() {
            if(!currentItem) return;
            currentImgIndex = (currentImgIndex + 1) % currentItem.images.length;
            updateModalImage();
        }

        window.prevImage = function() {
            if(!currentItem) return;
            currentImgIndex = (currentImgIndex - 1 + currentItem.images.length) % currentItem.images.length;
            updateModalImage();
        }

        window.openTechnical = function() {
            if (currentItem && currentItem.technicalSheet) {
                const win = window.open();
                win.document.write('<iframe src="' + currentItem.technicalSheet + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
            }
        }

        window.downloadPdf = function() {
             if(!currentItem) return;
             
             // Check for jsPDF
             if(!window.jspdf) {
                 alert("Error: La librería para generar PDFs no se pudo cargar. Verifique su conexión a internet.");
                 return;
             }

             const { jsPDF } = window.jspdf;
             const doc = new jsPDF();
             const margin = 15;
             let y = 20;

             // Header
             doc.setFontSize(22);
             doc.setTextColor(213, 35, 42);
             doc.text("AZILUT S.A.", margin, y);
             
             doc.setFontSize(12);
             doc.setTextColor(100);
             doc.text("Ficha de Equipo", margin, y + 8);
             y += 20;

             // Title
             doc.setFontSize(18);
             doc.setTextColor(40);
             doc.text(currentItem.brand + ' ' + currentItem.model, margin, y);
             y += 10;

             // Image
             try {
                // Use null for format to let jsPDF detect it (fixes PNG transparency issues)
                doc.addImage(currentItem.images[0], null, margin, y, 180, 100);
                y += 110;
             } catch(e) { 
                console.error("Image error", e);
                y += 10; 
             }

             // Details
             doc.setFontSize(11);
             doc.setTextColor(0);
             
             const addLine = (label, val) => {
                 // Page check
                 if(y > 270) { doc.addPage(); y = 20; }
                 doc.setFont(undefined, 'bold');
                 doc.text(label, margin, y);
                 doc.setFont(undefined, 'normal');
                 doc.text(String(val), margin + 40, y);
                 y += 8;
             };

             addLine("Tipo:", currentItem.type);
             addLine("Dominio:", currentItem.domain);
             addLine("Año:", currentItem.year);
             if(currentItem.capacity && currentItem.capacity.trim() !== '') addLine("Capacidad:", currentItem.capacity);
             
             if(currentItem.equipment && currentItem.equipment !== 'N/A') {
                 const lines = doc.splitTextToSize(currentItem.equipment, 130);
                 doc.setFont(undefined, 'bold');
                 doc.text("Equipamiento:", margin, y);
                 doc.setFont(undefined, 'normal');
                 doc.text(lines, margin + 40, y);
                 y += (lines.length * 7) + 2;
             }
             
             addLine("Rastreo Satelital:", currentItem.rastreoSatelital);

             // Footer
             const pageHeight = doc.internal.pageSize.height;
             doc.setFontSize(8);
             doc.setTextColor(150);
             doc.text("www.azilut.com.ar | administracion@azilutsa.com.ar", margin, pageHeight - 10);
             
             doc.save('ficha_' + currentItem.brand.replace(/ /g, '_') + '.pdf');
        }
    </script>
</body>
</html>`;
};
