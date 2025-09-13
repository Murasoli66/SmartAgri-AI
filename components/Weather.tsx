import React, { useState, useCallback } from 'react';
import { getWeatherForecast } from '../services/geminiService';
import type { WeatherForecast, WeatherDay } from '../types';
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

// Weather Icons
const WeatherIcons: { [key: string]: React.FC<{ className?: string }> } = {
    Sunny: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 12a5 5 0 100-10 5 5 0 000 10z" /></svg>,
    "Partly Cloudy": ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h1m8-9v1M5.636 5.636l.707.707M2.05 14.95a9 9 0 0111.95 0M16 19h.01M19 12h1m-2.364-6.364l.707-.707" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 13a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    Cloudy: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h1M5.636 5.636l.707.707M12 3v1m2.364 2.636l.707-.707M19 12h1m-1.95 2.05a9 9 0 11-11.95 0" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 19h.01" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 13a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    Rain: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.64 17.66A9 9 0 0112 3v1m0 16v1m-6.36-1.36L5 18M18.36 5.64L19 5M12 12a5 5 0 000-10 5 5 0 00-5 5c0 2.08.86 3.96 2.21 5.29L12 17l2.79-2.71A5.002 5.002 0 0017 7a5 5 0 00-5-5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14h0" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 17h0" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 14h0" /></svg>,
    Thunderstorm: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6l-3 9-3-9zm-6 6h18M3 12a9 9 0 019-9 9 9 0 019 9" /></svg>,
    Snow: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m-6.36-1.36L5 18M18.36 5.64L19 5M12 12a5 5 0 000-10 5 5 0 00-5 5c0 .35.04.69.1 1.02M17 7a5 5 0 00-5-5c-.35 0-.69.04-1.02.1" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12a5 5 0 100-10 5 5 0 000 10z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9 9 0 100-18 9 9 0 000 18z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h1m8-9v1m8.66-5.66l-.71.71M12 21v-1m-6.36 1.36l.71-.71M21 12h-1M5.64 5.64l-.71-.71" /></svg>,
    Default: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2" d="M12 21a9 9 0 100-18 9 9 0 000 18z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h1m8-9v1m8.66-5.66l-.71.71M12 21v-1m-6.36 1.36l.71-.71M21 12h-1M5.64 5.64l-.71-.71" /></svg>,
};


const getWeatherIcon = (condition: string): React.FC<{ className?: string }> => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) return WeatherIcons.Sunny;
    if (lowerCondition.includes('partly cloudy')) return WeatherIcons['Partly Cloudy'];
    if (lowerCondition.includes('cloud')) return WeatherIcons.Cloudy;
    if (lowerCondition.includes('rain') || lowerCondition.includes('shower')) return WeatherIcons.Rain;
    if (lowerCondition.includes('storm') || lowerCondition.includes('thunder')) return WeatherIcons.Thunderstorm;
    if (lowerCondition.includes('snow')) return WeatherIcons.Snow;
    return WeatherIcons.Default;
};


const Weather: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [location, setLocation] = useState<string>('');
    const [forecast, setForecast] = useState<WeatherForecast | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const { t, language } = useTranslations();

    const handleGetForecast = useCallback(async () => {
        if (!location) {
            setError(t('weather.errorPrefix'));
            return;
        }
        setIsLoading(true);
        setError('');
        setForecast(null);
        try {
            const result = await getWeatherForecast(location, language);
            if (!result || !result.forecast || result.forecast.length === 0) {
                 throw new Error("Invalid forecast data received");
            }
            setForecast(result);
        } catch (err) {
            setError(t('weather.errorGeneric'));
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [location, language, t]);

    const DayCard: React.FC<{ day: WeatherDay }> = ({ day }) => {
        const Icon = getWeatherIcon(day.condition);
        return (
             <div className="bg-gray-100 p-4 rounded-lg text-center flex-1 min-w-[120px]">
                <h4 className="font-semibold text-lg">{day.day}</h4>
                <Icon className="w-12 h-12 mx-auto my-2 text-yellow-500" />
                <p className="text-sm text-gray-600">{day.condition}</p>
                <div className="mt-2">
                    <p className="text-xl font-bold">{t('weather.high')}: {day.high_c}°C</p>
                    <p className="text-md text-gray-500">{t('weather.low')}: {day.low_c}°C</p>
                </div>
            </div>
        )
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-slide-in">
                <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
                    <h2 className="text-2xl font-bold text-brand-dark">{t('weather.title')}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleGetForecast()}
                            placeholder={t('weather.locationPlaceholder')}
                            className="flex-grow w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-green"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleGetForecast}
                            disabled={isLoading || !location}
                            className="bg-brand-green text-white font-semibold px-8 py-2 rounded-full hover:bg-brand-green-light disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
                        >
                            {isLoading ? t('weather.gettingForecastButton') : t('weather.getForecastButton')}
                        </button>
                    </div>

                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {isLoading && <Spinner />}

                    {forecast && (
                        <div className="space-y-6 animate-fade-in">
                            {/* Today's Forecast */}
                            <div className="bg-brand-green/10 p-6 rounded-lg flex flex-col md:flex-row items-center gap-6">
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold">{forecast.forecast[0].day}</h3>
                                    {React.createElement(getWeatherIcon(forecast.forecast[0].condition), { className: "w-24 h-24 mx-auto my-2 text-brand-green" })}
                                    <p className="text-lg text-gray-700">{forecast.forecast[0].condition}</p>
                                </div>
                                <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                    <div>
                                        <p className="text-sm text-gray-500 uppercase">{t('weather.high')}</p>
                                        <p className="text-3xl font-bold">{forecast.forecast[0].high_c}°C</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 uppercase">{t('weather.low')}</p>
                                        <p className="text-3xl font-bold">{forecast.forecast[0].low_c}°C</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 uppercase">{t('weather.wind')}</p>
                                        <p className="text-3xl font-bold">{forecast.forecast[0].wind_kph}<span className="text-lg"> km/h</span></p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 uppercase">{t('weather.humidity')}</p>
                                        <p className="text-3xl font-bold">{forecast.forecast[0].humidity_percent}%</p>
                                    </div>
                                </div>
                            </div>
                            {/* 4-Day Forecast */}
                            <div className="flex flex-wrap gap-4 justify-center">
                                {forecast.forecast.slice(1).map((day, index) => (
                                    <DayCard key={index} day={day} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Weather;
