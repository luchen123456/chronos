import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import AgeEntry from './pages/AgeEntry';
import PreciseResults from './pages/PreciseResults';
import { Icon } from './components/Icon';

const App: React.FC = () => {
  const [birthDate, setBirthDate] = useState<Date | null>(null);

  return (
    <HashRouter>
      <div className="min-h-screen bg-background-dark text-white font-display selection:bg-primary/30">
        <header className="fixed top-0 w-full z-50 pointer-events-none">
          {/* Header placeholder if needed globally, but currently handled in pages */}
        </header>
        
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<AgeEntry setBirthDate={setBirthDate} />} />
            <Route 
              path="/results" 
              element={
                birthDate ? (
                  <PreciseResults birthDate={birthDate} />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;