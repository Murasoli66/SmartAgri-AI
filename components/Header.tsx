import React, { useState, useEffect } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { useAuth } from '../hooks/useAuth';
import ProfileDropdown from './ProfileDropdown';
import HelpModal from './HelpModal';

const LeafIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66C7.23 18.06 10 14 17 12V8m-5-1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M17 7h-2C15 4.69 12.86 3 10.5 3S6 4.69 6 7H4c0-3.87 3.13-7 7-7s7 3.13 7 7z"/>
    </svg>
);

const HelpIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.79 4 4 0 .863-.37 1.683-.978 2.275a4.99 4.99 0 01-2.275 1.355c-.742.33-1.32.91-1.636 1.62M12 21a9 9 0 100-18 9 9 0 000 18z" />
    </svg>
);

const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const Header: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { t, setLanguage, language } = useTranslations();
    const { user, openModal } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);
    
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        setIsMenuOpen(false); // Close mobile menu on link click
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const navLinks = [
        { key: 'header.navDashboard', href: '#dashboard' },
        { key: 'header.navHowItWorks', href: '#how-it-works' },
        { key: 'header.navChatbot', href: '#chatbot' },
        { key: 'header.navAbout', href: '#about' }
    ];

    const MobileMenu = () => (
        <div className={`fixed inset-0 bg-white z-[100] transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
            <div className="flex justify-between items-center px-6 py-4 border-b">
                 <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="flex items-center space-x-2">
                    <LeafIcon className="w-8 h-8 text-brand-green" />
                    <span className="text-2xl font-bold text-brand-dark">{t('header.title')}</span>
                </a>
                <button onClick={() => setIsMenuOpen(false)} className="text-brand-dark" aria-label="Close menu">
                    <CloseIcon className="w-8 h-8" />
                </button>
            </div>
            <div className="flex flex-col items-center justify-center h-full -mt-16 space-y-8 text-center">
                <nav className="flex flex-col items-center space-y-6">
                    {navLinks.map(link => (
                        <a key={link.key} href={link.href} onClick={(e) => handleNavClick(e, link.href)} className="text-2xl text-gray-800 hover:text-brand-green transition-colors duration-300 font-medium">
                            {t(link.key)}
                        </a>
                    ))}
                </nav>
                 <div className="border-t w-1/2 my-6"></div>
                {user ? (
                    <ProfileDropdown />
                 ) : (
                    <div className="flex flex-col items-center space-y-4">
                        <button onClick={() => { openModal('login'); setIsMenuOpen(false); }} className="text-brand-dark font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-all text-lg w-48 text-center">
                            {t('header.login')}
                        </button>
                        <button onClick={() => { openModal('register'); setIsMenuOpen(false); }} className="bg-brand-green text-white font-semibold px-8 py-3 rounded-full hover:bg-brand-green-light transition-all duration-300 transform hover:scale-105 text-lg w-48 text-center">
                            {t('header.register')}
                        </button>
                    </div>
                 )}
                <div className="flex items-center space-x-2 text-md font-medium pt-6">
                    <button onClick={() => setLanguage('en')} className={`${language === 'en' ? 'text-brand-green' : 'text-gray-500 hover:text-brand-dark'}`}>English</button>
                    <span className="text-gray-300">|</span>
                    <button onClick={() => setLanguage('ta')} className={`${language === 'ta' ? 'text-brand-green' : 'text-gray-500 hover:text-brand-dark'}`}>தமிழ்</button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 shadow-md backdrop-blur-lg' : 'bg-transparent'}`}>
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="flex items-center space-x-2">
                        <LeafIcon className="w-8 h-8 text-brand-green" />
                        <span className="text-2xl font-bold text-brand-dark">{t('header.title')}</span>
                    </a>
                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map(link => (
                            <a key={link.key} href={link.href} onClick={(e) => handleNavClick(e, link.href)} className="text-gray-600 hover:text-brand-green transition-colors duration-300 font-medium">
                                {t(link.key)}
                            </a>
                        ))}
                    </nav>
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setIsHelpOpen(true)} className="text-gray-500 hover:text-brand-green transition-colors" aria-label="Help">
                           <HelpIcon className="w-6 h-6" />
                        </button>
                         {user ? (
                            <ProfileDropdown />
                         ) : (
                            <div className="hidden md:flex items-center space-x-2">
                                <button onClick={() => openModal('login')} className="text-brand-dark font-semibold px-6 py-2 rounded-full hover:bg-gray-100 transition-all">
                                    {t('header.login')}
                                </button>
                                <button onClick={() => openModal('register')} className="bg-brand-green text-white font-semibold px-6 py-2 rounded-full hover:bg-brand-green-light transition-all duration-300 transform hover:scale-105">
                                    {t('header.register')}
                                </button>
                            </div>
                         )}
                        <div className="hidden md:flex items-center space-x-2 text-sm font-medium">
                            <button onClick={() => setLanguage('en')} className={`${language === 'en' ? 'text-brand-green' : 'text-gray-500 hover:text-brand-dark'}`}>English</button>
                            <span className="text-gray-300">|</span>
                            <button onClick={() => setLanguage('ta')} className={`${language === 'ta' ? 'text-brand-green' : 'text-gray-500 hover:text-brand-dark'}`}>தமிழ்</button>
                        </div>
                        <div className="md:hidden flex items-center">
                            <button onClick={() => setIsMenuOpen(true)} className="text-brand-dark" aria-label="Open menu">
                                <MenuIcon className="w-8 h-8" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <MobileMenu />
            <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
        </>
    );
};

export default Header;