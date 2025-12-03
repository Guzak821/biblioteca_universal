import React, { useState, useEffect, useCallback } from 'react';
import { Search, FileText, Globe, BookOpen, Loader } from 'lucide-react';

// --- CONFIGURACIÓN DE LA API ---
const API_BASE_URL = 'http://localhost:3003/api/libros'; 
const PDF_API_URL = `${API_BASE_URL}/file/pdf`; 

const EMPTY_BOOK_DATA = {
    portadaBase64: 'https://placehold.co/50x70/087990/ffffff?text=PORTADA', 
};

// --- FUNCIÓN AUXILIAR: BASE64 a Blob ---
const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    try {
        let base64 = b64Data;
        if (base64.startsWith('data:')) {
            base64 = base64.split(',')[1];
        }
        base64 = base64.replace(/\s/g, '');
        if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64)) {
            throw new Error('Cadena base64 inválida');
        }
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
    } catch (error) {
        console.error('Error al convertir base64 a blob:', error);
        throw new Error('No se pudo decodificar el PDF.');
    }
};

const getBookCoverUrl = (base64OrUrl) => {
    if (base64OrUrl && base64OrUrl.startsWith('data:')) return base64OrUrl; 
    if (base64OrUrl && base64OrUrl.startsWith('http')) return base64OrUrl;
    return EMPTY_BOOK_DATA.portadaBase64; 
};

// --- FUNCIÓN DE VISUALIZACIÓN DE PDF ---
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

        const response = await fetch(`${PDF_API_URL}?${params.toString()}`);
        
        if (!response.ok) {
            let errorMessage = 'PDF no encontrado o error en el servidor.';
            try {
                const errorBody = await response.json();
                errorMessage = errorBody.message || errorBody.error || errorMessage;
            } catch (e) {
                console.error("No se pudo leer el cuerpo de error:", e);
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
            displayStatus('El libro no tiene contenido PDF.', 'warning');
        }

    } catch (error) {
        displayStatus(`Error al ver el PDF: ${error.message}`, 'error');
        console.error("Error al ver PDF:", error);
    }
};

// --- COMPONENTE CARRUSEL ---
const BookCarousel = ({ books, onViewPdf, isLoading }) => {
    if (isLoading) {
        return (
            <div className="text-center p-12 bg-white rounded-xl shadow-inner border border-indigo-200">
                <Loader size={48} className="mx-auto text-indigo-500 animate-spin mb-4" />
                <p className="text-indigo-600 font-semibold">Cargando catálogo completo...</p>
                <p className="text-sm text-gray-500 mt-2">Consultando libros internos y externos</p>
            </div>
        );
    }

    if (!books || books.length === 0) {
        return (
            <div className="text-center p-12 text-gray-500 bg-gray-100 rounded-xl border border-gray-300">
                <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold">No se encontraron libros</h3>
                <p className="text-sm">Verifica la conexión con las APIs o intenta con otro filtro.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-xl">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-2xl font-bold text-gray-800">
                    Catálogo Global
                </h3>
                <span className="text-sm font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                    {books.length} {books.length === 1 ? 'libro' : 'libros'}
                </span>
            </div>
            
            <div className="flex overflow-x-scroll snap-x snap-mandatory space-x-6 pb-4">
                {books.map((book, index) => (
                    <div 
                        key={`${book.id}-${book.universidadPropietaria}-${index}`}
                        className="flex-shrink-0 w-64 snap-center bg-gray-50 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
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
                                className="mt-3 w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md"
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

// --- COMPONENTE PRINCIPAL ---
const AdminDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [allBooks, setAllBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState(null); 
    
    const displayStatus = (message, type = 'success') => {
        setStatusMessage({ message, type });
        setTimeout(() => setStatusMessage(null), 4000);
    };

    //  CARGA INICIAL AUTOMÁTICA DE TODOS LOS LIBROS 
    useEffect(() => {
        loadAllBooks();
    }, []);

    const loadAllBooks = async () => {
        setIsLoading(true);
        try {
            console.log('[AdminDashboard] Cargando todos los libros (internos + externos)...');
            
            // Llamar al endpoint de búsqueda global con filtro vacío
            // Esto retorna TODOS los libros (internos + externos)
            const response = await fetch(`${API_BASE_URL}/search?filtro=`);
            
            if (!response.ok) throw new Error('Error al cargar el catálogo completo.');

            const data = await response.json();
            
            console.log(`[AdminDashboard] ✓ Libros cargados: ${data.length}`);
            
            setAllBooks(data);
            setFilteredBooks(data);
            
            if (data.length === 0) {
                displayStatus('No se encontraron libros. Verifica las APIs externas.', 'warning');
            }

        } catch (error) {
            console.error('[AdminDashboard] Error al cargar libros:', error);
            displayStatus('Error al cargar el catálogo. Inténtalo más tarde.', 'error');
            setAllBooks([]);
            setFilteredBooks([]);
        } finally {
            setIsLoading(false);
        }
    };

    // ⭐ BÚSQUEDA CON BOTÓN (como antes) ⭐
    const performSearch = async () => {
        if (searchTerm.trim() === '') {
            // Si está vacío, recargar todos
            await loadAllBooks();
            return;
        }

        setIsLoading(true);
        try {
            console.log(`[AdminDashboard] Buscando: "${searchTerm}"`);
            
            const response = await fetch(`${API_BASE_URL}/search?filtro=${encodeURIComponent(searchTerm)}`);
            
            if (!response.ok) throw new Error('Error al buscar.');

            const data = await response.json();
            
            console.log(`[AdminDashboard] ✓ Resultados: ${data.length}`);
            
            setFilteredBooks(data);
            
            if (data.length === 0) {
                displayStatus(`No se encontraron resultados para "${searchTerm}"`, 'warning');
            }

        } catch (error) {
            console.error('[AdminDashboard] Error al buscar:', error);
            displayStatus('Error al realizar la búsqueda.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Permitir buscar con Enter
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    };

    // ⭐ FILTRADO LOCAL EN TIEMPO REAL (mientras escribes) ⭐
    useEffect(() => {
        // Solo filtrar localmente mientras escribe, NO hacer búsqueda al backend
        if (searchTerm.trim() === '') {
            setFilteredBooks(allBooks);
        } else {
            const filtroLower = searchTerm.toLowerCase().trim();
            const filtered = allBooks.filter((book) => {
                const tituloMatch = book.titulo.toLowerCase().includes(filtroLower);
                const generoMatch = book.generoLiterario?.toLowerCase().includes(filtroLower);
                const uniMatch = book.universidadPropietaria?.toLowerCase().includes(filtroLower);
                return tituloMatch || generoMatch || uniMatch;
            });
            setFilteredBooks(filtered);
        }
    }, [searchTerm, allBooks]);

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
                        Catálogo global de libros internos y externos
                    </p>
                </div>
            </header>

            <div className="w-full space-y-8 px-4 py-8 max-w-7xl mx-auto">
                
                {/* Mensajes de Estado */}
                {statusMessage && (
                    <div 
                        className={`p-4 rounded-lg shadow-md ${
                            statusMessage.type === 'error' 
                                ? 'bg-red-100 text-red-800 border-red-300' 
                                : statusMessage.type === 'warning' 
                                ? 'bg-yellow-100 text-yellow-800 border-yellow-300' 
                                : 'bg-green-100 text-green-800 border-green-300'
                        } border`}
                        role="alert"
                    >
                        {statusMessage.message}
                    </div>
                )}

                {/* Barra de Búsqueda */}
                <div className="w-full bg-white p-6 rounded-xl shadow-2xl">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Búsqueda en el Catálogo Global
                    </h3>
                    <div className="flex items-center space-x-4">
                        <div className="relative flex-1">
                            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
                            <input
                                type="text"
                                placeholder="Busca por título, género o universidad..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="w-full pl-10 pr-4 py-3 border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-700 shadow-sm"
                            />
                        </div>
                        <button
                            onClick={performSearch}
                            disabled={isLoading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-150 shadow-md disabled:bg-indigo-400"
                        >
                            {isLoading ? 'Buscando...' : 'Buscar'}
                        </button>
                    </div>
                    {searchTerm && (
                        <p className="text-sm text-gray-600 mt-2">
                            Mostrando {filteredBooks.length} de {allBooks.length} libros
                        </p>
                    )}
                </div>

                {/* Carrusel de Libros */}
                <BookCarousel
                    books={filteredBooks}
                    onViewPdf={handleViewPdfClick}
                    isLoading={isLoading}
                />

                {/* Enlace de Gestión */}
                <div className="pt-8 text-center">
                    <p className="text-gray-600 mb-4">
                        ¿Necesitas administrar los libros internos (CRUD)?
                    </p>
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