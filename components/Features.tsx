import React, { useState } from 'react';
import SoilAnalyzer from './SoilAnalyzer';
import Weather from './Weather';
import CropRecommender from './CropRecommender';
import FertilizerRecommender from './FertilizerRecommender';
import MarketAnalyzer from './MarketAnalyzer';
import { useTranslations } from '../hooks/useTranslations';

const FeatureCard: React.FC<{ icon: JSX.Element; title: string; description: string; actionText: string; action?: () => void }> = ({ icon, title, description, actionText, action }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col">
        <div className="flex-shrink-0 text-brand-green mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 flex-grow">{description}</p>
        {action && (
            <button onClick={action} className="mt-4 text-left text-brand-green font-semibold hover:text-brand-green-light transition-colors">
                {actionText}
            </button>
        )}
    </div>
);

const Icons = {
    Soil: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.8 11.25c.828 0 1.5-.746 1.5-1.667 0-.92-.672-1.667-1.5-1.667S6.3 8.663 6.3 9.583c0 .921.672 1.667 1.5 1.667zM16.2 11.25c.828 0 1.5-.746 1.5-1.667 0-.92-.672-1.667-1.5-1.667s-1.5.746-1.5 1.667c0 .921.672 1.667 1.5 1.667zM21 21H3" /></svg>,
    Crop: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    Water: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.006 3 11.5c0 4.556 4.03 8.25 9 8.25z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12a2 2 0 100-4 2 2 0 000 4z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15.75c2.485 0 4.5-1.79 4.5-4s-2.015-4-4.5-4-4.5 1.79-4.5 4 2.015 4 4.5 4z" /></svg>,
    Alert: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
    Chat: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
    Market: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    Weather: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h1m8-9v1m8.66-5.66l-.71.71M12 21v-1m-6.36 1.36l.71-.71M21 12h-1M5.64 5.64l-.71-.71M12 3a9 9 0 11-9 9 4.5 4.5 0 014.5-4.5 4.5 4.5 0 014.5 4.5 4.5 4.5 0 014.5 4.5A9 9 0 0112 3z" /></svg>,
};

const Features: React.FC = () => {
    const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false);
    const [isWeatherOpen, setIsWeatherOpen] = useState(false);
    const [isRecommenderOpen, setIsRecommenderOpen] = useState(false);
    const [isFertilizerOpen, setIsFertilizerOpen] = useState(false);
    const [isMarketOpen, setIsMarketOpen] = useState(false);
    const { t } = useTranslations();

    const featureList = [
        {
            icon: Icons.Soil,
            title: t('features.soilAnalysisTitle'),
            description: t('features.soilAnalysisDesc'),
            action: () => setIsAnalyzerOpen(true)
        },
        {
            icon: Icons.Crop,
            title: t('features.cropRecTitle'),
            description: t('features.cropRecDesc'),
            action: () => setIsRecommenderOpen(true)
        },
        {
            icon: Icons.Weather,
            title: t('features.weatherTitle'),
            description: t('features.weatherDesc'),
            action: () => setIsWeatherOpen(true)
        },
        {
            icon: Icons.Water,
            title: t('features.fertilizerTitle'),
            description: t('features.fertilizerDesc'),
            action: () => setIsFertilizerOpen(true)
        },
        {
            icon: Icons.Alert,
            title: t('features.diseaseTitle'),
            description: t('features.diseaseDesc')
        },
        {
            icon: Icons.Market,
            title: t('features.marketTitle'),
            description: t('features.marketDesc'),
            action: () => setIsMarketOpen(true)
        }
    ];

    return (
        <>
            <section id="features" className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold">{t('features.title')}</h2>
                        <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
                            {t('features.subtitle')}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featureList.map((feature, index) => (
                            <FeatureCard key={index} {...feature} actionText={t('features.tryNow')} />
                        ))}
                    </div>
                </div>
            </section>
            {isAnalyzerOpen && <SoilAnalyzer onClose={() => setIsAnalyzerOpen(false)} />}
            {isWeatherOpen && <Weather onClose={() => setIsWeatherOpen(false)} />}
            {isRecommenderOpen && <CropRecommender onClose={() => setIsRecommenderOpen(false)} />}
            {isFertilizerOpen && <FertilizerRecommender onClose={() => setIsFertilizerOpen(false)} />}
            {isMarketOpen && <MarketAnalyzer onClose={() => setIsMarketOpen(false)} />}
        </>
    );
};

export default Features;
