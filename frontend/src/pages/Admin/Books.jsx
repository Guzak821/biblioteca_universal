import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Trash2, Edit, FileText, Plus, Search, X, Upload } from 'lucide-react';

// --- CONFIGURACIÓN DE LA API (Asumimos NestJS está en puerto 3000) ---
//const API_BASE_URL = 'http://localhost:3000/api/libros'; 
const API_BASE_URL = 'http://192.168.137.11:3003/api/libros';

// RUTA EXPLICITA Y CORREGIDA para evitar conflicto de caché/enrutamiento
const PDF_API_URL = `${API_BASE_URL}/file/pdf`; 

// Modelo de datos para inicializar formularios vacíos
const EMPTY_BOOK_DATA = {
    titulo: '',
    generoLiterario: '',
    portadaBase64: 'https://placehold.co/50x70/087990/ffffff?text=PORTADA', 
    pdfBase64: '', 
    pdfFileName: '', 
    universidadPropietaria: 'UTL', 
};

// --- FUNCIÓN AUXILIAR: BASE64 a Blob (para visualizar PDF) ---
const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    // Si la data viene con el prefijo, lo removemos
    const base64 = b64Data.startsWith('data:') ? b64Data.split(',')[1] : b64Data;
    
    // Decodificación y creación del Blob
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
    return EMPTY_BOOK_DATA.portadaBase64; 
};


// --- MODAL DE CONFIRMACIÓN (Usado solo para Eliminación) ---
const ConfirmationModal = ({ show, title, message, onConfirm, onCancel, confirmText = 'Aceptar', cancelText = 'Cancelar' }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 space-y-4">
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button 
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${title.includes('Eliminación') ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- MODAL ÚNICO: BookFormModal (Registro y Edición) ---
const BookFormModal = ({ show, onClose, book, onSave, isNew, onPdfView }) => {
    
    // Al abrir el modal, inicializamos el estado (el Base64 de archivos nuevos es VOLÁTIL)
    const initialData = useMemo(() => {
        const data = book && book.id ? book : EMPTY_BOOK_DATA;
        return {
            ...data,
            // pdfFileName siempre se resetea al abrir para reflejar un archivo nuevo
            pdfFileName: (book && book.pdfBase64) ? 'Archivo Existente' : '',
        };
    }, [book]);

    const [formData, setFormData] = useState(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const fileInputRef = useRef(null); 
    const coverInputRef = useRef(null); 
    
    const modalTitle = isNew ? 'Registrar Nuevo Libro Interno' : `Editar Libro: ${book?.titulo}`;
    const buttonText = isNew ? 'Registrar Libro' : 'Guardar Cambios';

    useEffect(() => {
        if (show) {
            setFormData(initialData);
            setError(null);
        }
    }, [show, initialData]); 

    if (!show) return null;
    
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    // LÓGICA DE SUBIDA DE PORTADA (BASE64)
    const handleCoverFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        // Validación de tipo
        if (!file.type.startsWith('image/')) {
            setError("Solo se permiten archivos de imagen para la portada (JPEG, PNG, etc.).");
            return;
        }

        // Validación de tamaño: Limitar a 500KB
        const MAX_SIZE = 500 * 1024; 
        if (file.size > MAX_SIZE) {
            setError("La imagen de portada es demasiado grande (máx. 500KB).");
            return;
        }

        setError(null);
        
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ 
                ...prev, 
                portadaBase64: reader.result 
            }));
        };
        reader.onerror = () => {
            setError("Error al leer el archivo de portada.");
        };
        reader.readAsDataURL(file);
    };

    // LÓGICA DE SUBIDA DE PDF REAL (BASE64)
    const handlePdfFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setError("Solo se permiten archivos PDF.");
            setFormData(prev => ({ ...prev, pdfBase64: '', pdfFileName: '' }));
            return;
        }

        setError(null);
        
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result.split(',')[1]; 
            setFormData(prev => ({ 
                ...prev, 
                pdfBase64: base64String,
                pdfFileName: file.name
            }));
        };
        reader.onerror = () => {
            setError("Error al leer el archivo PDF.");
            setFormData(prev => ({ ...prev, pdfBase64: '', pdfFileName: '' }));
        };
        reader.readAsDataURL(file);
    };

    // --- MANEJADOR DE ENVÍO: ÚNICO PUNTO DE PERSISTENCIA ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.titulo || !formData.generoLiterario) {
            setError("Los campos Título y Género son obligatorios.");
            return;
        }
        
        // El PDF debe estar presente al crear un nuevo libro
        if (isNew && !formData.pdfBase64) {
             setError("Debe subir un archivo PDF para registrar un nuevo libro.");
             return;
        }

        setIsSaving(true);
        try {
            // Llama a la API para guardar en la DB
            await onSave(formData, isNew); 
            onClose(); // Cierra SÓLO si el guardado fue exitoso
        } catch (err) {
            console.error(`Error al guardar libro:`, err);
            throw err; 
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleViewPdfClick = () => {
        onPdfView(formData);
    };

    // Determina el estado del PDF
    const pdfLoaded = formData.pdfBase64 && formData.pdfBase64 !== EMPTY_BOOK_DATA.pdfBase64;
    const pdfStatusText = pdfLoaded 
        ? (formData.pdfFileName || 'PDF Cargado Existente')
        : 'PENDIENTE DE SUBIDA';

    // Determina si se ha cargado una portada (no es el placeholder)
    const coverLoaded = formData.portadaBase64 && formData.portadaBase64 !== EMPTY_BOOK_DATA.portadaBase64;


    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex justify-center items-center p-4">
            
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto p-6">
                <button
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                    disabled={isSaving}
                >
                    <X size={20} />
                </button>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
                    {modalTitle}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="p-3 bg-red-100 text-red-700 text-sm rounded-lg">{error}</div>}
                    
                    {/* Campos de metadata */}
                    <div>
                        <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título</label>
                        <input
                            type="text"
                            id="titulo"
                            name="titulo"
                            value={formData.titulo || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                            value={formData.generoLiterario || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Ej: Matemáticas, Biología"
                            disabled={isSaving}
                        />
                    </div>
                    
                    {/* --- Manejo de Archivos (PORTADA) --- */}
                    <div className="bg-white p-4 rounded-lg space-y-3 border border-dashed border-gray-300 shadow-inner">
                        <p className="font-semibold text-gray-700 flex items-center space-x-2">
                             <span>Imagen de Portada (Opcional):</span>
                             {coverLoaded && <span className="text-xs font-normal text-green-600">Cargada</span>}
                        </p>
                        
                        <div className="flex items-start space-x-4">
                            <img 
                                src={getBookCoverUrl(formData.portadaBase64)} 
                                alt="Vista previa de portada" 
                                className="w-16 h-24 object-cover rounded-md border border-gray-300 shadow-md flex-shrink-0"
                            />
                            
                            <div className="flex-1 space-y-2">
                                <p className="text-xs text-gray-500">
                                    Sube una imagen (JPG/PNG, máx. 500KB) para la portada del libro.
                                </p>
                                <input 
                                    type="file" 
                                    id="cover-upload" 
                                    accept="image/*" 
                                    onChange={handleCoverFileChange} 
                                    className="hidden" 
                                    ref={coverInputRef} 
                                    disabled={isSaving}
                                />
                                <button
                                    type="button"
                                    onClick={() => coverInputRef.current.click()} 
                                    className="flex items-center justify-center space-x-1 px-3 py-2 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 shadow-md"
                                    disabled={isSaving}
                                >
                                    <Upload size={16} />
                                    <span>Subir Portada</span>
                                </button>
                            </div>
                        </div>
                    </div>


                    {/* --- Manejo de Archivos (PDF REAL) --- */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3 border border-dashed border-gray-200">
                        <p className="font-semibold text-gray-700">Archivo PDF del Libro:</p>
                        
                        <div className="text-sm text-gray-600 flex justify-between items-center">
                            <span>Estado:</span>
                            <span title={pdfStatusText} className={`font-mono text-xs p-1 px-3 rounded-full max-w-[60%] truncate ${pdfLoaded ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {pdfStatusText}
                            </span>
                        </div>
                        
                        <div className="flex justify-between items-center space-x-2">
                            {/* Input real, oculto, activado por el botón */}
                            <input 
                                type="file" 
                                id="pdf-upload" 
                                accept="application/pdf" 
                                onChange={handlePdfFileChange} 
                                className="hidden" 
                                ref={fileInputRef}
                                disabled={isSaving}
                            />

                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()} 
                                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-md"
                                disabled={isSaving}
                            >
                                <Upload size={16} />
                                <span>Subir/Actualizar PDF</span>
                            </button>
                            
                            {/* Ver PDF Actual (si existe) */}
                            {pdfLoaded && (
                                <button
                                    type="button"
                                    onClick={handleViewPdfClick}
                                    className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 shadow-md flex items-center justify-center space-x-1"
                                    disabled={isSaving}
                                >
                                    <FileText size={16} />
                                    <span>Ver PDF Actual</span>
                                </button>
                            )}
                        </div>
                        
                        {!pdfLoaded && !isNew && (
                            <p className="text-xs text-red-500 mt-2">Advertencia: Este libro no tiene contenido PDF cargado en el servidor.</p>
                        )}
                    </div>
                    
                    {/* Pie de página con botones */}
                    <div className="pt-4 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose} 
                            className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100"
                            disabled={isSaving}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="inline-flex justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-indigo-700 disabled:opacity-50"
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


// --- COMPONENTE DE TABLA Y ACCIONES (Sin cambios funcionales, solo se incluye para la unicidad del archivo) ---

const TablaLibros = ({ books, onEdit, onDelete, onViewPdf, searchTerm }) => (
    <div className="w-full overflow-x-auto border border-gray-300 rounded-xl shadow-lg bg-white">
        <table className="min-w-full table-auto border-collapse"> 
            <thead>
                <tr className="bg-gray-800 text-white">
                    <th className="px-3 py-3 text-sm font-semibold uppercase w-20 rounded-tl-xl">PORTADA</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase w-1/3">TÍTULO DEL LIBRO</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase w-1/6">UNIVERSIDAD</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase w-1/6">GÉNERO</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold uppercase w-48 rounded-tr-xl">ACCIONES</th>
                </tr>
            </thead>
            <tbody>
                {books.length === 0 ? (
                    <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500 bg-white text-lg">
                            {searchTerm ? 
                                `No se encontraron libros internos que coincidan con "${searchTerm}".` : 
                                'No hay libros internos registrados. ¡Presiona "Agregar Libro" para comenzar!'}
                        </td>
                    </tr>
                ) : (
                    books.map((book) => (
                        <tr 
                            key={book.id} 
                            className="border-b border-gray-200 last:border-b-0 even:bg-gray-50 hover:bg-indigo-50 transition-colors"
                        >
                            {/* PORTADA */}
                            <td className="px-3 py-2 text-sm text-gray-900 flex justify-center items-center h-20"> 
                                <img 
                                    src={getBookCoverUrl(book.portadaBase64)} 
                                    alt={`Portada de ${book.titulo}`} 
                                    className="h-16 w-12 object-cover rounded-md border border-gray-300 shadow-md flex-shrink-0"
                                    onError={(e) => { e.currentTarget.src = EMPTY_BOOK_DATA.portadaBase64; }} 
                                />
                            </td>
                            {/* TÍTULO */}
                            <td className="px-6 py-4 text-sm text-gray-900 font-semibold align-top"> 
                                {book.titulo}
                            </td>
                            {/* UNIVERSIDAD */}
                            <td className="px-6 py-4 text-sm text-gray-700 align-top">
                                {book.universidadPropietaria}
                            </td>
                            {/* GÉNERO */}
                            <td className="px-6 py-4 text-sm text-gray-700 align-top">
                                {book.generoLiterario}
                            </td>
                            {/* ACCIONES */}
                            <td className="px-6 py-4 text-sm align-top">
                                <div className="flex flex-col space-y-2 items-center">
                                    <button 
                                        onClick={() => onViewPdf(book)}
                                        disabled={!book.pdfBase64} 
                                        className="flex items-center justify-center space-x-1 px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors shadow-sm w-full font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        <FileText size={14} /> <span>Ver PDF</span>
                                    </button>
                                    <button 
                                        onClick={() => onEdit(book)}
                                        className="flex items-center justify-center space-x-1 px-3 py-1 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 transition-colors shadow-sm w-full font-medium"
                                    >
                                        <Edit size={14} /> <span>Actualizar</span>
                                    </button>
                                    <button 
                                        onClick={() => onDelete(book.id, book.titulo)}
                                        className="flex items-center justify-center space-x-1 px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors shadow-sm w-full font-medium"
                                    >
                                        <Trash2 size={14} /> <span>Eliminar</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    </div>
);


// --- COMPONENTE PRINCIPAL: App ---
const App = () => {
    const [allBooks, setAllBooks] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState(null); 

    // Estados del Modal de Formulario
    const [showFormModal, setShowFormModal] = useState(false);
    const [bookToEdit, setBookToEdit] = useState(null); 
    const [isEditing, setIsEditing] = useState(false); 
    
    // NO SE USA EL ESTADO DE 'IS DIRTY'
    // const [isFormDirtyWithFiles, setIsFormDirtyWithFiles] = useState(false); 

    // Estados del Modal de Confirmación (Eliminación)
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');

    // Función para mostrar mensajes de estado temporalmente
    const displayStatus = (message, type = 'success') => {
        setStatusMessage({ message, type });
        setTimeout(() => setStatusMessage(null), 4000);
    };

     
    // --- MANEJO DE LA API REST ---
    
    // 1. Carga Inicial (GET /api/libros)
    const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    try {
        const url = searchTerm.trim()
            ? `${API_BASE_URL}/search?filtro=${encodeURIComponent(searchTerm)}`
            : `${API_BASE_URL}/search?filtro=`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Error al obtener libros del API.");

        const data = await response.json();
        setAllBooks(data);

    } catch (error) {
        console.error("Error al cargar libros:", error);
        displayStatus('No se pudieron cargar los libros.', 'error');
    } finally {
        setIsLoading(false);
    }
}, [searchTerm]);


    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    // 2. Lógica de Filtrado (en Frontend)
    const filteredBooks = useMemo(() => {
        if (searchTerm.trim() === '') return allBooks;

        const lowerCaseSearch = searchTerm.toLowerCase().trim();
        return allBooks.filter(book => 
            (book.titulo?.toLowerCase() || '').includes(lowerCaseSearch) ||
            (book.generoLiterario?.toLowerCase() || '').includes(lowerCaseSearch) ||
            (book.universidadPropietaria?.toLowerCase() || '').includes(lowerCaseSearch)
        );
    }, [allBooks, searchTerm]);


    // 3. Registro y Edición (POST/PUT /api/libros)
    const handleSaveBook = async (bookData, isNew) => {
        const method = isNew ? 'POST' : 'PUT';
        const url = isNew ? `${API_BASE_URL}` : `${API_BASE_URL}/${bookData.id}`;
        
        const dataToSend = { ...bookData };
        delete dataToSend.pdfFileName;
        
        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(errorBody.message || `Error al ${isNew ? 'registrar' : 'actualizar'} libro.`);
            }
            
            const result = await response.json();
            const savedBook = result.data; 

            if (isNew) {
                setAllBooks(prev => [...prev, savedBook]); 
                displayStatus(`Libro "${savedBook.titulo}" registrado exitosamente.`);
            } else {
                setAllBooks(prev => prev.map(b => (b.id === savedBook.id ? savedBook : b)));
                displayStatus(`Libro "${savedBook.titulo}" actualizado exitosamente.`);
            }

        } catch (error) {
            console.error("Error en handleSaveBook:", error);
            displayStatus(error.message || `Error desconocido al ${isNew ? 'registrar' : 'actualizar'} el libro.`, 'error');
            throw error; 
        }
    };

    // 4. Lógica para el modal de confirmación
    const handleDeleteConfirmation = (bookId, bookTitle) => {
        setBookToDelete({ id: bookId, titulo: bookTitle });
        setShowConfirmModal(true);
    };
    
    // 5. Eliminación (DELETE /api/libros/:id)
    const handleDeleteFinal = async () => {
        if (!bookToDelete) return;

        setShowConfirmModal(false);

        try {
            const response = await fetch(`${API_BASE_URL}/${bookToDelete.id}`, { 
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(errorBody.message || 'Error al eliminar libro.');
            }

            setAllBooks(prev => prev.filter(b => b.id !== bookToDelete.id));
            displayStatus(`Libro "${bookToDelete.titulo}" eliminado exitosamente.`);
            setBookToDelete(null);

        } catch (error) {
            console.error("Error al eliminar:", error);
            displayStatus(error.message || "Error al eliminar el libro.", 'error');
            setBookToDelete(null);
        }
    };
    
    // 6. Visualizar PDF (GET /api/libros/file/pdf) 
    const handleViewPdf = async (book) => {
        
        // Carga local (dentro del modal)
        if (book.pdfBase64 && book.pdfBase64 !== '' && !book.id) {
            try {
                const pdfBlob = b64toBlob(book.pdfBase64, 'application/pdf');
                const pdfUrl = URL.createObjectURL(pdfBlob);
                window.open(pdfUrl, '_blank');
                return;
            } catch (e) {
                console.error("Error al decodificar PDF local:", e);
                displayStatus("Error al decodificar el PDF local. Intente subirlo de nuevo.", 'error');
                return;
            }
        }
        
        // Búsqueda en el servidor
        if (!book.id) {
            displayStatus('El PDF solo puede visualizarse si el libro ya está guardado en el servidor.', 'warning');
            return;
        }

        try {
            const params = new URLSearchParams({
                id: book.id.toString(),
                universidad: book.universidadPropietaria,
                external: 'false', 
            });

            // UTILIZAMOS LA CONSTANTE EXPLICITA Y CORREGIDA
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

    // --- Handlers para abrir el modal ---
    const handleEditClick = (book) => {
        setBookToEdit(book);
        setIsEditing(true);
        setShowFormModal(true);
    };

    const handleCloseFormModal = () => {
        setShowFormModal(false);
        setBookToEdit(null);
        setIsEditing(false);
    }


    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            <header className="bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold text-gray-900">
                        Sistema Bibliotecario UTL
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Gestión interna de libros (CRUD) y visualización de catálogo.
                    </p>
                </div>
            </header>

            <div className="w-full space-y-6 px-4 py-8 max-w-7xl mx-auto">
                
                {/* Mensajes de Estado (Éxito/Error) */}
                {statusMessage && (
                    <div 
                        className={`p-4 rounded-lg shadow-md ${statusMessage.type === 'error' ? 'bg-red-100 text-red-800 border-red-300' : statusMessage.type === 'warning' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 'bg-green-100 text-green-800 border-green-300'} border`}
                        role="alert"
                    >
                        {statusMessage.message}
                    </div>
                )}

                {/* Encabezado de la Tabla y Acciones */}
                <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Catálogo Interno ({allBooks.length})
                    </h2>
                    <button 
                        onClick={() => {
                            setBookToEdit(EMPTY_BOOK_DATA); 
                            setIsEditing(false);
                            setShowFormModal(true);
                        }} 
                        className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-150 shadow-lg"
                    >
                        <Plus size={20} />
                        <span>Agregar Libro</span>
                    </button>
                </div>

                {/* Barra de Búsqueda y Filtros */}
                <div className="w-full bg-white p-4 rounded-xl shadow-md flex items-center space-x-3">
                    <Search size={20} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por título, género o universidad..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border-none rounded focus:outline-none focus:ring-0 text-gray-700"
                    />
                </div>

                {/* Tabla de libros */}
                {isLoading ? (
                    <div className="h-64 flex items-center justify-center text-indigo-500 border border-dashed border-gray-300 rounded-xl bg-white shadow-md">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Cargando catálogo de libros...
                    </div>
                ) : (
                    <TablaLibros
                        books={filteredBooks}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteConfirmation}
                        onViewPdf={handleViewPdf}
                        searchTerm={searchTerm}
                    />
                )}
                
                {/* MODAL DE REGISTRO/EDICIÓN */}
                <BookFormModal
                    show={showFormModal}
                    onClose={handleCloseFormModal}
                    book={bookToEdit} 
                    onSave={handleSaveBook}
                    isNew={!isEditing}
                    onPdfView={handleViewPdf}
                />

                {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
                <ConfirmationModal
                    show={showConfirmModal}
                    title="Confirmar Eliminación"
                    message={`¿Estás seguro de que deseas eliminar permanentemente el libro "${bookToDelete?.titulo}"? Esta acción no se puede deshacer.`}
                    onConfirm={handleDeleteFinal}
                    onCancel={() => {
                        setShowConfirmModal(false);
                        setBookToDelete(null);
                    }}
                />
            </div>
        </div>
    );
};

export default App;