const Home = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Bienvenido a la Biblioteca Digital
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjeta de estadísticas o información */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Libros Disponibles
          </h2>
          <p className="text-4xl font-bold text-teal-700">150+</p>
        </div>

        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Categorías
          </h2>
          <p className="text-4xl font-bold text-teal-700">25</p>
        </div>

        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Universidades
          </h2>
          <p className="text-4xl font-bold text-teal-700">12</p>
        </div>
      </div>

      <div className="bg-gray-100 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Últimos Libros Agregados
        </h2>
        <p className="text-gray-600">
          Explora nuestra colección de libros digitales...
        </p>
      </div>
    </div>
  );
};

export default Home;