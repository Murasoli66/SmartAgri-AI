import React, { useState, useCallback, useEffect } from 'react';
import { getSoilAnalysis } from '../services/geminiService';
import { useTranslations } from '../hooks/useTranslations';
import { useFeedback } from '../hooks/useFeedback';

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const SpeakerOnIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
);

const SpeakerOffIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l-4-4m0 4l4-4" />
    </svg>
);


const Spinner: React.FC = () => (
    <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
    </div>
);


const SoilAnalyzer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [image, setImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [analysis, setAnalysis] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
    const { t, language } = useTranslations();
    const { showFeedbackModal, FeedbackModalComponent } = useFeedback('soilAnalyzer');

    // Effect to clean up speech synthesis when the component unmounts
    useEffect(() => {
        return () => {
            if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setImage(URL.createObjectURL(selectedFile));
            setAnalysis('');
            setError('');
        }
    };

    const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
        };
        reader.onerror = error => reject(error);
    });

    const handleAnalyze = useCallback(async () => {
        if (!file) {
            setError(t('soilAnalyzer.errorPrefix'));
            return;
        }
        setIsLoading(true);
        setError('');
        setAnalysis('');
        try {
            const base64Image = await toBase64(file);
            const result = await getSoilAnalysis(base64Image, file.type, language);
            setAnalysis(result);
            showFeedbackModal();
        } catch (err) {
            setError(t('soilAnalyzer.errorGeneric'));
        } finally {
            setIsLoading(false);
        }
    }, [file, language, t, showFeedbackModal]);

    const handleReadAloud = useCallback(() => {
        if (!analysis || !('speechSynthesis' in window)) return;

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(analysis);
        const voices = window.speechSynthesis.getVoices();
        
        // Find a voice that matches the current app language
        let selectedVoice = voices.find(voice => voice.lang.startsWith(language));
        if (!selectedVoice) {
            // Fallback if no specific language voice is found
            selectedVoice = voices.find(voice => voice.lang.startsWith('en')) || voices[0];
        }
        utterance.voice = selectedVoice;
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => {
            console.error('Speech synthesis error');
            setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
    }, [analysis, isSpeaking, language]);


    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-in">
                    <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
                        <h2 className="text-2xl font-bold text-brand-dark">{t('soilAnalyzer.title')}</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="p-6 space-y-6">
                        <div>
                            <label htmlFor="soil-upload" className="block text-sm font-medium text-gray-700 mb-2">{t('soilAnalyzer.uploadLabel')}</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="soil-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-green hover:text-brand-green-light focus-within:outline-none">
                                            <span>{t('soilAnalyzer.uploadButton')}</span>
                                            <input id="soil-upload" name="soil-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                        <p className="pl-1">{t('soilAnalyzer.uploadHint')}</p>
                                    </div>
                                    <p className="text-xs text-gray-500">{t('soilAnalyzer.uploadFormats')}</p>
                                </div>
                            </div>
                        </div>

                        {image && (
                            <div className="text-center">
                                <img src={image} alt="Soil preview" className="max-h-64 mx-auto rounded-lg shadow-md" />
                            </div>
                        )}

                        <div className="text-center">
                            <button 
                                onClick={handleAnalyze} 
                                disabled={isLoading || !image}
                                className="w-full sm:w-auto bg-brand-green text-white font-semibold px-8 py-3 rounded-full hover:bg-brand-green-light disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                            >
                                {isLoading ? t('soilAnalyzer.analyzingButton') : t('soilAnalyzer.analyzeButton')}
                            </button>
                        </div>

                        {error && <p className="text-red-500 text-center">{error}</p>}

                        {isLoading && <Spinner />}

                        {analysis && (
                            <div className="bg-gray-50 p-4 rounded-lg border">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-semibold text-brand-dark">{t('soilAnalyzer.reportTitle')}</h3>
                                    {'speechSynthesis' in window && (
                                        <button
                                            onClick={handleReadAloud}
                                            title={t('soilAnalyzer.readAloud')}
                                            aria-label={t('soilAnalyzer.readAloud')}
                                            className="p-2 text-gray-500 hover:text-brand-green rounded-full hover:bg-gray-100 transition-colors"
                                        >
                                            {isSpeaking ? <SpeakerOffIcon className="w-6 h-6" /> : <SpeakerOnIcon className="w-6 h-6" />}
                                        </button>
                                    )}
                                </div>
                                <div className="prose prose-sm max-w-none whitespace-pre-wrap">{analysis}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <FeedbackModalComponent />
        </>
    );
};

export default SoilAnalyzer;