import React, { useState, useCallback } from 'react';
import { getMarketAnalysis } from '../services/geminiService';
import type { MarketAnalysis, Season } from '../types';
import { useTranslations } from '../hooks/useTranslations';

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const Spinner: React.FC = () => (
    <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
    </div>
);

const DemandIndicator: React.FC<{ demand: 'Strong' | 'Stable' | 'Weak' }> = ({ demand }) => {
    const { t } = useTranslations();
    const demandInfo = {
        Strong: { classes: 'bg-green-100 text-green-800', text: t('marketAnalyzer.demand.Strong') },
        Stable: { classes: 'bg-yellow-100 text-yellow-800', text: t('marketAnalyzer.demand.Stable') },
        Weak: { classes: 'bg-red-100 text-red-800', text: t('marketAnalyzer.demand.Weak') },
    };
    const info = demandInfo[demand];
    return <span className={`px-3 py-1 text-sm font-semibold rounded-full ${info.classes}`}>{info.text}</span>;
};

const MarketAnalyzer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { t, language } = useTranslations();
    const [crop, setCrop] = useState('');
    const [season, setSeason] = useState<Season | ''>('');
    const [month, setMonth] = useState('');
    const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const crops = ['Corn', 'Wheat', 'Soy', 'Cotton', 'Rice'];
    const seasons: Season[] = ['Spring', 'Summer', 'Autumn', 'Winter'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const handleAnalyze = useCallback(async () => {
        if (!crop || !season || !month) {
            setError(t('marketAnalyzer.errorPrefix'));
            return;
        }
        setIsLoading(true);
        setError('');
        setAnalysis(null);
        try {
            const result = await getMarketAnalysis(crop, season, month, language);
            setAnalysis(result);
        } catch (err) {
            setError(t('marketAnalyzer.errorGeneric'));
        } finally {
            setIsLoading(false);
        }
    }, [crop, season, month, language, t]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-in">
                <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
                    <h2 className="text-2xl font-bold text-brand-dark">{t('marketAnalyzer.title')}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><CloseIcon className="w-6 h-6" /></button>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="crop-select" className="block text-sm font-medium text-gray-700 mb-1">{t('marketAnalyzer.cropLabel')}</label>
                            <select id="crop-select" value={crop} onChange={e => setCrop(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-green focus:border-brand-green">
                                <option value="" disabled>Select</option>
                                {crops.map(c => <option key={c} value={c}>{t(`dashboard.crop_${c.toLowerCase()}`)}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="season-select" className="block text-sm font-medium text-gray-700 mb-1">{t('marketAnalyzer.seasonLabel')}</label>
                            <select id="season-select" value={season} onChange={e => setSeason(e.target.value as Season)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-green focus:border-brand-green">
                                <option value="" disabled>Select</option>
                                {seasons.map(s => <option key={s} value={s}>{t(`seasons.${s}`)}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="month-select" className="block text-sm font-medium text-gray-700 mb-1">{t('marketAnalyzer.monthLabel')}</label>
                            <select id="month-select" value={month} onChange={e => setMonth(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-green focus:border-brand-green">
                                <option value="" disabled>Select</option>
                                {months.map(m => <option key={m} value={m}>{t(`months.${m}`)}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="text-center">
                        <button onClick={handleAnalyze} disabled={isLoading || !crop || !season || !month} className="w-full sm:w-auto bg-brand-green text-white font-semibold px-8 py-3 rounded-full hover:bg-brand-green-light disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300">
                            {isLoading ? t('marketAnalyzer.analyzingButton') : t('marketAnalyzer.analyzeButton')}
                        </button>
                    </div>

                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {isLoading && <Spinner />}

                    {analysis && (
                        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border animate-fade-in">
                             {/* FIX: The translation function `t` expects only one argument. Changed to use `.replace()` for variable substitution. */}
                             <h3 className="text-lg font-semibold text-brand-dark mb-4">{t('marketAnalyzer.resultsTitle').replace('{crop}', t(`dashboard.crop_${analysis.crop.toLowerCase()}`)).replace('{month}', t(`months.${month}`)).replace('{season}', t(`seasons.${season as Season}`))}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-800">{t('marketAnalyzer.priceForecast')}</h4>
                                    <div className="flex justify-between items-center bg-green-50 p-3 rounded-md">
                                        <span className="font-medium text-green-800">{t('marketAnalyzer.high')}</span>
                                        <span className="font-bold text-lg text-green-900">${analysis.priceHighUSD.toFixed(2)}</span>
                                    </div>
                                     <div className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
                                        <span className="font-medium text-gray-800">{t('marketAnalyzer.average')}</span>
                                        <span className="font-bold text-lg text-gray-900">${analysis.priceAverageUSD.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-red-50 p-3 rounded-md">
                                        <span className="font-medium text-red-800">{t('marketAnalyzer.low')}</span>
                                        <span className="font-bold text-lg text-red-900">${analysis.priceLowUSD.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-800">{t('marketAnalyzer.demandOutlook')}</h4>
                                    <div className="flex justify-center items-center h-full bg-white p-3 rounded-md border">
                                        <DemandIndicator demand={analysis.demandOutlook} />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <h4 className="font-semibold text-gray-800 mb-2">{t('marketAnalyzer.marketInsights')}</h4>
                                <p className="text-sm text-gray-700 bg-white p-3 rounded-md border">{analysis.marketInsights}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MarketAnalyzer;