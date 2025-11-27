import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, FileText, BookOpen, Globe, ChevronLeft, ChevronRight } from 'lucide-react';

// --- CONFIGURACIÓN DE LA API ---
//const API_BASE_URL = 'http://localhost:3000/api/libros';
const API_BASE_URL = 'http://192.168.137.11:3003/api/libros';
const PDF_API_URL = `${API_BASE_URL}/file/pdf`;

const EMPTY_BOOK_DATA = {
  portadaBase64: 'https://placehold.co/80x120/087990/ffffff?text=LIBRO',
};

// --- FUNCIÓN AUXILIAR: BASE64 a Blob ---
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

// Función para obtener URL de portada
const getBookCoverUrl = (base64OrUrl) => {
  if (base64OrUrl && base64OrUrl.startsWith('data:')) {
    return base64OrUrl;
  }
  if (base64OrUrl && base64OrUrl.startsWith('http')) {
    return base64OrUrl;
  }
  return EMPTY_BOOK_DATA.portadaBase64;
};

const Books = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allBooks, setAllBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Función para mostrar mensajes de estado
  const displayStatus = useCallback((message, type = 'success') => {
    setStatusMessage({ message, type });
    setTimeout(() => setStatusMessage(null), 4000);
  }, []);

  // --- BÚSQUEDA GLOBAL (con debounce) ---
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      performSearch(searchTerm);
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  // Cargar todos los libros al inicio
  useEffect(() => {
    performSearch('');
  }, []);

  const performSearch = async (query) => {
    setIsLoading(true);
    
    const endpoint = query.trim() === ''
      ? `${API_BASE_URL}/search?filtro=` // Búsqueda global con filtro vacío
      : `${API_BASE_URL}/search?filtro=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Error al realizar la búsqueda.');

      const data = await response.json();
      setAllBooks(data);
      setCurrentPage(1); // Reiniciar a la primera página al buscar

    } catch (error) {
      console.error('Error en la búsqueda:', error);
      displayStatus('Error al conectar con el servidor. Verifica tu conexión.', 'error');
      setAllBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- VISUALIZAR PDF ---
  const handleViewPdf = async (book) => {
    if (!book.id) {
      displayStatus('El libro no tiene un ID válido.', 'warning');
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
        let errorMessage = 'PDF no encontrado.';
        try {
          const errorBody = await response.json();
          errorMessage = errorBody.message || errorMessage;
        } catch (e) {
          console.error('Error al leer respuesta:', e);
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
      console.error('Error al ver PDF:', error);
    }
  };

  // --- PAGINACIÓN ---
  const totalPages = Math.ceil(allBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBooks = allBooks.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Icono según universidad
  const getUniversityIcon = (university) => {
    if (university === 'UTL') {
      return <BookOpen size={16} className="text-indigo-600" />;
    }
    return <Globe size={16} className="text-green-600" />;
  };

  return (
    <div className="w-full space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-2">
          Catálogo de Libros
        </h1>
        <p className="text-indigo-100">
          Explora nuestra colección de libros internos y externos
        </p>
      </div>

      {/* Mensajes de Estado */}
      {statusMessage && (
        <div
          className={`p-4 rounded-lg shadow-md border ${
            statusMessage.type === 'error'
              ? 'bg-red-100 text-red-800 border-red-300'
              : statusMessage.type === 'warning'
              ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
              : 'bg-green-100 text-green-800 border-green-300'
          }`}
          role="alert"
        >
          {statusMessage.message}
        </div>
      )}

      {/* Barra de búsqueda */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Buscar por título, género o universidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Indicador de resultados */}
      <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
        <p className="text-sm text-gray-600">
          {isLoading ? (
            'Buscando libros...'
          ) : (
            <>
              Mostrando <span className="font-semibold">{currentBooks.length}</span> de{' '}
              <span className="font-semibold">{allBooks.length}</span> libros
            </>
          )}
        </p>
      </div>

      {/* Tabla de libros */}
      <div className="w-full overflow-hidden bg-white rounded-xl shadow-lg">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando libros...</p>
            </div>
          </div>
        ) : currentBooks.length === 0 ? (
          <div className="text-center py-16 px-4">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No se encontraron libros
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? `No hay resultados para "${searchTerm}"`
                : 'No hay libros disponibles en este momento'}
            </p>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="px-4 py-4 text-left text-sm font-semibold uppercase w-24">
                  Portada
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase">
                  Libro
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase">
                  Universidad
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase">
                  Género
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold uppercase w-32">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {currentBooks.map((book, index) => (
                <tr
                  key={`${book.id}-${book.universidadPropietaria}-${index}`}
                  className={`border-b border-gray-200 ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } hover:bg-indigo-50 transition-colors`}
                >
                  {/* Portada */}
                  <td className="px-4 py-3">
                    <div className="w-16 h-20 overflow-hidden rounded-md shadow-md border border-gray-200">
                      <img
                        src={getBookCoverUrl(book.portadaBase64)}
                        alt={`Portada de ${book.titulo}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = EMPTY_BOOK_DATA.portadaBase64;
                        }}
                      />
                    </div>
                  </td>

                  {/* Título */}
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {book.titulo}
                  </td>

                  {/* Universidad */}
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="flex items-center space-x-2">
                      {getUniversityIcon(book.universidadPropietaria)}
                      <span className="font-semibold">
                        {book.universidadPropietaria}
                      </span>
                    </div>
                  </td>

                  {/* Género */}
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {book.generoLiterario || 'Sin clasificar'}
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleViewPdf(book)}
                      disabled={!book.pdfBase64}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <FileText size={16} />
                      <span>Leer</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginación */}
      {!isLoading && allBooks.length > itemsPerPage && (
        <div className="flex justify-center items-center space-x-4 py-6">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="flex items-center justify-center w-10 h-10 bg-white border-2 border-gray-800 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <ChevronLeft size={20} />
          </button>

          <span className="text-sm font-semibold text-gray-700 px-4 py-2 bg-white rounded-lg shadow-sm">
            Página {currentPage} de {totalPages}
          </span>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center w-10 h-10 bg-white border-2 border-gray-800 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Books;