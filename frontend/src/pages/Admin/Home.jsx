import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, FileText, Globe, BookOpen } from 'lucide-react';

// --- CONFIGURACIÓN DE LA API (Debe coincidir con BooksApp.jsx) ---
const API_BASE_URL = 'http://localhost:3000/api/libros'; 
const PDF_API_URL = `${API_BASE_URL}/file/pdf`; 

const EMPTY_BOOK_DATA = {
    portadaBase64: 'https://placehold.co/50x70/087990/ffffff?text=PORTADA', 
};

// --- FUNCIÓN AUXILIAR: BASE64 a Blob (para visualizar PDF) ---
const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    const base64 = b64Data.startsWith('data:') ? b64Data.split(',')[1] : b64Data;
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
};

// Función auxiliar para obtener la URL de visualización de la portada
const getBookCoverUrl = (base64OrUrl) => {
    if (base64OrUrl && base64OrUrl.startsWith('data:')) {
        return base64OrUrl; 
    }
    if (base64OrUrl && base64OrUrl.startsWith('http')) {
        return base64OrUrl; // Para portadas externas
    }
    return EMPTY_BOOK_DATA.portadaBase64; 
};

// --- FUNCIÓN PRINCIPAL DE VISUALIZACIÓN DE PDF (REUTILIZADA) ---
const handleViewPdf = async (book, displayStatus) => {
    if (!book.id) {
        displayStatus('El PDF solo puede visualizarse si el libro tiene un ID válido.', 'warning');
        return;
    }

   const isExternal = book.isExternal === true;

    try {
        const params = new URLSearchParams({
            id: book.id.toString(),
            universidad: book.universidadPropietaria,
            external: isExternal ? 'true' : 'false', 
        });

        // Llama al endpoint CORRECTO /api/libros/file/pdf
        const response = await fetch(`${PDF_API_URL}?${params.toString()}`);
        
        if (!response.ok) {
            let errorMessage = 'PDF no encontrado o error en el servidor.';
            try {
                const errorBody = await response.json();
                errorMessage = errorBody.message || errorBody.error || errorMessage;
            } catch (e) {
                console.error("No se pudo leer el cuerpo de error de la respuesta:", e);
            }
            throw new Error(errorMessage);
        }

        const result = await response.json();
        const pdfBase64 = result.pdfBase64;
        
        if (pdfBase64) {
            const pdfBlob = b64toBlob(pdfBase64, 'application/pdf');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl, '_blank');
        } else {
            displayStatus('El libro no tiene contenido PDF asociado en el servidor.', 'warning');
        }

    } catch (error) {
        displayStatus(`Ocurrió un error al intentar ver el PDF: ${error.message}`, 'error');
        console.error("Error al ver PDF:", error);
    }
};


// --- COMPONENTE CARRUSEL (Responsive con Scroll Horizontal) ---
const BookCarousel = ({ books, onViewPdf, isSearching }) => {
    if (isSearching) {
        return (
            <div className="text-center p-12 text-indigo-500 border border-dashed border-indigo-300 rounded-xl bg-white shadow-inner">
                Buscando libros internos y externos...
            </div>
        );
    }

    if (!books || books.length === 0) {
        return (
            <div className="text-center p-12 text-gray-500 bg-gray-100 rounded-xl border border-gray-300">
                <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold">No se encontraron resultados</h3>
                <p className="text-sm">Intenta con un filtro diferente o verifica la conexión con las APIs externas.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                Catálogo Global
            </h3>
            
            <div className="flex overflow-x-scroll snap-x snap-mandatory space-x-6 pb-4">
                {books.map((book, index) => (
                    <div 
                        key={index}
                        className="flex-shrink-0 w-64 snap-center bg-gray-50 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                    >
                        <div className="h-40 w-full overflow-hidden flex justify-center items-center bg-gray-200">
                            <img 
                                src={getBookCoverUrl(book.portadaBase64)} 
                                alt={`Portada de ${book.titulo}`} 
                                className="h-full w-full object-cover"
                                onError={(e) => { e.currentTarget.src = EMPTY_BOOK_DATA.portadaBase64; }} 
                            />
                        </div>
                        <div className="p-4 space-y-2">
                            <h4 className="text-lg font-bold text-gray-900 truncate" title={book.titulo}>
                                {book.titulo}
                            </h4>
                            
                            <div className="flex items-center text-xs text-gray-600">
                                {book.universidadPropietaria === 'UTL' ? (
                                    <BookOpen size={14} className="mr-1 text-indigo-500" />
                                ) : (
                                    <Globe size={14} className="mr-1 text-green-600" />
                                )}
                                <span className="font-semibold">{book.universidadPropietaria}</span>
                            </div>

                            <p className="text-sm text-gray-700">
                                <span className="font-medium">Género:</span> {book.generoLiterario || 'N/A'}
                            </p>
                            
                            <button
                                onClick={() => onViewPdf(book)}
                                disabled={!book.pdfBase64}
                                className="mt-3 w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
                            >
                                <FileText size={16} />
                                <span>Ver PDF</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">Desliza horizontalmente para ver más resultados.</p>
        </div>
    );
};


// --- COMPONENTE PRINCIPAL: AdminDashboard ---
const AdminDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null); 
    
    // Función para mostrar mensajes de estado temporalmente
    const displayStatus = (message, type = 'success') => {
        setStatusMessage({ message, type });
        setTimeout(() => setStatusMessage(null), 4000);
    };

    // --- BÚSQUEDA GLOBAL ---
    // Usamos useEffect y un debounce para no saturar la API con cada tecla
    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (searchTerm.trim().length >= 3 || searchTerm.trim().length === 0) {
                performSearch(searchTerm);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(delaySearch);
    }, [searchTerm]);

    const performSearch = useCallback(async (query) => {
        setIsSearching(true);
        setSearchResults([]);

        // Si el query está vacío, cargamos todos los libros internos (simulamos la carga inicial)
        const endpoint = query.trim() === '' 
            ? API_BASE_URL // GET /api/libros (solo internos)
            : `${API_BASE_URL}/search?filtro=${encodeURIComponent(query)}`; // GET /api/libros/search?filtro=... (global)

        try {
            const response = await fetch(endpoint);
            if (!response.ok) throw new Error('Error al realizar la búsqueda global.');

            const data = await response.json();
            setSearchResults(data);

        } catch (error) {
            console.error("Error en la búsqueda:", error);
            displayStatus('Error al conectar con el servidor de búsqueda. Inténtalo más tarde.', 'error');
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, []);
    
    // Handler para ver el PDF (delega al helper global)
    const handleViewPdfClick = useCallback((book) => {
        handleViewPdf(book, displayStatus);
    }, []);


    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            <header className="bg-indigo-600 shadow-xl">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold text-white">
                        Panel Principal de Administración
                    </h1>
                    <p className="mt-2 text-xl text-indigo-200">
                        Accede al catálogo global y a las funciones de gestión.
                    </p>
                </div>
            </header>

            <div className="w-full space-y-8 px-4 py-8 max-w-7xl mx-auto">
                
                {/* Mensajes de Estado (Éxito/Error) */}
                {statusMessage && (
                    <div 
                        className={`p-4 rounded-lg shadow-md ${statusMessage.type === 'error' ? 'bg-red-100 text-red-800 border-red-300' : statusMessage.type === 'warning' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 'bg-green-100 text-green-800 border-green-300'} border`}
                        role="alert"
                    >
                        {statusMessage.message}
                    </div>
                )}

                {/* 1. Barra de Búsqueda Global (Diseño Elegante) */}
                <div className="w-full bg-white p-6 rounded-xl shadow-2xl">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Búsqueda de Catálogo (Interno y Externo)
                    </h3>
                    <div className="flex items-center space-x-4">
                        <div className="relative flex-1">
                            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
                            <input
                                type="text"
                                placeholder="Busca libros por título, género o universidad..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-700 shadow-sm"
                            />
                        </div>
                        <button
                            onClick={() => performSearch(searchTerm)}
                            disabled={isSearching}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-150 shadow-md disabled:bg-indigo-400"
                        >
                            {isSearching ? 'Buscando...' : 'Buscar'}
                        </button>
                    </div>
                </div>

                {/* 2. Carrusel de Resultados */}
                <BookCarousel
                    books={searchResults}
                    onViewPdf={handleViewPdfClick}
                    isSearching={isSearching && searchTerm.length >= 3}
                />

                {/* Enlace de Gestión */}
                <div className="pt-8 text-center">
                    <p className="text-gray-600 mb-4">
                        ¿Necesitas administrar los libros internos (CRUD)?
                    </p>
                    {/* Nota: En un entorno real de React Router, esto sería un <Link to="/admin/gestion"> */}
                    <a 
                        href="/admin/books" 
                        className="inline-flex items-center space-x-2 px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-indigo-500 hover:bg-indigo-600 transition-colors"
                    >
                        <BookOpen size={20} />
                        <span>Ir a Gestión de Libros Internos (CRUD)</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;