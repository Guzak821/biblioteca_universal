import React, { useState, useEffect, useMemo } from 'react';
// RUTA CORREGIDA: Usando la ruta absoluta proporcionada por el usuario.
import { LibroController } from '/Users/Lenovo/Desktop/VS/proyecto_arquitectura/biblioteca_universal/backend/src/controller/LibroController'; 

// --- 1. CONFIGURACIÓN E INSTANCIAS ---

const LibroControllerInstance = new LibroController();

// Modelo de datos para inicializar formularios vacíos
const EMPTY_BOOK_DATA = {
    titulo: '',
    generoLiterario: '',
    // Usaremos esta URL placeholder como mock para que la imagen se vea
    portadaBase64: 'https://placehold.co/50x70/087990/ffffff?text=PORTADA', 
    pdfBase64: 'base64_placeholder_pdf', 
    universidadPropietaria: 'UTL', // Asumimos UTL es la interna
};

// --- FUNCIÓN AUXILIAR: BASE64 a Blob (para visualizar PDF) ---
const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
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
    // Si parece una URL, la usamos directamente
    if (base64OrUrl && base64OrUrl.startsWith('http')) {
        return base64OrUrl;
    }
    // Si es un mock Base64, devolvemos un placeholder visual
    return EMPTY_BOOK_DATA.portadaBase64; 
};


// --- 2. MODAL ÚNICO: BookFormModal (Registro y Edición) ---

const BookFormModal = ({ show, onClose, book, onSave, isNew, onPdfView }) => {
    // Es crucial que el initialData esté fuera del useState o que se maneje con useEffect si el prop 'book' cambia
    const initialData = book && book.id ? book : EMPTY_BOOK_DATA; 
    const [formData, setFormData] = useState(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    
    const modalTitle = isNew ? 'Registrar Nuevo Libro Interno' : `Editar Libro: ${book?.titulo}`;
    const buttonText = isNew ? 'Registrar Libro' : 'Guardar Cambios';

    // Este useEffect asegura que el formulario se resetee o cargue nuevos datos cuando el modal se abre/cambia el libro
    useEffect(() => {
        if (show) {
            setFormData(isNew && !book?.id ? EMPTY_BOOK_DATA : book);
            setError(null);
        }
    }, [show, isNew, book]); 

    if (!show) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.titulo || !formData.generoLiterario) {
            setError("Los campos Título y Género son obligatorios.");
            return;
        }

        setIsSaving(true);
        try {
            onSave(formData, isNew); 
            onClose();
        } catch (err) {
            console.error(`Error al guardar libro:`, err);
            setError(`Error al guardar. Intente de nuevo.`);
        } finally {
            setIsSaving(false);
        }
    };
    
    // Función para ver el PDF (llamada al handler del componente Books)
    const handleViewPdfClick = () => {
        onPdfView(formData);
    };


    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto p-6">
                
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
                    {modalTitle}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    
                    {/* Campos de metadata */}
                    <div>
                        <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título</label>
                        <input
                            type="text"
                            id="titulo"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Ej: Álgebra de Baldor"
                            disabled={isSaving}
                        />
                    </div>

                    <div>
                        <label htmlFor="generoLiterario" className="block text-sm font-medium text-gray-700">Género Literario</label>
                        <input
                            type="text"
                            id="generoLiterario"
                            name="generoLiterario"
                            value={formData.generoLiterario}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Ej: Matemáticas, Biología"
                            disabled={isSaving}
                        />
                    </div>

                    {/* Simulación de PDF y Portada (Uploadthing) */}
                    <div className="bg-gray-50 p-4 rounded-md space-y-3">
                        <p className="font-medium text-gray-700">Archivos del Libro (Simulación Uploadthing):</p>
                        
                        {/* Indicador de Archivo (Simulación) */}
                        <div className="text-sm text-gray-600 flex justify-between items-center">
                            <span>Estado del PDF:</span>
                            <span className={`font-mono text-xs p-1 rounded ${formData.pdfBase64 !== EMPTY_BOOK_DATA.pdfBase64 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {formData.pdfBase64 !== EMPTY_BOOK_DATA.pdfBase64 ? 'PDF Cargado' : 'PENDIENTE'}
                            </span>
                        </div>
                        
                        {/* Botones de acción de archivos */}
                        <div className="flex justify-between items-center">
                            <button
                                type="button"
                                // Esto simularía la apertura del diálogo de subida de Uploadthing
                                onClick={() => alert('Simulando subida de PDF (Uploadthing) \n - La URL resultante se guardaría en pdfBase64 -')}
                                className="px-3 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
                                disabled={isSaving}
                            >
                                Subir/Actualizar PDF
                            </button>
                            
                            {/* Ver PDF Actual (si existe) */}
                            {!isNew && (
                                <button
                                    type="button"
                                    onClick={handleViewPdfClick}
                                    className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                                    disabled={!book?.pdfBase64 || isSaving}
                                >
                                    Ver PDF Actual
                                </button>
                            )}
                        </div>
                    </div>
                    
                    {/* Pie de página con botones */}
                    <div className="pt-4 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                            disabled={isSaving}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
                            disabled={isSaving}
                        >
                            {isSaving ? 'Guardando...' : buttonText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- 3. COMPONENTE DE TABLA Y ACCIONES ---

const TablaLibros = ({ books, onEdit, onDelete, onViewPdf, searchTerm }) => (
    <div className="w-full overflow-hidden border border-gray-300 rounded-lg shadow-md">
        <table className="min-w-full table-fixed border-collapse"> 
            <thead>
                <tr className="bg-gray-700 text-white">
                    <th className="px-3 py-3 text-sm font-semibold uppercase w-20">PORTADA</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase w-1/3">TÍTULO DEL LIBRO</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase w-1/6">UNIVERSIDAD</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase w-1/6">GÉNERO</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold uppercase w-48">ACCIONES</th>
                </tr>
            </thead>
            <tbody>
                {books.length === 0 && (
                    <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500 bg-white">
                            No hay libros internos registrados que coincidan con "{searchTerm}".
                        </td>
                    </tr>
                )}
                {books.map((book) => (
                    <tr 
                        key={book.id} 
                        className="even:bg-gray-100 odd:bg-white hover:bg-indigo-50 transition-colors"
                    >
                        {/* RENDERIZADO DE LA IMAGEN DE PORTADA */}
                        <td className="px-3 py-2 text-sm text-gray-900 flex justify-center items-center h-20"> 
                            <img 
                                src={getBookCoverUrl(book.portadaBase64)} 
                                alt={`Portada de ${book.titulo}`} 
                                className="h-16 w-12 object-cover rounded shadow-md border border-gray-200"
                                // Fallback en caso de que la URL mock falle
                                onError={(e) => { e.target.src = 'https://placehold.co/50x70/aaaaaa/ffffff?text=N/A'; }} 
                            />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium align-top"> 
                            {book.titulo}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 align-top">
                            {book.universidadPropietaria}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 align-top">
                            {book.generoLiterario}
                        </td>
                        {/* CELDA DE ACCIONES: Usar flex para centrar los botones */}
                        <td className="px-6 py-4 text-sm align-top">
                            <div className="flex flex-col space-y-2 items-center">
                                <button 
                                    onClick={() => onViewPdf(book)}
                                    className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors shadow-sm w-full"
                                >
                                    Ver PDF
                                </button>
                                <button 
                                    onClick={() => onEdit(book)}
                                    className="px-3 py-1 bg-indigo-500 text-white text-xs rounded hover:bg-indigo-600 transition-colors shadow-sm w-full"
                                >
                                    Actualizar
                                </button>
                                <button 
                                    onClick={() => onDelete(book.id, book.titulo)}
                                    className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors shadow-sm w-full"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


// --- 4. COMPONENTE PRINCIPAL: Books ---

const Books = () => {
    const [allBooks, setAllBooks] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    
    const [showFormModal, setShowFormModal] = useState(false);
    const [bookToEdit, setBookToEdit] = useState(null); 
    const [isEditing, setIsEditing] = useState(false); 

    const [searchTerm, setSearchTerm] = useState('');

    const fetchBooks = async () => {
        setIsLoading(true);
        try {
            const internalBooks = await new Promise(resolve => setTimeout(() => resolve(LibroControllerInstance.findAllInternalBooks()), 100));
            setAllBooks(internalBooks);
        } catch (error) {
            console.error("Error al cargar libros:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const filteredBooks = useMemo(() => {
        if (searchTerm.trim() === '') return allBooks;

        const lowerCaseSearch = searchTerm.toLowerCase().trim();
        return allBooks.filter(book => 
            book.titulo.toLowerCase().includes(lowerCaseSearch) ||
            book.generoLiterario.toLowerCase().includes(lowerCaseSearch)
        );
    }, [allBooks, searchTerm]);


    const handleSaveBook = (bookData, isNew) => {
        if (isNew) {
            const newBook = LibroControllerInstance.handleRegisterBook(bookData);
            setAllBooks(prev => [...prev, newBook]);
        } else {
            const updatedBook = LibroControllerInstance.handleEditBook(bookData);
            setAllBooks(prev => prev.map(b => (b.id === updatedBook.id ? updatedBook : b)));
        }
    };

    const handleEditClick = (book) => {
        setBookToEdit(book);
        setIsEditing(true);
        setShowFormModal(true);
    };

    const handleDeleteClick = (bookId, bookTitle) => {
        if (window.confirm(`¿Estás seguro de eliminar el libro "${bookTitle}"?`)) {
            try {
                LibroControllerInstance.handleDeleteBook(bookId);
                setAllBooks(prev => prev.filter(b => b.id !== bookId));
                console.log(`Libro ${bookTitle} eliminado.`);
            } catch (error) {
                alert("Error al eliminar el libro.");
                console.error("Error al eliminar:", error);
            }
        }
    };
    
    const handleViewPdf = async (book) => {
        try {
            const pdfBase64 = await LibroControllerInstance.handleGetPdf(
                book.id.toString(), 
                book.universidadPropietaria, 
                false
            );

            if (pdfBase64) {
                const pdfBlob = b64toBlob(pdfBase64, 'application/pdf');
                const pdfUrl = URL.createObjectURL(pdfBlob);
                window.open(pdfUrl, '_blank');
            } else {
                alert('PDF no disponible o el archivo mock está vacío.');
            }
        } catch (error) {
            alert('Ocurrió un error al intentar ver el PDF.');
            console.error("Error al ver PDF:", error);
        }
    };


    return (
        <div className="w-full space-y-6 px-4 py-8">
            
            {/* Encabezado y Botón de Agregar Libro */}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800">
                    Gestión de Libros Internos
                </h2>
                <button 
                    onClick={() => {
                        setBookToEdit(EMPTY_BOOK_DATA); 
                        setIsEditing(false);
                        setShowFormModal(true);
                    }} 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-150 shadow-md">
                    + Agregar Libro
                </button>
            </div>

            {/* Barra de Búsqueda y Filtros */}
            <div className="w-full bg-white p-4 rounded-lg shadow-md">
                <input
                    type="text"
                    placeholder="Buscar por título o género..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {/* Tabla de libros */}
            {isLoading ? (
                 <div className="h-64 flex items-center justify-center text-indigo-500 border border-dashed border-gray-300 rounded-lg">
                    Cargando catálogo de libros...
                </div>
            ) : (
                <TablaLibros
                    books={filteredBooks}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    onViewPdf={handleViewPdf}
                    searchTerm={searchTerm}
                />
            )}
            
            {/* MODAL DE REGISTRO/EDICIÓN */}
            <BookFormModal
                show={showFormModal}
                onClose={() => {
                    setShowFormModal(false);
                    setBookToEdit(null);
                    setIsEditing(false);
                }}
                book={bookToEdit} 
                onSave={handleSaveBook}
                isNew={!isEditing}
                onPdfView={handleViewPdf}
            />

            {/* Paginación (Placeholder) */}
            <div className="flex justify-center items-center space-x-3 py-6">
                 {/* ... (botones de paginación) ... */}
            </div>
        </div>
    );
};

export default Books;