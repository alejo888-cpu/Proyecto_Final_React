const Header = () => {
  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 border-b flex-shrink-0">
      <h2 className="text-lg font-semibold text-gray-800">Título</h2>
      <nav className="flex gap-6 text-gray-600 text-sm">
        <a href="#" className="hover:text-gray-900">Opción 1</a>
        <a href="#" className="hover:text-gray-900">Opción 2</a>
        <a href="#" className="hover:text-gray-900">Opción 3</a>
        <a href="#" className="hover:text-gray-900">Salir</a>
      </nav>
    </header>
  );
};

export default Header;