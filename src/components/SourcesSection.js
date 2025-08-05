import React, { useState, useEffect } from 'react';
import { 
  ExternalLink, 
  BookOpen, 
  Award, 
  Target,
  Apple,
  Zap,
  Shield
} from 'lucide-react';

// Import del JSON (en producción, esto vendría de una API o archivo estático)
import sourcesData from '../data/sources.json';

const SourcesSection = () => {
  const [sources, setSources] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos (en un proyecto real sería fetch o import directo)
    const loadSources = () => {
      try {
        setSources(sourcesData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading sources:', error);
        setLoading(false);
      }
    };

    loadSources();
  }, []);

  const getIcon = (iconName) => {
    const icons = {
      Target: <Target className="text-orange-500" size={24} />,
      Apple: <Apple className="text-green-500" size={24} />,
      Zap: <Zap className="text-red-500" size={24} />
    };
    return icons[iconName] || <BookOpen className="text-orange-500" size={24} />;
  };

  const getTypeColor = (type) => {
    const colors = {
      "Posición Oficial": "bg-green-500/20 text-green-400 border-green-500/30",
      "Manual Científico": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "Guías Oficiales": "bg-purple-500/20 text-purple-400 border-purple-500/30", 
      "Journal Peer-Reviewed": "bg-orange-500/20 text-orange-400 border-orange-500/30",
      "Revisión Científica": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      "Ensayo Clínico Controlado": "bg-red-500/20 text-red-400 border-red-500/30"
    };
    return colors[type] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xl">Cargando fuentes científicas...</p>
        </div>
      </section>
    );
  }

  if (!sources) {
    return (
      <section className="min-h-screen bg-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xl text-red-400">Error cargando las fuentes</p>
        </div>
      </section>
    );
  }

  const sourceCategories = [sources.rutinas, sources.dietas, sources.energia];

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header con actitud gym rat */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-wide">
            <span className="bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">
              CIENCIA REAL
            </span>
          </h2>
          <div className="h-1 w-32 bg-gradient-to-r from-orange-500 to-red-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-medium">
            Cada rutina, cada consejo, cada recomendación está respaldada por 
            <span className="text-orange-400 font-bold"> ESTUDIOS REALES</span> de instituciones reconocidas mundialmente
          </p>
        </div>

        {/* Sources Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {sourceCategories.map((sourceGroup, index) => (
            <div key={index} className="bg-black/50 rounded border-2 border-gray-700 hover:border-orange-500 transition-all duration-200 transform hover:scale-105 p-6">
              <div className="flex items-center space-x-3 mb-6">
                {getIcon(sourceGroup.icon)}
                <div>
                  <h3 className="text-xl font-bold tracking-wide">{sourceGroup.category}</h3>
                  <p className="text-gray-400 text-sm">{sourceGroup.description}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {sourceGroup.sources.map((source, sourceIndex) => (
                  <div key={sourceIndex} className="border-l-4 border-orange-500/50 pl-4 bg-gray-800/30 p-4 rounded">
                    <div className="flex items-start justify-between mb-3">
                      <a 
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-white hover:text-orange-400 cursor-pointer transition-colors duration-200 flex items-center space-x-2 group"
                      >
                        <span className="leading-tight">{source.title}</span>
                        <ExternalLink size={14} className="flex-shrink-0 group-hover:text-orange-400" />
                      </a>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-3 leading-relaxed">{source.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`inline-block px-3 py-1 rounded border text-xs font-bold ${getTypeColor(source.type)}`}>
                        {source.type}
                      </span>
                      <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                        {source.year}
                      </span>
                    </div>
                    
                    {source.key_findings && (
                      <div className="bg-orange-500/10 border border-orange-500/30 rounded p-3 mt-3">
                        <p className="text-orange-400 font-semibold text-xs mb-1">HALLAZGO CLAVE:</p>
                        <p className="text-gray-300 text-xs">{source.key_findings}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>





      </div>
    </section>
  );
};

export default SourcesSection;