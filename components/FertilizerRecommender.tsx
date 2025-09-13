import React, { useState, useCallback } from 'react';
import { getFertilizerRecommendations } from '../services/geminiService';
import type { FertilizerResponse, FertilizerRecommendation } from '../types';
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

const RecommendationCard: React.FC<{ item: FertilizerRecommendation }> = ({ item }) => {
    const { t } = useTranslations();
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h4 className="text-lg font-bold text-brand-dark">{t('fertilizerRecommender.issueDetected')}: <span className="font-normal">{item.issueDetected}</span></h4>
            <div className="mt-3 space-y-3">
                <p className="text-sm text-gray-600"><strong className="font-semibold text-gray-800">{t('fertilizerRecommender.recommendation')}:</strong> {item.recommendationText}</p>
                <p className="text-sm text-gray-600"><strong className="font-semibold text-gray-800">{t('fertilizerRecommender.recommendedFertilizers')}:</strong> {item.recommendedFertilizers.join(', ')}</p>
                <p className="text-sm text-gray-600"><strong className="font-semibold text-gray-800">{t('fertilizerRecommender.irrigationAdvice')}:</strong> {item.irrigationAdvice}</p>
            </div>
        </div>
    );
};

const FertilizerRecommender: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [image, setImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [cropName, setCropName] = useState('');
    const [recommendations, setRecommendations] = useState<FertilizerResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const { t, language } = useTranslations();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setImage(URL.createObjectURL(selectedFile));
            setRecommendations(null);
            setError('');
        }
    };

    const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });

    const handleAnalyze = useCallback(async () => {
        if (!file || !cropName) {
            setError(t('fertilizerRecommender.errorPrefix'));
            return;
        }
        setIsLoading(true);
        setError('');
        setRecommendations(null);
        try {
            const base64Image = await toBase64(file);
            const result = await getFertilizerRecommendations(base64Image, file.type, cropName, language);
            setRecommendations(result);
        } catch (err) {
            setError(t('fertilizerRecommender.errorGeneric'));
        } finally {
            setIsLoading(false);
        }
    }, [file, cropName, language, t]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-slide-in">
                <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
                    <h2 className="text-2xl font-bold text-brand-dark">{t('fertilizerRecommender.title')}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="crop-name" className="block text-sm font-medium text-gray-700 mb-2">{t('fertilizerRecommender.cropNameLabel')}</label>
                            <input
                                id="crop-name"
                                type="text"
                                value={cropName}
                                onChange={(e) => setCropName(e.target.value)}
                                placeholder={t('fertilizerRecommender.cropNamePlaceholder')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-green focus:border-brand-green"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('fertilizerRecommender.uploadLabel')}</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="leaf-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-green hover:text-brand-green-light focus-within:outline-none">
                                            <span>{t('fertilizerRecommender.uploadButton')}</span>
                                            <input id="leaf-upload" name="leaf-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                        <p className="pl-1">{t('fertilizerRecommender.uploadHint')}</p>
                                    </div>
                                    <p className="text-xs text-gray-500">{t('fertilizerRecommender.uploadFormats')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {image && <div className="text-center"><img src={image} alt="Leaf preview" className="max-h-64 mx-auto rounded-lg shadow-md" /></div>}
                    
                    <div className="text-center">
                        <button onClick={handleAnalyze} disabled={isLoading || !image || !cropName} className="w-full sm:w-auto bg-brand-green text-white font-semibold px-8 py-3 rounded-full hover:bg-brand-green-light disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105">
                            {isLoading ? t('fertilizerRecommender.recommendingButton') : t('fertilizerRecommender.recommendButton')}
                        </button>
                    </div>

                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {isLoading && <Spinner />}

                    {recommendations && recommendations.recommendations.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <h3 className="text-lg font-semibold text-brand-dark mb-4">{t('fertilizerRecommender.resultsTitle')}</h3>
                            <div className="space-y-4">
                                {recommendations.recommendations.map((item, index) => <RecommendationCard key={index} item={item} />)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FertilizerRecommender;
