import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

const About: React.FC = () => {
    const { t } = useTranslations();
    
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="about" className="py-20 bg-white">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">{t('about.title')}</h2>
                <p className="text-xl text-gray-700 mt-4 max-w-3xl mx-auto">
                    {t('about.p1')} <span className="text-brand-green font-semibold">{t('about.p2')}</span> {t('about.p3')}
                </p>
                <div id="get-started" className="mt-10">
                    <a href="#dashboard" onClick={(e) => handleNavClick(e, '#dashboard')} className="bg-brand-green text-white font-semibold px-10 py-4 rounded-full hover:bg-brand-green-light transition-all duration-300 transform hover:scale-105 shadow-lg text-lg">
                        {t('about.cta')}
                    </a>
                </div>
            </div>
        </section>
    );
};

export default About;