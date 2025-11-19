import { useState } from 'react';

const Books = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Datos de ejemplo
  const [books] = useState([
    { id: 1, title: 'Libro 1', university: 'Universidad 1', genre: 'Género 1' },
    { id: 2, title: 'Libro 2', university: 'Universidad 2', genre: 'Género 2' },
    { id: 3, title: 'Libro 3', university: 'Universidad 3', genre: 'Género 3' },
    { id: 4, title: 'Libro 4', university: 'Universidad 1', genre: 'Género 2' },
  ]);

  return (
    <div className="w-full space-y-4">
      {/* Barra de búsqueda */}
      <div className="w-full bg-gray-400 px-6 py-8 rounded">
        <input
          type="text"
          placeholder="Buscar libros..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xl px-4 py-2 bg-white border-0 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>

      {/* Tabla de libros */}
      <div className="w-full overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase">
                LIBRO
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase">
                UNIVERSIDAD
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase">
                GÉNERO
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase">
                ACCIONES
              </th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr 
                key={book.id} 
                className={index % 2 === 0 ? 'bg-gray-200' : 'bg-gray-300'}
              >
                <td className="px-6 py-4 text-sm text-gray-900">
                  {book.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {book.university}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {book.genre}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button className="px-4 py-1 border border-gray-800 rounded text-gray-900 hover:bg-gray-400 transition-colors">
                    Leer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-center items-center space-x-3 py-6">
        <button className="w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-800 rounded hover:bg-gray-100 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-800 rounded hover:bg-gray-100 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Books;