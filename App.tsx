import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import HowItWorks from './components/HowItWorks';
import ChatbotSection from './components/ChatbotSection';
import Testimonials from './components/Testimonials';
import About from './components/About';
import Footer from './components/Footer';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import LoginRegisterModal from './components/LoginRegisterModal';

const App: React.FC = () => {

  // Service Worker registration logic has been moved to index.tsx for more reliable execution.

  return (
    <LanguageProvider>
      <AuthProvider>
        <LoginRegisterModal />
        <div className="bg-white min-h-screen">
          <Header />
          <main>
            <Hero />
            <Dashboard />
            <HowItWorks />
            <ChatbotSection />
            <Testimonials />
            <About />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;