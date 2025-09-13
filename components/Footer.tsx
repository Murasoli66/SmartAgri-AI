import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { useAuth } from '../hooks/useAuth';

const SocialIcon: React.FC<{ href: string, path: string }> = ({ href, path }) => (
    <a href={href} className="text-gray-400 hover:text-brand-green transition-colors">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d={path} />
        </svg>
    </a>
);

const Footer: React.FC = () => {
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
        <>
            <footer className="bg-brand-dark text-white">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold">{t('header.title')}</h3>
                            <p className="mt-2 text-gray-400">{t('footer.tagline')}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold">{t('footer.links')}</h4>
                            <ul className="mt-4 space-y-2">
                                <li><a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="text-gray-400 hover:text-white">{t('footer.home')}</a></li>
                                <li><a href="#about" onClick={(e) => handleNavClick(e, '#about')} className="text-gray-400 hover:text-white">{t('footer.about')}</a></li>
                                <li><a href="#dashboard" onClick={(e) => handleNavClick(e, '#dashboard')} className="text-gray-400 hover:text-white">{t('footer.dashboard')}</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold">{t('footer.support')}</h4>
                            <ul className="mt-4 space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white">{t('footer.contact')}</a></li>
                                {!user && (
                                    <>
                                        <li>
                                            <button onClick={() => openModal('login')} className="text-gray-400 hover:text-white text-left">
                                                {t('footer.login')}
                                            </button>
                                        </li>
                                        <li>
                                            <button onClick={() => openModal('register')} className="text-gray-400 hover:text-white text-left">
                                                {t('footer.register')}
                                            </button>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold">{t('footer.follow')}</h4>
                            <div className="mt-4 flex space-x-4">
                                <SocialIcon href="#" path="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z" />
                                <SocialIcon href="#" path="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7,15.5V8.5L12,12L7,15.5M12.5,15.5V8.5L17.5,12L12.5,15.5Z" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
                        &copy; {new Date().getFullYear()} {t('footer.copyright')}
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;