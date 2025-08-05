import React from 'react';
import { 
  Menu, 
  X, 
  Dumbbell,
  BookOpen,
  Apple,
  Flame,
  Activity,
  ChefHat
} from 'lucide-react';

const Header = ({ activeSection, setActiveSection, mobileMenuOpen, setMobileMenuOpen }) => {
  const navItems = [
    { id: 'home', label: 'Inicio', icon: <Flame size={20} /> },
    { id: 'routines', label: 'Rutinas', icon: <Dumbbell size={20} /> },
    { id: 'recipes', label: 'Recetas Fitness', icon: <ChefHat size={20} /> },
    { id: 'nutrition', label: 'Nutrición', icon: <Apple size={20} /> },
    { id: 'sources', label: 'Ciencia', icon: <BookOpen size={20} /> },
  ];

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-sm border-b-2 border-orange-500/30 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-2 rounded-lg transform hover:scale-110 transition-transform animate-glow">
                <Dumbbell className="text-white animate-bounce" size={24} />
              </div>
              <Activity className="absolute -top-1 -right-1 text-green-400 animate-pulse" size={12} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-wide uppercase">Rain & Grind</h1>
              <p className="text-xs text-orange-400 font-bold -mt-1">TRANSFORM YOUR LIFE</p>
            </div>
          </div>

          <nav className="hidden md:flex space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/50'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50 border border-transparent hover:border-orange-500/50'
                }`}
              >
                {item.icon}
                <span className="font-semibold">{item.label}</span>
              </button>
            ))}
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-orange-400 hover:text-white hover:bg-orange-500/20 transition-all"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-800/95 backdrop-blur-sm rounded-lg mt-2 mb-4 p-4 border border-orange-500/20 animate-slideInRight">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-lg flex items-center space-x-3 mb-2 transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50 border border-transparent hover:border-orange-500/50'
                }`}
              >
                {item.icon}
                <span className="font-semibold">{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;