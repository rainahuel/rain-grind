import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Download, 
  Clock, 
  Target, 
  User,
  X,
  FileText,
  Zap,
  Flame,
  Trophy,
  TrendingUp,
  Calendar,
  Heart,
  ChevronRight,
  Activity
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useToast } from './Toast';

const RoutinesSection = () => {
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [routinesData, setRoutinesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    const loadRoutinesData = async () => {
      try {
        setLoading(true);
        
        try {
          const indexResponse = await fetch('/data/routines/index.json');
          if (!indexResponse.ok) throw new Error('Index not found');
          
          const indexData = await indexResponse.json();
          
          const organizedData = {};
          
          Object.entries(indexData.categories).forEach(([categoryKey, categoryInfo]) => {
            organizedData[categoryKey] = {
              title: `Rutinas ${categoryInfo.name}`,
              description: categoryInfo.description,
              color: categoryInfo.color,
              routines: []
            };
          });
          
          for (const routine of indexData.routines) {
            try {
              const routineResponse = await fetch(`/data/routines/${routine.file}`);
              if (routineResponse.ok) {
                const routineDetail = await routineResponse.json();
                
                if (organizedData[routine.category]) {
                  organizedData[routine.category].routines.push({
                    ...routine,
                    ...routineDetail
                  });
                }
              } else {
                console.warn(`No se pudo cargar ${routine.file}, usando datos del index`);
                if (organizedData[routine.category]) {
                  organizedData[routine.category].routines.push(routine);
                }
              }
            } catch (routineError) {
              console.warn(`Error cargando ${routine.file}:`, routineError);
              if (organizedData[routine.category]) {
                organizedData[routine.category].routines.push(routine);
              }
            }
          }
          
          setRoutinesData(organizedData);
          setError(null);
          
        } catch (indexError) {
          console.error('Error cargando archivos JSON:', indexError);
          throw indexError;
        }
        
      } catch (err) {
        console.error('Error crítico cargando rutinas:', err);
        setError('Error crítico al cargar rutinas.');
        setRoutinesData({});
      } finally {
        setLoading(false);
      }
    };

    loadRoutinesData();
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const generatePDF = async (routine, event) => {
    try {
      const originalText = event.target.textContent;
      event.target.textContent = 'Generando PDF...';
      event.target.disabled = true;

      let fullRoutine = routine;
      if (!routine.workouts && routine.file) {
        try {
          const response = await fetch(`/data/routines/${routine.file}`);
          if (response.ok) {
            const routineData = await response.json();
            fullRoutine = { ...routine, ...routineData };
          }
        } catch (error) {
          console.warn('No se pudieron cargar detalles completos de la rutina');
        }
      }

      const doc = new jsPDF();
      
      const primaryColor = [249, 115, 22];
      const secondaryColor = [17, 24, 39];
      const textColor = [55, 65, 81];
      
      let yPosition = 20;
      
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 25, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('RAIN & GRIND', 20, 16);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Entrenamiento basado en ciencia', 120, 16);
      
      yPosition = 35;
      
      doc.setTextColor(...secondaryColor);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(fullRoutine.name || 'Rutina de Entrenamiento', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textColor);
      
      const infoData = [
        ['Nivel:', fullRoutine.level || 'N/A'],
        ['Duración:', fullRoutine.duration || 'N/A'],
        ['Frecuencia:', fullRoutine.frequency || 'N/A'],
        ['Tiempo por sesión:', fullRoutine.time_per_session || 'N/A']
      ];
      
      autoTable(doc, {
        startY: yPosition,
        head: [],
        body: infoData,
        theme: 'plain',
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        columnStyles: {
          0: { fontStyle: 'bold', textColor: primaryColor, cellWidth: 40 },
          1: { textColor: textColor, cellWidth: 100 }
        },
        margin: { left: 20, right: 20 },
        didDrawPage: function (data) {
          yPosition = data.cursor.y + 15;
        }
      });
      
      if (fullRoutine.description) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...primaryColor);
        doc.text('DESCRIPCIÓN', 20, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...textColor);
        const descriptionLines = doc.splitTextToSize(fullRoutine.description, 170);
        doc.text(descriptionLines, 20, yPosition);
        yPosition += descriptionLines.length * 4 + 10;
      }
      
      if (fullRoutine.key_benefits && fullRoutine.key_benefits.length > 0) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...primaryColor);
        doc.text('BENEFICIOS CLAVE', 20, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...textColor);
        
        fullRoutine.key_benefits.forEach((benefit) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(`• ${benefit}`, 25, yPosition);
          yPosition += 5;
        });
        yPosition += 10;
      }
      
      if (fullRoutine.workouts && fullRoutine.workouts.length > 0) {
        fullRoutine.workouts.forEach((workout, index) => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
          
          doc.setFillColor(...primaryColor);
          doc.rect(20, yPosition - 5, 170, 8, 'F');
          
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          const workoutNameLines = doc.splitTextToSize(workout.name || `Día ${index + 1}`, 168);
          doc.text(workoutNameLines, 22, yPosition);
          yPosition += workoutNameLines.length * 5 + 7;
          
          if (workout.type || workout.target || workout.duration) {
            doc.setFontSize(9);
            doc.setTextColor(...textColor);
            let infoText = '';
            if (workout.type) infoText += `Tipo: ${workout.type} • `;
            if (workout.target) infoText += `Objetivo: ${workout.target} • `;
            if (workout.duration) infoText += `Duración: ${workout.duration}`;
            
            const infoLines = doc.splitTextToSize(infoText.replace(/ • $/, ''), 168);
            doc.text(infoLines, 22, yPosition);
            yPosition += infoLines.length * 4 + 4;
          }
          
          if (workout.exercises && workout.exercises.length > 0) {
            const exerciseData = workout.exercises.map(exercise => [
              exercise.exercise || 'N/A',
              exercise.sets || 'N/A',
              exercise.reps || 'N/A',
              exercise.rest || 'N/A',
              exercise.notes || ''
            ]);
            
            autoTable(doc, {
              startY: yPosition,
              head: [['Ejercicio', 'Series', 'Reps', 'Descanso', 'Notas']],
              body: exerciseData,
              theme: 'striped',
              headStyles: {
                fillColor: primaryColor,
                textColor: [255, 255, 255],
                fontSize: 9,
                fontStyle: 'bold'
              },
              styles: {
                fontSize: 8,
                cellPadding: 3,
                textColor: textColor
              },
              columnStyles: {
                0: { cellWidth: 45, fontStyle: 'bold' },
                1: { cellWidth: 20, halign: 'center' },
                2: { cellWidth: 20, halign: 'center' },
                3: { cellWidth: 25, halign: 'center' },
                4: { cellWidth: 60, fontSize: 7, overflow: 'linebreak' }
              },
              margin: { left: 20, right: 20 },
              didDrawPage: function (data) {
                yPosition = data.cursor.y + 15;
              }
            });
          }
        });
      }
      
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(...textColor);
        doc.text(`Rain & Grind - ${fullRoutine.name}`, 20, 285);
        doc.text(`Página ${i} de ${pageCount}`, 160, 285);
        doc.text('rainandgrind.com', 20, 290);
        doc.text(new Date().toLocaleDateString('es-ES'), 160, 290);
      }
      
      doc.save(`${fullRoutine.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_rutina.pdf`);
      
      showToast(`PDF de "${fullRoutine.name}" descargado exitosamente! 🎉`, 'success', 3500);
      
      event.target.textContent = originalText;
      event.target.disabled = false;

    } catch (error) {
      console.error('Error generando PDF:', error);
      showToast('Error al generar el PDF. Por favor, inténtalo de nuevo.', 'error', 4000);
      event.target.textContent = 'PDF';
      event.target.disabled = false;
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      green: {
        bg: '#22c55e33',
        text: '#4ade80',
        hover: '#22c55e80'
      },
      orange: {
        bg: '#f9731633',
        text: '#f97316',
        hover: '#f9731680'
      },
      purple: {
        bg: '#8b5cf633',
        text: '#a78bfa', 
        hover: '#8b5cf680'
      },
      red: {
        bg: '#dc262633',
        text: '#ef4444',
        hover: '#dc262680'
      },
      blue: {
        bg: '#3b82f633',
        text: '#60a5fa',
        hover: '#3b82f680'
      }
    };
    return colors[color] || colors.orange;
  };

  const handleOpenModal = async (routine) => {
    console.log('Abriendo modal para:', routine.name);
    
    if (!routine.workouts && routine.file) {
      try {
        const response = await fetch(`/data/routines/${routine.file}`);
        if (response.ok) {
          const fullRoutine = await response.json();
          setSelectedRoutine({ ...routine, ...fullRoutine });
        } else {
          setSelectedRoutine(routine);
        }
      } catch (error) {
        console.error('Error cargando detalles de rutina:', error);
        setSelectedRoutine(routine);
      }
    } else {
      setSelectedRoutine(routine);
    }
    
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedRoutine(null);
    setShowModal(false);
  };

  if (loading) {
    return (
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #111827, #1f2937, #000000)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid #f97316',
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#f97316', fontSize: '1.125rem' }}>Cargando rutinas...</p>
        </div>
      </section>
    );
  }

  if (error && !routinesData) {
    return (
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #111827, #1f2937, #000000)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '500px', padding: '2rem' }}>
          <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Error al cargar rutinas</h2>
          <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              background: 'linear-gradient(to right, #f97316, #dc2626)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Reintentar
          </button>
        </div>
      </section>
    );
  }

  const categoryData = Object.values(routinesData || {});

  return (
    <>
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #111827, #1f2937, #000000)',
        color: 'white',
        paddingTop: '5rem',
        paddingBottom: '5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(220, 38, 38, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float 8s ease-in-out infinite reverse'
        }}></div>
        
        <div style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '0 1rem',
          position: 'relative',
          zIndex: 1
        }}>
          
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <Flame size={60} style={{
                color: '#f97316',
                margin: '0 auto',
                animation: 'bounce 2s ease-in-out infinite'
              }} />
            </div>
            <h2 className="routine-title">
              <span style={{
                color: '#f97316',
                display: 'block',
                animation: 'glow 2s ease-in-out infinite'
              }}>
                TU TRANSFORMACIÓN
                <span style={{ display: 'block' }}>EMPIEZA AQUÍ</span>
              </span>
            </h2>
            <div style={{
              height: '6px',
              width: '12rem',
              background: 'linear-gradient(to right, #f97316, #dc2626)',
              margin: '0 auto 1.5rem auto',
              borderRadius: '3px'
            }}></div>
            <p style={{
              fontSize: '1.5rem',
              color: '#e5e7eb',
              maxWidth: '48rem',
              margin: '0 auto',
              fontWeight: '600',
              lineHeight: '1.6'
            }}>
              Programas basados en <span style={{ color: '#22c55e', fontWeight: '900' }}>CIENCIA REAL</span>. 
              Desde <span style={{ color: '#60a5fa', fontWeight: '900' }}>PRINCIPIANTE</span> hasta 
              <span style={{ color: '#ef4444', fontWeight: '900' }}> TU MEJOR VERSIÓN</span> 🔥
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              marginTop: '1.5rem',
              flexWrap: 'wrap'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'rgba(249, 115, 22, 0.2)',
                borderRadius: '2rem',
                border: '2px solid rgba(249, 115, 22, 0.5)'
              }}>
                <Trophy size={20} style={{ color: '#f97316' }} />
                <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>
                  {categoryData.reduce((total, cat) => total + (cat.routines?.length || 0), 0)} RUTINAS
                </span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'rgba(34, 197, 94, 0.2)',
                borderRadius: '2rem',
                border: '2px solid rgba(34, 197, 94, 0.5)'
              }}>
                <Heart size={20} style={{ color: '#22c55e' }} />
                <span style={{ color: '#86efac', fontWeight: 'bold' }}>100% GRATIS</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'rgba(139, 92, 246, 0.2)',
                borderRadius: '2rem',
                border: '2px solid rgba(139, 92, 246, 0.5)'
              }}>
                <Activity size={20} style={{ color: '#8b5cf6' }} />
                <span style={{ color: '#c4b5fd', fontWeight: 'bold' }}>ACTUALIZADO</span>
              </div>
            </div>
          </div>

          {(() => {
            const routinesByLevel = {
              principiante: [],
              intermedio: [],
              avanzado: []
            };

            categoryData.forEach(category => {
              if (category.routines) {
                category.routines.forEach(routine => {
                  const level = routine.level?.toLowerCase();
                  const routineWithCategory = { ...routine, categoryColor: category.color };
                  
                  if (level?.includes('principiante') || level?.includes('beginner')) {
                    routinesByLevel.principiante.push(routineWithCategory);
                  } else if (level?.includes('avanzado') || level?.includes('advanced')) {
                    routinesByLevel.avanzado.push(routineWithCategory);
                  } else {
                    routinesByLevel.intermedio.push(routineWithCategory);
                  }
                });
              }
            });

            const levels = [
              { key: 'principiante', title: 'PRINCIPIANTES', color: 'green', icon: '🌱', description: 'Comienza tu journey fitness' },
              { key: 'intermedio', title: 'INTERMEDIOS', color: 'orange', icon: '🔥', description: 'Lleva tu entrenamiento al siguiente nivel' },
              { key: 'avanzado', title: 'AVANZADOS', color: 'red', icon: '💪', description: 'Alcanza tu mejor versión' }
            ];

            return (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                marginBottom: '2rem'
              }}
              className="routines-grid"
              >
                {levels.map(level => (
                  <div key={level.key} style={{ 
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <div style={{
                      marginBottom: '1.5rem',
                      textAlign: 'center',
                      padding: '1.5rem',
                      background: `linear-gradient(135deg, ${getColorClasses(level.color).bg} 0%, rgba(0,0,0,0.2) 100%)`,
                      borderRadius: '1rem',
                      border: `2px solid ${getColorClasses(level.color).text}`,
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '-20px',
                        right: '-20px',
                        fontSize: '4rem',
                        opacity: '0.1'
                      }}>{level.icon}</div>
                      
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{level.icon}</div>
                      <h3 style={{
                        fontSize: '1.5rem',
                        fontWeight: '900',
                        color: getColorClasses(level.color).text,
                        marginBottom: '0.25rem',
                        letterSpacing: '0.05em',
                        textShadow: `0 0 20px ${getColorClasses(level.color).hover}`
                      }}>{level.title}</h3>
                      <p style={{
                        color: '#e5e7eb',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}>{level.description}</p>
                      <div style={{
                        marginTop: '0.75rem',
                        padding: '0.375rem 0.75rem',
                        background: 'rgba(0,0,0,0.3)',
                        borderRadius: '1rem',
                        display: 'inline-block'
                      }}>
                        <span style={{
                          color: getColorClasses(level.color).text,
                          fontWeight: '700',
                          fontSize: '0.875rem'
                        }}>{routinesByLevel[level.key].length} RUTINAS</span>
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      flex: '1'
                    }}>
                      {routinesByLevel[level.key].map((routine, routineIndex) => {
                        const colorStyle = getColorClasses(routine.categoryColor || level.color);
                        return (
                          <div 
                            key={routine.id || routineIndex} 
                            style={{
                              background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.95) 100%)',
                              borderRadius: '1rem',
                              border: '2px solid transparent',
                              backgroundImage: `linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.95) 100%), linear-gradient(135deg, ${colorStyle.text} 0%, ${colorStyle.hover} 100%)`,
                              backgroundOrigin: 'border-box',
                              backgroundClip: 'padding-box, border-box',
                              transition: 'all 0.3s ease',
                              padding: '1.5rem',
                              display: 'flex',
                              flexDirection: 'column',
                              cursor: 'pointer',
                              position: 'relative',
                              overflow: 'hidden',
                              minHeight: '320px'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                              e.currentTarget.style.boxShadow = `0 20px 40px -15px ${colorStyle.hover}`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0) scale(1)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            <div style={{
                              position: 'absolute',
                              top: '0',
                              right: '0',
                              width: '60px',
                              height: '60px',
                              background: `linear-gradient(135deg, ${colorStyle.hover} 0%, transparent 50%)`,
                              opacity: '0.3'
                            }}></div>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '0.75rem',
                          position: 'relative',
                          zIndex: 1
                        }}>
                          <h4 style={{
                            fontSize: '1.125rem',
                            fontWeight: '900',
                            letterSpacing: '0.025em',
                            flex: '1',
                            paddingRight: '0.5rem',
                            color: 'white',
                            textTransform: 'uppercase'
                          }}>{routine.name}</h4>
                          <span style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '1rem',
                            fontSize: '0.625rem',
                            fontWeight: '900',
                            whiteSpace: 'nowrap',
                            background: `linear-gradient(135deg, ${colorStyle.text} 0%, ${colorStyle.hover} 100%)`,
                            color: 'white',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            boxShadow: `0 2px 10px ${colorStyle.hover}`,
                            animation: 'pulse 2s ease-in-out infinite'
                          }}>
                            {routine.level}
                          </span>
                        </div>

                        <p style={{
                          color: '#e5e7eb',
                          marginBottom: '0.75rem',
                          fontSize: '0.8125rem',
                          lineHeight: '1.5',
                          flex: '1',
                          position: 'relative',
                          zIndex: 1
                        }}>{routine.description}</p>

                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gap: '0.5rem',
                          marginBottom: '1rem',
                          fontSize: '0.6875rem',
                          position: 'relative',
                          zIndex: 1
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            padding: '0.375rem',
                            background: 'rgba(249, 115, 22, 0.1)',
                            borderRadius: '0.375rem',
                            border: '1px solid rgba(249, 115, 22, 0.2)'
                          }}>
                            <Clock size={12} style={{ color: '#fbbf24', flexShrink: 0 }} />
                            <span style={{ color: '#fed7aa', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {routine.time_per_session}
                            </span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            padding: '0.375rem',
                            background: 'rgba(34, 197, 94, 0.1)',
                            borderRadius: '0.375rem',
                            border: '1px solid rgba(34, 197, 94, 0.2)'
                          }}>
                            <Calendar size={12} style={{ color: '#86efac', flexShrink: 0 }} />
                            <span style={{ color: '#bbf7d0', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {routine.frequency}
                            </span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            padding: '0.375rem',
                            background: 'rgba(59, 130, 246, 0.1)',
                            borderRadius: '0.375rem',
                            border: '1px solid rgba(59, 130, 246, 0.2)'
                          }}>
                            <TrendingUp size={12} style={{ color: '#93c5fd', flexShrink: 0 }} />
                            <span style={{ color: '#dbeafe', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {routine.duration}
                            </span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            padding: '0.375rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            borderRadius: '0.375rem',
                            border: '1px solid rgba(239, 68, 68, 0.2)'
                          }}>
                            <Flame size={12} style={{ color: '#fca5a5', flexShrink: 0 }} />
                            <span style={{ color: '#fee2e2', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {routine.goal?.split(' ')[0] || 'Fitness'}
                            </span>
                          </div>
                        </div>

                        <div style={{ 
                          marginBottom: '1rem',
                          position: 'relative',
                          zIndex: 1
                        }}>
                          <div style={{
                            display: 'flex',
                            gap: '0.375rem',
                            flexWrap: 'wrap'
                          }}>
                            {(routine.key_benefits || []).slice(0, 2).map((benefit, idx) => (
                              <div key={idx} style={{
                                padding: '0.25rem 0.5rem',
                                background: 'rgba(249, 115, 22, 0.15)',
                                border: '1px solid rgba(249, 115, 22, 0.3)',
                                borderRadius: '1rem',
                                fontSize: '0.625rem',
                                color: '#fed7aa',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}>
                                <Zap size={10} style={{ color: '#fbbf24' }} />
                                {benefit.length > 20 ? benefit.substring(0, 20) + '...' : benefit}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div style={{
                          display: 'flex',
                          gap: '0.5rem',
                          marginTop: 'auto',
                          position: 'relative',
                          zIndex: 1
                        }}>
                          <button 
                            onClick={() => handleOpenModal(routine)}
                            style={{
                              flex: '1',
                              background: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
                              padding: '0.625rem',
                              borderRadius: '0.5rem',
                              fontWeight: '900',
                              fontSize: '0.75rem',
                              transition: 'all 0.3s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.375rem',
                              border: 'none',
                              color: 'white',
                              cursor: 'pointer',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              boxShadow: '0 4px 15px rgba(249, 115, 22, 0.4)',
                              transform: 'translateY(0)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 6px 20px rgba(249, 115, 22, 0.6)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 4px 15px rgba(249, 115, 22, 0.4)';
                            }}
                          >
                            <Play size={14} />
                            <span>ENTRENAR</span>
                            <ChevronRight size={12} style={{ marginLeft: '-0.25rem' }} />
                          </button>
                          <button 
                            onClick={(e) => generatePDF(routine, e)}
                            style={{
                              padding: '0.625rem',
                              background: 'rgba(249, 115, 22, 0.2)',
                              border: '2px solid rgba(249, 115, 22, 0.5)',
                              borderRadius: '0.5rem',
                              color: '#fbbf24',
                              fontWeight: '900',
                              fontSize: '0.75rem',
                              transition: 'all 0.3s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              minWidth: '2.5rem'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(249, 115, 22, 0.3)';
                              e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.7)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(249, 115, 22, 0.2)';
                              e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.5)';
                            }}
                          >
                            <Download size={14} />
                          </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      {showModal && selectedRoutine ? (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 9999,
            backdropFilter: 'blur(4px)'
          }}
          onClick={handleCloseModal}
        >
          <div 
            style={{
              backgroundColor: '#111827',
              borderRadius: '0.75rem',
              border: '2px solid #f97316',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              width: '90vw',
              maxWidth: '1200px',
              height: '85vh',
              zIndex: 10000,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            
            <div style={{
              backgroundColor: '#111827',
              borderBottom: '1px solid #374151',
              padding: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTopLeftRadius: '0.75rem',
              borderTopRightRadius: '0.75rem',
              flexShrink: 0
            }}>
              <div>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: 'white',
                  letterSpacing: '0.025em',
                  margin: 0
                }}>{selectedRoutine.name}</h2>
                <p style={{
                  color: '#f97316',
                  fontWeight: '500',
                  margin: 0,
                  marginTop: '0.25rem'
                }}>{selectedRoutine.goal}</p>
              </div>
              <button 
                onClick={handleCloseModal}
                style={{
                  color: '#9ca3af',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  transition: 'all 0.2s ease',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer'
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{
              flex: '1',
              overflowY: 'auto',
              minHeight: 0
            }}>
              <div style={{ padding: '1.5rem' }}>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginBottom: '2rem'
                }}>
                  <div style={{
                    backgroundColor: 'rgba(31, 41, 55, 0.5)',
                    padding: '1rem',
                    borderRadius: '0.25rem',
                    border: '1px solid #374151'
                  }}>
                    <div style={{
                      color: '#f97316',
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                      marginBottom: '0.25rem'
                    }}>NIVEL</div>
                    <div style={{ color: 'white' }}>{selectedRoutine.level}</div>
                  </div>
                  <div style={{
                    backgroundColor: 'rgba(31, 41, 55, 0.5)',
                    padding: '1rem',
                    borderRadius: '0.25rem',
                    border: '1px solid #374151'
                  }}>
                    <div style={{
                      color: '#f97316',
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                      marginBottom: '0.25rem'
                    }}>DURACIÓN</div>
                    <div style={{ color: 'white' }}>{selectedRoutine.duration}</div>
                  </div>
                  <div style={{
                    backgroundColor: 'rgba(31, 41, 55, 0.5)',
                    padding: '1rem',
                    borderRadius: '0.25rem',
                    border: '1px solid #374151'
                  }}>
                    <div style={{
                      color: '#f97316',
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                      marginBottom: '0.25rem'
                    }}>FRECUENCIA</div>
                    <div style={{ color: 'white' }}>{selectedRoutine.frequency}</div>
                  </div>
                  <div style={{
                    backgroundColor: 'rgba(31, 41, 55, 0.5)',
                    padding: '1rem',
                    borderRadius: '0.25rem',
                    border: '1px solid #374151'
                  }}>
                    <div style={{
                      color: '#f97316',
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                      marginBottom: '0.25rem'
                    }}>TIEMPO/SESIÓN</div>
                    <div style={{ color: 'white' }}>{selectedRoutine.time_per_session}</div>
                  </div>
                </div>

                {selectedRoutine.workouts && selectedRoutine.workouts.length > 0 ? (
                  selectedRoutine.workouts.map((workout, workoutIdx) => (
                    <div key={workoutIdx} style={{ marginBottom: '2rem' }}>
                      <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: 'bold',
                        color: '#f97316',
                        marginBottom: '1rem'
                      }}>{workout.name}</h3>
                      
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{
                          width: '100%',
                          backgroundColor: 'rgba(31, 41, 55, 0.3)',
                          borderRadius: '0.5rem',
                          overflow: 'hidden',
                          borderCollapse: 'collapse'
                        }}>
                          <thead style={{ backgroundColor: '#1f2937' }}>
                            <tr>
                              <th style={{
                                textAlign: 'left',
                                padding: '0.75rem',
                                color: '#f97316',
                                fontWeight: 'bold'
                              }}>EJERCICIO</th>
                              <th style={{
                                textAlign: 'center',
                                padding: '0.75rem',
                                color: '#f97316',
                                fontWeight: 'bold'
                              }}>SERIES</th>
                              <th style={{
                                textAlign: 'center',
                                padding: '0.75rem',
                                color: '#f97316',
                                fontWeight: 'bold'
                              }}>REPS</th>
                              <th style={{
                                textAlign: 'center',
                                padding: '0.75rem',
                                color: '#f97316',
                                fontWeight: 'bold'
                              }}>DESCANSO</th>
                              <th style={{
                                textAlign: 'left',
                                padding: '0.75rem',
                                color: '#f97316',
                                fontWeight: 'bold'
                              }}>NOTAS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {workout.exercises?.map((exercise, exerciseIdx) => (
                              <tr key={exerciseIdx} style={{
                                borderBottom: '1px solid #374151'
                              }}>
                                <td style={{
                                  padding: '0.75rem',
                                  color: 'white',
                                  fontWeight: '500'
                                }}>{exercise.exercise}</td>
                                <td style={{
                                  padding: '0.75rem',
                                  textAlign: 'center',
                                  color: '#d1d5db'
                                }}>{exercise.sets}</td>
                                <td style={{
                                  padding: '0.75rem',
                                  textAlign: 'center',
                                  color: '#d1d5db'
                                }}>{exercise.reps}</td>
                                <td style={{
                                  padding: '0.75rem',
                                  textAlign: 'center',
                                  color: '#d1d5db'
                                }}>{exercise.rest}</td>
                                <td style={{
                                  padding: '0.75rem',
                                  color: '#9ca3af',
                                  fontSize: '0.875rem'
                                }}>{exercise.notes}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    color: '#9ca3af'
                  }}>
                    <p>Los detalles completos de esta rutina se están cargando...</p>
                    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                      Revisa que el archivo {selectedRoutine.file} esté disponible.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div style={{
              backgroundColor: '#111827',
              borderTop: '1px solid #374151',
              padding: '1.5rem',
              borderBottomLeftRadius: '0.75rem',
              borderBottomRightRadius: '0.75rem',
              flexShrink: 0
            }}>
              <div style={{
                display: 'flex',
                flexDirection: window.innerWidth < 640 ? 'column' : 'row',
                gap: '0.75rem'
              }}>
                <button 
                  onClick={(e) => generatePDF(selectedRoutine, e)}
                  style={{
                    flex: '1',
                    backgroundColor: '#f97316',
                    color: 'white',
                    padding: '0.625rem 1rem',
                    borderRadius: '0.5rem',
                    fontWeight: 'bold',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#ea580c';
                    e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f97316';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <Download size={16} />
                  <span>DESCARGAR PDF</span>
                </button>
                <button 
                  onClick={handleCloseModal}
                  style={{
                    border: '1px solid #4b5563',
                    padding: '0.625rem 1rem',
                    borderRadius: '0.5rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    color: 'white',
                    fontSize: '0.875rem',
                    backgroundColor: 'transparent',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#1f2937';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <ToastContainer />
    </>
  );
};

export default RoutinesSection;