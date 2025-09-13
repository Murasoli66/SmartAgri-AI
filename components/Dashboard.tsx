import React, { useState } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { useAuth } from '../hooks/useAuth';

// Import all the tool modals
import SoilAnalyzer from './SoilAnalyzer';
import Weather from './Weather';
import CropRecommender from './CropRecommender';
import FertilizerRecommender from './FertilizerRecommender';
import MarketAnalyzer from './MarketAnalyzer';
import UserDashboardModal from './UserDashboardModal';

const FeatureCard: React.FC<{ icon: JSX.Element; title: string; description: string; action: () => void }> = ({ icon, title, description, action }) => {
    const { t } = useTranslations();
    return (
        <div onClick={action} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col cursor-pointer">
            <div className="flex-shrink-0 text-brand-green mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-brand-dark">{title}</h3>
            <p className="text-gray-600 flex-grow">{description}</p>
            <div className="mt-4 text-brand-green font-semibold hover:text-brand-green-light transition-colors">
                {t('soilAnalyzer.analyzeButton').includes('Analyze') ? 'Try Now' : 'இப்பொழுது முயற்சி செய்'}
            </div>
        </div>
    );
};

const Icons = {
    Soil: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.8 11.25c.828 0 1.5-.746 1.5-1.667 0-.92-.672-1.667-1.5-1.667S6.3 8.663 6.3 9.583c0 .921.672 1.667 1.5 1.667zM16.2 11.25c.828 0 1.5-.746 1.5-1.667 0-.92-.672-1.667-1.5-1.667s-1.5.746-1.5 1.667c0 .921.672 1.667 1.5 1.667zM21 21H3" /></svg>,
    Crop: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    Water: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.006 3 11.5c0 4.556 4.03 8.25 9 8.25z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12a2 2 0 100-4 2 2 0 000 4z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15.75c2.485 0 4.5-1.79 4.5-4s-2.015-4-4.5-4-4.5 1.79-4.5 4 2.015 4 4.5 4z" /></svg>,
    Market: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    Weather: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h1m8-9v1m8.66-5.66l-.71.71M12 21v-1m-6.36 1.36l.71-.71M21 12h-1M5.64 5.64l-.71-.71M12 3a9 9 0 11-9 9 4.5 4.5 0 014.5-4.5 4.5 4.5 0 014.5 4.5 4.5 4.5 0 014.5 4.5A9 9 0 0112 3z" /></svg>,
    Dashboard: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
};

type ToolKey = 'soil' | 'crop' | 'weather' | 'fertilizer' | 'market' | 'user_dashboard';

const Dashboard: React.FC = () => {
    const { t } = useTranslations();
    const { user } = useAuth();
    const [activeTool, setActiveTool] = useState<ToolKey | null>(null);

    const allTools: { key: ToolKey; icon: JSX.Element; title: string; description: string; requiresAuth: boolean; }[] = [
        { key: 'user_dashboard', icon: Icons.Dashboard, title: t('dashboard.myDashboardTitle'), description: t('dashboard.myDashboardDesc'), requiresAuth: true },
        { key: 'soil', icon: Icons.Soil, title: t('dashboard.soilTitle'), description: t('dashboard.soilDesc'), requiresAuth: false },
        { key: 'crop', icon: Icons.Crop, title: t('dashboard.cropTitle'), description: t('dashboard.cropDesc'), requiresAuth: false },
        { key: 'weather', icon: Icons.Weather, title: t('dashboard.weatherTitle'), description: t('dashboard.weatherDesc'), requiresAuth: false },
        { key: 'fertilizer', icon: Icons.Water, title: t('dashboard.fertilizerTitle'), description: t('dashboard.fertilizerDesc'), requiresAuth: false },
        { key: 'market', icon: Icons.Market, title: t('dashboard.marketTitle'), description: t('dashboard.marketDesc'), requiresAuth: false },
    ];
    
    const visibleTools = allTools.filter(tool => !tool.requiresAuth || (tool.requiresAuth && user));

    const renderToolModal = () => {
        switch(activeTool) {
            case 'soil': return <SoilAnalyzer onClose={() => setActiveTool(null)} />;
            case 'weather': return <Weather onClose={() => setActiveTool(null)} />;
            case 'crop': return <CropRecommender onClose={() => setActiveTool(null)} />;
            case 'fertilizer': return <FertilizerRecommender onClose={() => setActiveTool(null)} />;
            case 'market': return <MarketAnalyzer onClose={() => setActiveTool(null)} />;
            case 'user_dashboard': return <UserDashboardModal onClose={() => setActiveTool(null)} />;
            default: return null;
        }
    }

    return (
        <>
            <section id="dashboard" className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold">{t('dashboard.mainTitle')}</h2>
                        <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
                            {t('dashboard.mainSubtitle')}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {visibleTools.map((tool) => (
                            <FeatureCard 
                                key={tool.key} 
                                title={tool.title}
                                description={tool.description}
                                icon={tool.icon}
                                action={() => setActiveTool(tool.key)}
                            />
                        ))}
                    </div>
                </div>
            </section>
            {renderToolModal()}
        </>
    );
};

export default Dashboard;
