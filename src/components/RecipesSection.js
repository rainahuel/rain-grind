import React from 'react';
import { 
  ChefHat, 
  Clock, 
  Users, 
  Flame,
  Target,
  Utensils,
  Plus,
  Star,
  TrendingUp
} from 'lucide-react';

const RecipesSection = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-20">
        
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <ChefHat className="text-green-400 animate-bounce" size={60} />
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-green-400 mb-4 tracking-wider animate-glow">
            RECETAS FITNESS
          </h2>
          <div className="h-2 w-48 bg-gradient-to-r from-green-500 to-orange-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto font-semibold leading-relaxed">
            Combustible <span className="text-green-400 font-black">REAL</span> para tus entrenamientos. 
            Recetas simples, nutritivas y <span className="text-orange-400 font-black">DELICIOSAS</span> 🔥
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full border-2 border-green-500/30">
              <Target size={20} className="text-green-400" />
              <span className="text-green-300 font-bold">MACROS CALCULADOS</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full border-2 border-orange-500/30">
              <Flame size={20} className="text-orange-400" />
              <span className="text-orange-300 font-bold">FÁCILES & RÁPIDAS</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl p-12 border-2 border-green-500/30 relative overflow-hidden">
            
            <div className="absolute inset-0 opacity-5">
              <div className="grid grid-cols-8 gap-4 h-full">
                {[...Array(32)].map((_, i) => (
                  <ChefHat key={i} size={24} className="text-green-400" />
                ))}
              </div>
            </div>

            <div className="relative z-10">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Plus size={40} className="text-white" />
                </div>
                <h3 className="text-3xl font-black text-green-400 mb-2">¡PRÓXIMAMENTE!</h3>
                <p className="text-gray-300 text-lg font-semibold">Estamos cocinando algo increíble para ti</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-green-500/20 to-green-500/10 p-4 rounded-lg border border-green-500/30">
                  <Utensils className="text-green-400 mb-2" size={24} />
                  <h4 className="font-bold text-green-300 mb-1">MEAL PREP</h4>
                  <p className="text-xs text-gray-400">Recetas para toda la semana</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500/20 to-orange-500/10 p-4 rounded-lg border border-orange-500/30">
                  <TrendingUp className="text-orange-400 mb-2" size={24} />
                  <h4 className="font-bold text-orange-300 mb-1">PRE/POST WORKOUT</h4>
                  <p className="text-xs text-gray-400">Snacks para maximizar resultados</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 p-4 rounded-lg border border-purple-500/30">
                  <Star className="text-purple-400 mb-2" size={24} />
                  <h4 className="font-bold text-purple-300 mb-1">MACROS PERFECTOS</h4>
                  <p className="text-xs text-gray-400">Cada receta con valores nutricionales</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-lg p-6 border border-green-500/20">
                <h4 className="text-xl font-bold text-white mb-2">💡 ¿Tienes alguna receta fitness favorita?</h4>
                <p className="text-gray-300 mb-4">
                  Estamos construyendo esta sección con las mejores recetas para complementar tus rutinas.
                  ¡Pronto tendrás todo lo que necesitas para alimentar tus entrenamientos!
                </p>
                <div className="flex items-center justify-center space-x-2 text-green-400">
                  <Clock size={16} />
                  <span className="font-semibold">Llegando muy pronto...</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-black/60 to-black/40 border-l-4 border-green-500 p-6 max-w-3xl mx-auto rounded-lg">
            <p className="text-green-400 font-black text-xl mb-2">
              "You can't out-train a bad diet"
            </p>
            <p className="text-gray-300 font-semibold">
              El entrenamiento es solo el 30%. La <span className="text-green-400">NUTRICIÓN</span> es el 70% restante.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecipesSection;