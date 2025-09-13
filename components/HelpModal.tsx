import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTranslations } from '../hooks/useTranslations';

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const Icons = {
    Soil: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.8 11.25c.828 0 1.5-.746 1.5-1.667 0-.92-.672-1.667-1.5-1.667S6.3 8.663 6.3 9.583c0 .921.672 1.667 1.5 1.667zM16.2 11.25c.828 0 1.5-.746 1.5-1.667 0-.92-.672-1.667-1.5-1.667s-1.5.746-1.5 1.667c0 .921.672 1.667 1.5 1.667zM21 21H3" /></svg>,
    Weather: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h1m8-9v1m8.66-5.66l-.71.71M12 21v-1m-6.36 1.36l.71-.71M21 12h-1M5.64 5.64l-.71-.71M12 3a9 9 0 11-9 9 4.5 4.5 0 014.5-4.5 4.5 4.5 0 014.5 4.5 4.5 4.5 0 014.5 4.5A9 9 0 0112 3z" /></svg>,
    Chat: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
    Dashboard: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    Market: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    Users: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
};

type HelpTab = 'general' | 'farmer' | 'broker';

const FeatureHelpItem: React.FC<{ icon: JSX.Element; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 text-brand-green mt-1">{icon}</div>
        <div>
            <h4 className="font-semibold text-brand-dark">{title}</h4>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    </div>
);


const HelpModal: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
    const { t } = useTranslations();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<HelpTab>('general');

    useEffect(() => {
        if (isOpen) {
            if (user?.role === 'farmer') {
                setActiveTab('farmer');
            } else if (user?.role === 'broker') {
                setActiveTab('broker');
            } else {
                setActiveTab('general');
            }
        }
    }, [isOpen, user]);
    
    if (!isOpen) return null;

    const TabButton: React.FC<{ tab: HelpTab, children: React.ReactNode }> = ({ tab, children }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                activeTab === tab 
                ? 'border-b-2 border-brand-green text-brand-green' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
        >
            {children}
        </button>
    );

    const farmerFeatures = [
        { icon: Icons.Soil, title: t('helpModal.featureSoilTitle'), description: t('helpModal.featureSoilDesc') },
        { icon: Icons.Weather, title: t('helpModal.featureWeatherTitle'), description: t('helpModal.featureWeatherDesc') },
        { icon: Icons.Chat, title: t('helpModal.featureChatbotTitle'), description: t('helpModal.featureChatbotDesc') },
        { icon: Icons.Dashboard, title: t('helpModal.featureDashboardTitle'), description: t('helpModal.featureDashboardDesc') },
    ];
    
    const brokerFeatures = [
        { icon: Icons.Market, title: t('helpModal.featureMarketTitle'), description: t('helpModal.featureMarketDesc') },
        { icon: Icons.Users, title: t('helpModal.featureConnectTitle'), description: t('helpModal.featureConnectDesc') },
        { icon: Icons.Dashboard, title: t('helpModal.featureDashboardTitle'), description: t('helpModal.featureDashboardDesc') },
        { icon: Icons.Chat, title: t('helpModal.featureChatbotTitle'), description: t('helpModal.featureChatbotDesc') },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg animate-slide-in" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
                <div className="p-5 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-brand-dark">{t('helpModal.title')}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label={t('helpModal.closeButton')}>
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-4 px-5" aria-label="Tabs">
                        <TabButton tab="general">{t('helpModal.generalTab')}</TabButton>
                        <TabButton tab="farmer">{t('helpModal.farmerTab')}</TabButton>
                        <TabButton tab="broker">{t('helpModal.brokerTab')}</TabButton>
                    </nav>
                </div>
                
                <div className="p-6">
                    {activeTab === 'general' && (
                        <div className="space-y-4">
                            <p className="text-gray-700">{t('helpModal.generalIntro')}</p>
                        </div>
                    )}
                    {activeTab === 'farmer' && (
                        <div className="space-y-5">
                            <p className="text-gray-700 mb-4">{t('helpModal.farmerIntro')}</p>
                            {farmerFeatures.map(f => <FeatureHelpItem key={f.title} {...f} />)}
                        </div>
                    )}
                    {activeTab === 'broker' && (
                        <div className="space-y-5">
                           <p className="text-gray-700 mb-4">{t('helpModal.brokerIntro')}</p>
                           {brokerFeatures.map(f => <FeatureHelpItem key={f.title} {...f} />)}
                        </div>
                    )}
                </div>

                <div className="p-5 bg-gray-50 border-t text-right">
                    <button
                        onClick={onClose}
                        className="bg-brand-green text-white font-semibold px-6 py-2 rounded-full hover:bg-brand-green-light transition-all duration-300"
                    >
                        {t('helpModal.gotItButton')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelpModal;
