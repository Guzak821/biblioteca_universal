import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, Globe, FileText, Library, Award, Building2, ArrowRight } from 'lucide-react';

// --- CONFIGURACIÓN DE LA API ---
const API_BASE_URL = 'http://192.168.137.11:3003/api/libros';
const PDF_API_URL = `${API_BASE_URL}/file/pdf`;

const EMPTY_BOOK_DATA = {
  portadaBase64: 'https://placehold.co/150x220/087990/ffffff?text=LIBRO',
};

// --- FUNCIÓN AUXILIAR: BASE64 a Blob (CON VALIDACIÓN MEJORADA) ---
const b64toBlob = (b64Data, contentType = 'application/pdf', sliceSize = 512) => {
  try {
    let base64 = b64Data.trim();
    
    console.log('[b64toBlob] Longitud recibida:', base64.length);
    console.log('[b64toBlob] Primeros 100 chars:', base64.substring(0, 100));
    
    // Remover prefijo Data URI si existe
    if (base64.includes('base64,')) {
      base64 = base64.split('base64,')[1];
      console.log('[b64toBlob] Removido prefijo Data URI');
    } else if (base64.startsWith('data:')) {
      const commaIndex = base64.indexOf(',');
      if (commaIndex !== -1) {
        base64 = base64.substring(commaIndex + 1);
        console.log('[b64toBlob] Removido prefijo Data URI (método alternativo)');
      }
    }
    
    // Remover espacios en blanco
    base64 = base64.replace(/\s/g, '');
    
    console.log('[b64toBlob] Base64 limpio - Longitud:', base64.length);
    
    // Validar formato base64
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64)) {
      throw new Error('Cadena base64 contiene caracteres inválidos');
    }
    
    // Validar longitud mínima
    if (base64.length < 100) {
      throw new Error('El base64 es demasiado corto para ser un PDF válido');
    }
    
    // Decodificar base64
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
    
    const blob = new Blob(byteArrays, { type: contentType });
    console.log('[b64toBlob] ✓ Blob creado exitosamente - Tamaño:', blob.size, 'bytes');
    
    return blob;
  } catch (error) {
    console.error('[b64toBlob] ❌ Error al convertir base64 a blob:', error);
    throw new Error(`No se pudo decodificar el PDF: ${error.message}`);
  }
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

const Home = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingPdfId, setLoadingPdfId] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [stats, setStats] = useState({
    totalBooks: 0,
    categories: 0,
    universities: 0,
  });

  // Función para mostrar mensajes de estado
  const displayStatus = useCallback((message, type = 'success') => {
    setStatusMessage({ message, type });
    setTimeout(() => setStatusMessage(null), 4000);
  }, []);

  // --- CARGAR LIBROS AL INICIO ---
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setIsLoading(true);
    try {
      // Búsqueda global con filtro vacío (todos los libros)
      const response = await fetch(`${API_BASE_URL}/search?filtro=`);
      if (!response.ok) throw new Error('Error al cargar libros.');

      const data = await response.json();
      setAllBooks(data);

      // Calcular estadísticas
      const uniqueCategories = new Set(
        data.map((book) => book.generoLiterario).filter(Boolean)
      );
      const uniqueUniversities = new Set(
        data.map((book) => book.universidadPropietaria).filter(Boolean)
      );

      setStats({
        totalBooks: data.length,
        categories: uniqueCategories.size,
        universities: uniqueUniversities.size,
      });
    } catch (error) {
      console.error('Error al cargar libros:', error);
      displayStatus('Error al conectar con el servidor.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // --- VISUALIZAR PDF (CORREGIDO) ---
  const handleViewPdf = async (book) => {
    if (!book.id) {
      displayStatus('El libro no tiene un ID válido.', 'warning');
      return;
    }

    const isExternal = book.isExternal === true;
    setLoadingPdfId(book.id);

    console.log('[handleViewPdf] 📖 Abriendo PDF:', {
      id: book.id,
      titulo: book.titulo,
      universidad: book.universidadPropietaria,
      isExternal
    });

    try {
      // CORRECCIÓN: Usar universidadPropietaria directamente, no extraer de ID
      const params = new URLSearchParams({
        id: book.id.toString(),
        universidad: book.universidadPropietaria, // ← ESTO ES LO IMPORTANTE
        external: isExternal ? 'true' : 'false',
      });

      const fullUrl = `${PDF_API_URL}?${params.toString()}`;
      console.log('[handleViewPdf] 🌐 URL completa:', fullUrl);
      console.log('[handleViewPdf] 📋 Parámetros:', {
        id: book.id.toString(),
        universidad: book.universidadPropietaria,
        external: isExternal ? 'true' : 'false'
      });

      const response = await fetch(fullUrl);

      if (!response.ok) {
        let errorMessage = 'PDF no encontrado.';
        try {
          const errorBody = await response.json();
          errorMessage = errorBody.message || errorMessage;
          console.error('[handleViewPdf] ❌ Error del servidor:', errorBody);
        } catch (e) {
          console.error('[handleViewPdf] ❌ Error al leer respuesta:', e);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      const pdfBase64 = result.pdfBase64;

      console.log('[handleViewPdf] ✓ Respuesta recibida:', {
        tienePdf: !!pdfBase64,
        longitud: pdfBase64?.length || 0
      });

      if (!pdfBase64 || pdfBase64.trim().length === 0) {
        displayStatus('El libro no tiene contenido PDF.', 'warning');
        return;
      }

      try {
        // Convertir base64 a blob
        const pdfBlob = b64toBlob(pdfBase64, 'application/pdf');
        
        if (pdfBlob.size === 0) {
          throw new Error('El PDF generado está vacío (0 bytes)');
        }
        
        console.log('[handleViewPdf] ✓ Blob creado - Tamaño:', pdfBlob.size, 'bytes');
        
        // Crear URL del blob
        const pdfUrl = URL.createObjectURL(pdfBlob);
        console.log('[handleViewPdf] ✓ URL creada:', pdfUrl);
        
        // Abrir en nueva ventana
        const newWindow = window.open(pdfUrl, '_blank', 'noopener,noreferrer');
        
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
          // Si el popup fue bloqueado, intentar con método alternativo
          console.warn('[handleViewPdf] ⚠️ Ventana emergente bloqueada, intentando método alternativo...');
          
          // Crear un link temporal y hacer click
          const link = document.createElement('a');
          link.href = pdfUrl;
          link.target = '_blank';
          link.download = `${book.titulo}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          displayStatus('PDF abierto. Si no lo ves, verifica el bloqueador de ventanas emergentes.', 'warning');
        } else {
          console.log('[handleViewPdf] ✓✓✓ PDF abierto en nueva ventana');
          displayStatus('¡PDF abierto exitosamente!', 'success');
        }
        
        // Liberar URL después de 1 minuto
        setTimeout(() => {
          URL.revokeObjectURL(pdfUrl);
          console.log('[handleViewPdf] 🧹 URL liberada');
        }, 60000);
        
      } catch (conversionError) {
        console.error('[handleViewPdf] ❌ Error al convertir base64:', conversionError);
        displayStatus(
          `Error al procesar el PDF: ${conversionError.message}`,
          'error'
        );
      }
    } catch (error) {
      displayStatus(`Error al ver el PDF: ${error.message}`, 'error');
      console.error('[handleViewPdf] ❌ Error general:', error);
    } finally {
      setLoadingPdfId(null);
    }
  };

  // Últimos 10 libros añadidos
  const latestBooks = allBooks.slice(0, 10);

  return (
    <div className="space-y-8 pb-8">
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl shadow-2xl p-8 text-white">
        <div className="flex items-center space-x-3 mb-3">
          <Library size={40} className="text-teal-100" />
          <h1 className="text-4xl font-extrabold">
            Bienvenido a la Biblioteca Digital
          </h1>
        </div>
        <p className="text-teal-100 text-lg">
          Explora todos los libros de universidades 
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

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total de Libros */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-teal-600 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                Libros Disponibles
              </p>
              <p className="text-4xl font-bold text-teal-700 mt-2">
                {isLoading ? (
                  <span className="animate-pulse">---</span>
                ) : (
                  stats.totalBooks
                )}
              </p>
            </div>
            <div className="bg-teal-100 rounded-full p-4">
              <BookOpen size={32} className="text-teal-600" />
            </div>
          </div>
        </div>

        {/* Categorías */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                Categorías
              </p>
              <p className="text-4xl font-bold text-purple-700 mt-2">
                {isLoading ? (
                  <span className="animate-pulse">--</span>
                ) : (
                  stats.categories
                )}
              </p>
            </div>
            <div className="bg-purple-100 rounded-full p-4">
              <Award size={32} className="text-purple-600" />
            </div>
          </div>
        </div>

        {/* Universidades */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-cyan-600 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                Universidades
              </p>
              <p className="text-4xl font-bold text-cyan-700 mt-2">
                {isLoading ? (
                  <span className="animate-pulse">--</span>
                ) : (
                  stats.universities
                )}
              </p>
            </div>
            <div className="bg-cyan-100 rounded-full p-4">
              <Building2 size={32} className="text-cyan-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Carrusel de Últimos Libros */}
      <div className="bg-white rounded-xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-teal-100 rounded-lg p-2">
              <Library size={24} className="text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Últimos Libros Agregados
            </h2>
          </div>
          <a
            href="/usuario/books"
            className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 font-semibold transition-colors"
          >
            <span>Ver todos</span>
            <ArrowRight size={20} />
          </a>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando libros...</p>
            </div>
          </div>
        ) : latestBooks.length === 0 ? (
          <div className="text-center py-16 px-4">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay libros disponibles
            </h3>
            <p className="text-gray-500">Vuelve pronto para ver nuevas adiciones</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex space-x-6 pb-4">
              {latestBooks.map((book, index) => (
                <div
                  key={`${book.id}-${book.universidadPropietaria}-${index}`}
                  className="flex-shrink-0 w-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Portada */}
                  <div className="relative h-64 w-full overflow-hidden bg-gray-200">
                    <img
                      src={getBookCoverUrl(book.portadaBase64)}
                      alt={`Portada de ${book.titulo}`}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = EMPTY_BOOK_DATA.portadaBase64;
                      }}
                    />
                    {/* Badge de Universidad */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                      <div className="flex items-center space-x-1">
                        {book.universidadPropietaria === 'UTL' ? (
                          <BookOpen size={14} className="text-teal-600" />
                        ) : (
                          <Globe size={14} className="text-green-600" />
                        )}
                        <span className="text-xs font-bold text-gray-800">
                          {book.universidadPropietaria}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Información */}
                  <div className="p-4 space-y-3">
                    <h4
                      className="text-lg font-bold text-gray-900 truncate"
                      title={book.titulo}
                    >
                      {book.titulo}
                    </h4>

                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Género:</span>{' '}
                      {book.generoLiterario || 'Sin clasificar'}
                    </p>

                    <button
                      onClick={() => handleViewPdf(book)}
                      disabled={loadingPdfId === book.id}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-sm font-bold rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all shadow-md disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                      {loadingPdfId === book.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Cargando...</span>
                        </>
                      ) : (
                        <>
                          <FileText size={16} />
                          <span>Leer Ahora</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {latestBooks.length > 0 && (
          <p className="text-xs text-gray-500 mt-4 text-center">
            Desliza horizontalmente para ver más libros →
          </p>
        )}
      </div>

      {/* CTA para explorar más */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-xl p-8 text-white text-center">
        <h3 className="text-2xl font-bold mb-3">¿Buscas algo específico?</h3>
        <p className="text-purple-100 mb-6">
          Explora nuestra colección completa con filtros avanzados
        </p>
        <a
          href="/usuario/books"
          className="inline-flex items-center space-x-2 bg-white text-purple-600 font-bold px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors shadow-lg"
        >
          <BookOpen size={20} />
          <span>Explorar Catálogo Completo</span>
        </a>
      </div>
    </div>
  );
};

export default Home;