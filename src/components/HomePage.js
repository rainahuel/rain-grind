import React from 'react';
import { 
  Play, 
  BookOpen, 
  TrendingUp, 
  Download,
  Zap,
  Target,
  Flame,
  Trophy,
  Timer,
  Heart,
  Activity,
  ChevronRight
} from 'lucide-react';

const HomePage = ({ setActiveSection }) => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 py-20">
        <div className="text-center">
          <div className="mb-8 animate-fadeInUp">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Zap className="text-orange-400 animate-bounce" size={40} />
              <h1 className="text-6xl md:text-8xl font-black text-orange-400 tracking-wider animate-glow">
                RAIN & GRIND
              </h1>
              <Zap className="text-orange-400 animate-bounce" size={40} style={{animationDelay: '0.5s'}} />
            </div>
            <div className="h-2 w-48 bg-gradient-to-r from-orange-500 to-red-600 mx-auto mb-4 rounded-full"></div>
            <p className="text-orange-400 font-black text-2xl tracking-widest animate-pulse">
              NO EXCUSES • ONLY RESULTS
            </p>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-4xl mx-auto font-semibold leading-relaxed">
            Rutinas basadas en <span className="text-green-400 font-black">CIENCIA REAL</span>. 
            Sin marketing falso. Sin productos milagrosos. 
            Solo <span className="text-orange-400 font-black">HIERRO</span>, 
            <span className="text-red-500 font-black"> SUDOR</span> y 
            <span className="text-yellow-400 font-black"> RESULTADOS</span>.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-center mb-16 max-w-5xl mx-auto">
            <button 
              onClick={() => setActiveSection('routines')}
              className="group bg-gradient-to-r from-orange-500 to-red-600 px-8 py-6 rounded-xl font-black text-lg hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 tracking-wide transform"
            >
              <Flame className="animate-bounce" size={24} />
              <span>¡ENTRENA AHORA!</span>
              <ChevronRight className="group-hover:translate-x-2 transition-transform" size={20} />
            </button>
            
            <button 
              onClick={() => setActiveSection('recipes')}
              className="group px-8 py-6 rounded-xl font-black text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 tracking-wide transform"
              style={{
                background: 'linear-gradient(to right, #22c55e, #16a34a)',
                boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.5)'
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 25px 50px -12px rgba(34, 197, 94, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = '0 0 0 0 rgba(34, 197, 94, 0.5)';
              }}
            >
              <Heart className="animate-float" size={24} />
              <span>RECETAS FITNESS</span>
              <ChevronRight className="group-hover:translate-x-2 transition-transform" size={20} />
            </button>

            <button 
              onClick={() => setActiveSection('nutrition')}
              className="group bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6 rounded-xl font-black text-lg hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 tracking-wide transform"
            >
              <Target className="animate-pulse" size={24} />
              <span>NUTRICIÓN</span>
              <ChevronRight className="group-hover:translate-x-2 transition-transform" size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-orange-500/20 to-orange-500/10 p-6 rounded-xl border border-orange-500/30 transform hover:scale-105 transition-all">
              <Trophy className="text-orange-400 mx-auto mb-2" size={32} />
              <p className="text-3xl font-black text-orange-400">100%</p>
              <p className="text-sm text-gray-300 font-semibold">EFECTIVO</p>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-green-500/10 p-6 rounded-xl border border-green-500/30 transform hover:scale-105 transition-all">
              <Timer className="text-green-400 mx-auto mb-2" size={32} />
              <p className="text-3xl font-black text-green-400">24/7</p>
              <p className="text-sm text-gray-300 font-semibold">ACCESO</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/10 p-6 rounded-xl border border-blue-500/30 transform hover:scale-105 transition-all">
              <Target className="text-blue-400 mx-auto mb-2" size={32} />
              <p className="text-3xl font-black text-blue-400">365</p>
              <p className="text-sm text-gray-300 font-semibold">DÍAS AL AÑO</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 p-6 rounded-xl border border-purple-500/30 transform hover:scale-105 transition-all">
              <Activity className="text-purple-400 mx-auto mb-2" size={32} />
              <p className="text-3xl font-black text-purple-400">∞</p>
              <p className="text-sm text-gray-300 font-semibold">POTENCIAL</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-black/60 to-black/40 border-l-4 border-orange-500 p-6 mb-12 max-w-3xl mx-auto rounded-lg transform hover:scale-105 transition-all">
            <p className="text-orange-400 font-black text-xl mb-2">
              "El gimnasio no miente. Las pesas no tienen favoritos."
            </p>
            <p className="text-gray-300 font-semibold">
              Solo tú y el hierro. Sin atajos. Sin excusas. <span className="text-green-400">SOLO RESULTADOS.</span>
            </p>
          </div>
        </div>




        <div className="mt-12 bg-gradient-to-r from-red-900/30 to-red-800/20 border-2 border-red-500/50 rounded-xl p-8 text-center max-w-4xl mx-auto transform hover:scale-105 transition-all animate-glow">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <Flame className="text-red-500 animate-pulse" size={24} />
            <p className="text-red-400 font-black text-xl">ADVERTENCIA</p>
            <Flame className="text-red-500 animate-pulse" size={24} />
          </div>
          <p className="text-gray-200 font-semibold">
            Aquí encontrarás entrenamientos <span className="text-orange-400 font-black">REALES</span> que requieren <span className="text-red-500 font-black">ESFUERZO REAL</span>. 
            No hay atajos, no hay trucos mágicos. Solo <span className="text-green-400 font-black">CIENCIA</span> y <span className="text-yellow-400 font-black">TRABAJO DURO</span>.
          </p>
          <p className="text-orange-400 font-black text-xl mt-3 animate-bounce">
            ¿ESTÁS LISTO PARA EL DESAFÍO? 💪
          </p>
        </div>
      </div>
    </section>
  );
};

export default HomePage;