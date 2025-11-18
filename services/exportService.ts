import { Item } from '../types';

// Access the global jsPDF object loaded via script tag
const getJsPDF = () => {
    const jspdf = (window as any).jspdf;
    if (!jspdf) {
        throw new Error("jsPDF library not loaded");
    }
    return jspdf.jsPDF;
};

// Access the global XLSX object loaded via script tag
const getXLSX = () => {
    const xlsx = (window as any).XLSX;
    if (!xlsx) {
        throw new Error("XLSX library not loaded");
    }
    return xlsx;
};

// Function to export the entire list to an Excel file
export const exportListToExcel = (data: Item[]) => {
    const XLSX = getXLSX();
    const worksheet = XLSX.utils.json_to_sheet(data.map(item => ({
        Categoria: item.category,
        Marca: item.brand,
        Modelo: item.model,
        Tipo: item.type,
        Año: item.year,
        Dominio: item.domain,
        Combustible: item.fuel,
        Capacidad: item.capacity,
        Equipamiento: item.equipment,
        'Rastreo Satelital': item.rastreoSatelital,
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Catálogo");
    XLSX.writeFile(workbook, "catalogo_azilut.xlsx");
};

// Function to export a single item's details to a PDF file
export const exportItemToPdf = (item: Item) => {
    const JsPDF = getJsPDF();
    const doc = new JsPDF();
    const margin = 15;
    let y = 20;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(213, 35, 42); // Azilut Red
    doc.text("AZILUT S.A.", margin, y);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Ficha de Equipo", margin, y + 8);
    y += 20;

    // Title
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text(`${item.brand} ${item.model}`, margin, y);
    y += 10;

    // Image
    if (item.images && item.images.length > 0) {
        try {
            const imgData = item.images[0];
            // Check if it's a data URL (Base64) or a standard URL
            // Note: Standard URLs might fail due to CORS in a browser environment unless proxied or allow-listed.
            // Base64 strings from user upload will work perfectly.
            
            const imgWidth = 180;
            // Calculate aspect ratio if possible, otherwise use fixed height
            const imgHeight = 100; 
            
            // We try to add the image. If format is not detected from extension, we assume JPEG for photos.
            // For base64, jsPDF usually auto-detects.
            doc.addImage(imgData, 'JPEG', margin, y, imgWidth, imgHeight);
            y += imgHeight + 10;
        } catch (error) {
            console.warn("Could not add image to PDF. It might be a CORS issue with remote URL.", error);
            // Render a placeholder text if image fails
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text("[Imagen no disponible en PDF]", margin, y + 10);
            y += 20;
        }
    } else {
        y += 10;
    }

    // Details
    doc.setFontSize(11);
    doc.setTextColor(0); // Reset text color to black

    const addDetail = (label: string, value: string | number) => {
        if (y > 270) { // Page break
            doc.addPage();
            y = 20;
        }
        doc.setFont(undefined, 'bold');
        doc.text(label, margin, y);
        doc.setFont(undefined, 'normal');
        doc.text(String(value), margin + 50, y);
        y += 7;
    };
    
    addDetail("Categoría:", item.category);
    addDetail("Tipo:", item.type);
    addDetail("Año:", item.year);
    addDetail("Dominio:", item.domain);
    addDetail("Combustible:", item.fuel);
    addDetail("Capacidad:", item.capacity);
    if (item.equipment && item.equipment !== 'N/A') {
        const equipmentLines = doc.splitTextToSize(item.equipment, 120);
        doc.setFont(undefined, 'bold');
        doc.text("Equipamiento:", margin, y);
        doc.setFont(undefined, 'normal');
        doc.text(equipmentLines, margin + 50, y);
        y += 7 * equipmentLines.length;
    } else {
         if (item.equipment && item.equipment !== 'N/A') {
            addDetail("Equipamiento:", item.equipment);
         }
    }
    addDetail("Rastreo Satelital:", item.rastreoSatelital);
    
    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setLineWidth(0.5);
    doc.setDrawColor(200);
    doc.line(margin, pageHeight - 25, doc.internal.pageSize.width - margin, pageHeight - 25);
    doc.setFontSize(8);
    doc.setTextColor(150);
    const footerText = "115 Bis Nº333, Tolosa, La Plata | administracion@azilutsa.com.ar | www.azilut.com.ar";
    doc.text(footerText, margin, pageHeight - 15);


    doc.save(`ficha_${item.brand}_${item.model.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
};