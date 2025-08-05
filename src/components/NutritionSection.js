import React, { useState } from 'react';
import { Calculator, Apple, Target, TrendingUp, Download, Copy, Check } from 'lucide-react';
import { useToast } from './Toast';

const NutritionSection = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    weight: '',
    height: '',
    activityLevel: '',
    goal: ''
  });

  const [results, setResults] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const { showToast, ToastContainer } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateBMR = (weight, height, age, gender) => {
    if (gender === 'male') {
      return (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      return (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
  };

  const calculateTDEE = (bmr, activityLevel) => {
    return Math.round(bmr * parseFloat(activityLevel));
  };

  const calculateCaloriesForGoal = (tdee, goal) => {
    switch (goal) {
      case 'lose':
        return Math.round(tdee * 0.85);
      case 'maintain':
        return tdee;
      case 'gain':
        return Math.round(tdee * 1.15);
      case 'recomp':
        return Math.round(tdee * 0.95);
      default:
        return tdee;
    }
  };

  const calculateMacros = (calories, goal) => {
    let proteinPercentage, carbPercentage, fatPercentage;

    switch (goal) {
      case 'lose':
        proteinPercentage = 0.35;
        fatPercentage = 0.25;
        carbPercentage = 0.40;
        break;
      case 'gain':
        proteinPercentage = 0.25;
        fatPercentage = 0.25;
        carbPercentage = 0.50;
        break;
      case 'recomp':
        proteinPercentage = 0.30;
        fatPercentage = 0.25;
        carbPercentage = 0.45;
        break;
      default:
        proteinPercentage = 0.25;
        fatPercentage = 0.30;
        carbPercentage = 0.45;
    }

    return {
      protein: {
        grams: Math.round((calories * proteinPercentage) / 4),
        calories: Math.round(calories * proteinPercentage),
        percentage: Math.round(proteinPercentage * 100)
      },
      carbs: {
        grams: Math.round((calories * carbPercentage) / 4),
        calories: Math.round(calories * carbPercentage),
        percentage: Math.round(carbPercentage * 100)
      },
      fats: {
        grams: Math.round((calories * fatPercentage) / 9),
        calories: Math.round(calories * fatPercentage),
        percentage: Math.round(fatPercentage * 100)
      }
    };
  };

  const calculateCalories = () => {
    const { age, gender, weight, height, activityLevel, goal } = formData;

    if (!age || !gender || !weight || !height || !activityLevel || !goal) {
      alert('Por favor, completa todos los campos');
      return;
    }

    const bmr = calculateBMR(
      parseFloat(weight),
      parseFloat(height),
      parseInt(age),
      gender
    );

    const tdee = calculateTDEE(bmr, activityLevel);

    const targetCalories = calculateCaloriesForGoal(tdee, goal);

    const macros = calculateMacros(targetCalories, goal);

    setResults({
      bmr: Math.round(bmr),
      tdee,
      targetCalories,
      macros,
      goal
    });
  };

  const getGoalName = (goal) => {
    const goals = {
      'lose': 'Perder grasa',
      'maintain': 'Mantener peso',
      'gain': 'Ganar músculo',
      'recomp': 'Recomposición corporal'
    };
    return goals[goal] || goal;
  };

  const copyResults = async () => {
    if (!results) return;

    const resultsText = `
🏋️ CALCULADORA RAIN & GRIND 🏋️

👤 OBJETIVO: ${getGoalName(results.goal)}

📊 RESUMEN CALÓRICO:
• TMB (metabolismo basal): ${results.bmr} cal/día
• TDEE (gasto total): ${results.tdee} cal/día
• META DIARIA: ${results.targetCalories} cal/día

🥗 MACRONUTRIENTES:
• Proteína: ${results.macros.protein.grams}g (${results.macros.protein.calories} cal - ${results.macros.protein.percentage}%)
• Carbohidratos: ${results.macros.carbs.grams}g (${results.macros.carbs.calories} cal - ${results.macros.carbs.percentage}%)
• Grasas: ${results.macros.fats.grams}g (${results.macros.fats.calories} cal - ${results.macros.fats.percentage}%)

⚠️ Esta información es orientativa. Consulta con un profesional de la salud para recomendaciones personalizadas.

Calculado en: rainandgrind.com
    `.trim();

    try {
      await navigator.clipboard.writeText(resultsText);
      setCopySuccess(true);
      showToast('¡Resultados copiados al portapapeles! 📋', 'success', 2500);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = resultsText;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      showToast('¡Resultados copiados al portapapeles! 📋', 'success', 2500);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const generatePDF = () => {
    if (!results) {
      showToast('Primero debes calcular tus macros para generar el PDF', 'warning', 3000);
      return;
    }
    
    try {
    const goalName = getGoalName(results.goal);
    
    const pdfContent = `
      <html>
        <head>
          <title>Resultados Nutricionales - Rain & Grind</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 40px; 
              background: white; 
              color: #333; 
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 3px solid #f97316; 
              padding-bottom: 20px; 
            }
            .title { 
              color: #f97316; 
              font-size: 24px; 
              font-weight: bold; 
              margin-bottom: 10px; 
            }
            .subtitle { 
              color: #666; 
              font-size: 16px; 
            }
            .section { 
              margin: 25px 0; 
              padding: 20px; 
              border: 1px solid #ddd; 
              border-radius: 8px; 
            }
            .section-title { 
              color: #f97316; 
              font-size: 18px; 
              font-weight: bold; 
              margin-bottom: 15px; 
            }
            .calories-grid { 
              display: grid; 
              grid-template-columns: 1fr 1fr 1fr; 
              gap: 20px; 
              text-align: center; 
            }
            .calorie-item { 
              padding: 15px; 
              background: #f8f9fa; 
              border-radius: 6px; 
            }
            .calorie-value { 
              font-size: 20px; 
              font-weight: bold; 
              color: #f97316; 
            }
            .macro-item { 
              display: flex; 
              justify-content: space-between; 
              padding: 12px 0; 
              border-bottom: 1px solid #eee; 
            }
            .macro-name { 
              font-weight: bold; 
            }
            .disclaimer { 
              background: #fff3cd; 
              border: 1px solid #ffeaa7; 
              padding: 15px; 
              border-radius: 6px; 
              margin-top: 30px; 
              font-size: 14px; 
            }
            .footer { 
              text-align: center; 
              margin-top: 30px; 
              color: #666; 
              font-size: 14px; 
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">🏋️ RAIN & GRIND</div>
            <div class="subtitle">Calculadora de Calorías y Macronutrientes</div>
          </div>

          <div class="section">
            <div class="section-title">👤 Objetivo: ${goalName}</div>
          </div>

          <div class="section">
            <div class="section-title">📊 Resumen Calórico</div>
            <div class="calories-grid">
              <div class="calorie-item">
                <div>TMB</div>
                <div class="calorie-value">${results.bmr}</div>
                <div>cal/día</div>
              </div>
              <div class="calorie-item">
                <div>TDEE</div>
                <div class="calorie-value">${results.tdee}</div>
                <div>cal/día</div>
              </div>
              <div class="calorie-item">
                <div>META</div>
                <div class="calorie-value">${results.targetCalories}</div>
                <div>cal/día</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">🥗 Distribución de Macronutrientes</div>
            <div class="macro-item">
              <span class="macro-name">Proteína</span>
              <span>${results.macros.protein.grams}g (${results.macros.protein.calories} cal - ${results.macros.protein.percentage}%)</span>
            </div>
            <div class="macro-item">
              <span class="macro-name">Carbohidratos</span>
              <span>${results.macros.carbs.grams}g (${results.macros.carbs.calories} cal - ${results.macros.carbs.percentage}%)</span>
            </div>
            <div class="macro-item">
              <span class="macro-name">Grasas</span>
              <span>${results.macros.fats.grams}g (${results.macros.fats.calories} cal - ${results.macros.fats.percentage}%)</span>
            </div>
          </div>

          <div class="disclaimer">
            <strong>⚠️ Disclaimer:</strong> Esta calculadora proporciona estimaciones basadas en fórmulas estándar. 
            Consulta con un profesional de la salud para recomendaciones personalizadas.
          </div>

          <div class="footer">
            <p>Generado en: ${new Date().toLocaleDateString('es-ES')}</p>
            <p><strong>rainandgrind.com</strong></p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(pdfContent);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      showToast('PDF nutricional generado exitosamente! 🎉', 'success', 3500);
    }, 500);
    
    } catch (error) {
      console.error('Error generando PDF nutricional:', error);
      showToast('Error al generar el PDF nutricional. Inténtalo de nuevo.', 'error', 4000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 rounded-full">
              <Apple size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            Calculadora de Calorías & Macros
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Calcula tus necesidades calóricas y distribución de macronutrientes 
            basado en tus objetivos y nivel de actividad física.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/20">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Calculator className="mr-3 text-orange-500" size={24} />
              Información Personal
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Edad
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white"
                    placeholder="25"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Sexo
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white"
                  >
                    <option value="">Seleccionar</option>
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white"
                    placeholder="70"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white"
                    placeholder="175"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nivel de Actividad
                </label>
                <select
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white"
                >
                  <option value="">Seleccionar nivel</option>
                  <option value="1.2">Sedentario (sin ejercicio)</option>
                  <option value="1.375">Ligero (1-3 días/semana)</option>
                  <option value="1.55">Moderado (3-5 días/semana)</option>
                  <option value="1.725">Activo (6-7 días/semana)</option>
                  <option value="1.9">Muy activo (2x al día, ejercicio intenso)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Objetivo Principal
                </label>
                <select
                  name="goal"
                  value={formData.goal}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white"
                >
                  <option value="">Seleccionar objetivo</option>
                  <option value="lose">Perder grasa</option>
                  <option value="maintain">Mantener peso</option>
                  <option value="gain">Ganar músculo</option>
                  <option value="recomp">Recomposición corporal</option>
                </select>
              </div>

              <button
                onClick={calculateCalories}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Calcular Necesidades
              </button>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/20">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Target className="mr-3 text-orange-500" size={24} />
              Tus Resultados
            </h2>

            {!results ? (
              <div className="text-center py-12">
                <div className="bg-gray-700/50 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                  <TrendingUp size={48} className="text-gray-500" />
                </div>
                <p className="text-gray-400 text-lg">
                  Completa el formulario para ver tus resultados personalizados
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-orange-500/20 to-red-600/20 rounded-xl p-6 border border-orange-500/30">
                  <h3 className="text-xl font-bold mb-4 text-center">
                    📊 Resumen Calórico
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-400">TMB</p>
                      <p className="text-2xl font-bold text-white">{results.bmr}</p>
                      <p className="text-xs text-gray-500">cal/día</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">TDEE</p>
                      <p className="text-2xl font-bold text-white">{results.tdee}</p>
                      <p className="text-xs text-gray-500">cal/día</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Meta</p>
                      <p className="text-3xl font-bold text-orange-400">{results.targetCalories}</p>
                      <p className="text-xs text-gray-500">cal/día</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-center mb-4">
                    🥗 Distribución de Macronutrientes
                  </h3>
                  
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-blue-400">Proteína</span>
                      <span className="text-sm text-gray-400">{results.macros.protein.percentage}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{results.macros.protein.grams}g</span>
                      <span>{results.macros.protein.calories} cal</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${results.macros.protein.percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-green-400">Carbohidratos</span>
                      <span className="text-sm text-gray-400">{results.macros.carbs.percentage}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{results.macros.carbs.grams}g</span>
                      <span>{results.macros.carbs.calories} cal</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div 
                        className="bg-green-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${results.macros.carbs.percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-yellow-400">Grasas</span>
                      <span className="text-sm text-gray-400">{results.macros.fats.percentage}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{results.macros.fats.grams}g</span>
                      <span>{results.macros.fats.calories} cal</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${results.macros.fats.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <button
                    onClick={copyResults}
                    className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200"
                  >
                    {copySuccess ? (
                      <>
                        <Check size={18} />
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={generatePDF}
                    className="flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-all duration-200"
                  >
                    <Download size={18} />
                    <span>PDF</span>
                  </button>
                </div>

                <button
                  onClick={() => setResults(null)}
                  className="w-full bg-gray-700 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-all duration-200 mt-4"
                >
                  Calcular de Nuevo
                </button>
              </div>
            )}

            <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-sm text-yellow-300">
                <strong>Disclaimer:</strong> Esta calculadora proporciona estimaciones basadas en fórmulas estándar. 
                Consulta con un profesional de la salud para recomendaciones personalizadas.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default NutritionSection;