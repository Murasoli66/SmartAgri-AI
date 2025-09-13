import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { useAuth } from '../hooks/useAuth';

const Hero: React.FC = () => {
    const { t } = useTranslations();
    const { user, openModal } = useAuth();
    
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="home" className="relative h-screen flex items-center justify-center text-white" style={{ background: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1625246333195-78d9c38AD449?q=80&w=1920&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="text-center z-10 p-6 animate-fade-in">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
                    {t('hero.title')}
                </h1>
                <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
                    {t('hero.subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {user ? (
                         <a href="#dashboard" onClick={(e) => handleNavClick(e, '#dashboard')} className="bg-brand-green text-white font-semibold px-8 py-3 rounded-full hover:bg-brand-green-light transition-all duration-300 transform hover:scale-105 shadow-lg w-full sm:w-auto">
                            {t('header.navDashboard')}
                        </a>
                    ) : (
                        <>
                            <button onClick={() => openModal('register')} className="bg-brand-green text-white font-semibold px-8 py-3 rounded-full hover:bg-brand-green-light transition-all duration-300 transform hover:scale-105 shadow-lg w-full sm:w-auto">
                                {t('hero.register')}
                            </button>
                            <button onClick={() => openModal('login')} className="bg-white/30 text-white font-semibold px-8 py-3 rounded-full hover:bg-white/50 backdrop-blur-sm transition-all duration-300 transform hover:scale-105 shadow-lg w-full sm:w-auto">
                                {t('hero.login')}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Hero;