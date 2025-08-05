import React, { useState } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import RoutinesSection from './components/RoutinesSection';
import RecipesSection from './components/RecipesSection';
import NutritionSection from './components/NutritionSection';
import SourcesSection from './components/SourcesSection';
import Footer from './components/Footer';
import './styles/globals.css';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <HomePage setActiveSection={setActiveSection} />;
      case 'routines':
        return <RoutinesSection />;
      case 'recipes':
        return <RecipesSection />;
      case 'nutrition':
        return <NutritionSection />;
      case 'sources':
        return <SourcesSection />;
      default:
        return <HomePage setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <main>
        {renderSection()}
      </main>

      <Footer setActiveSection={setActiveSection} />
    </div>
  );
}

export default App;