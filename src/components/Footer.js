import React from 'react';
import { 
  Dumbbell, 
  ExternalLink, 
  Target,
  BookOpen,
  Download,
  Heart,
  Zap,
  Trophy,
  Timer,
  Activity,
  Coffee
} from 'lucide-react';

const Footer = ({ setActiveSection }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-600 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-12">
        
        <div className="text-center mb-12 py-6 border-y border-orange-500/20">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Zap className="text-orange-400" size={24} />
            <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              NO PAIN, NO GAIN
            </h3>
            <Zap className="text-orange-400" size={24} />
          </div>
          <p className="text-gray-300 font-medium">La transformación comienza HOY</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-lg transform rotate-3 hover:rotate-6 transition-transform">
                  <Dumbbell className="text-white" size={24} />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-wide">RAIN & GRIND</h3>
                <p className="text-xs text-orange-400 font-bold uppercase tracking-widest">Fitness Revolution</p>
              </div>
            </div>
            <p className="text-gray-300 font-medium mb-4">
              Rutinas gratuitas basadas en CIENCIA 🔬
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-green-400">
                <Heart size={16} fill="currentColor" />
                <span className="text-sm font-bold">100% GRATIS</span>
              </div>
              <div className="flex items-center space-x-1 text-orange-400">
                <Trophy size={16} />
                <span className="text-sm font-bold">RESULTADOS</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-orange-400 font-black mb-6 tracking-wide flex items-center space-x-2">
              <Target size={20} />
              <span>ENTRENA AHORA</span>
            </h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => setActiveSection('routines')}
                  className="group flex items-center space-x-2 text-gray-300 hover:text-orange-400 transition-all cursor-pointer"
                >
                  <span className="text-orange-500 group-hover:translate-x-1 transition-transform">→</span>
                  <Dumbbell size={16} className="text-gray-500 group-hover:text-orange-400" />
                  <span className="font-medium">Rutinas de Entrenamiento</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveSection('nutrition')}
                  className="group flex items-center space-x-2 text-gray-300 hover:text-orange-400 transition-all cursor-pointer"
                >
                  <span className="text-orange-500 group-hover:translate-x-1 transition-transform">→</span>
                  <Activity size={16} className="text-gray-500 group-hover:text-orange-400" />
                  <span className="font-medium">Nutrición y Dietas</span>
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-orange-400 font-black mb-6 tracking-wide flex items-center space-x-2">
              <Timer size={20} />
              <span>TU PROGRESO</span>
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-orange-500/20 to-orange-500/10 p-4 rounded-lg border border-orange-500/30">
                <p className="text-2xl font-black text-orange-400">24/7</p>
                <p className="text-xs text-gray-400 font-medium">Acceso Total</p>
              </div>
              <div className="bg-gradient-to-br from-green-500/20 to-green-500/10 p-4 rounded-lg border border-green-500/30">
                <p className="text-2xl font-black text-green-400">100%</p>
                <p className="text-xs text-gray-400 font-medium">Efectivo</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/10 p-4 rounded-lg border border-blue-500/30">
                <p className="text-2xl font-black text-blue-400">365</p>
                <p className="text-xs text-gray-400 font-medium">Días al Año</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 p-4 rounded-lg border border-purple-500/30">
                <p className="text-2xl font-black text-purple-400">∞</p>
                <p className="text-xs text-gray-400 font-medium">Potencial</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-orange-500/20 pt-8">
          <div className="text-center mb-6">
            <a 
              href="https://buymeacoffee.com/rainandgrind" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/50"
            >
              <Coffee size={20} />
              <span>☕ Apoya mi trabajo</span>
              <Heart size={16} className="text-red-200" />
            </a>
            <p className="text-gray-400 text-xs mt-2">
              Si te ayudaron las rutinas, invítame un café ☕
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            <div className="text-gray-400 text-sm flex items-center space-x-2">
              <p>© {currentYear} Rain & Grind</p>
              <span className="text-orange-400">•</span>
              <p className="flex items-center space-x-1">
                <span>Siempre</span>
                <span className="text-green-400 font-bold">GRATIS</span>
                <span>💪</span>
              </p>
            </div>

            <div className="flex items-center space-x-2 text-gray-500 text-xs">
              <ExternalLink size={14} />
              <p>Consulta un profesional • Solo fines educativos</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;