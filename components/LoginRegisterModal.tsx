import React, { useState, useEffect } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { useAuth } from '../hooks/useAuth';

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const LoginRegisterModal: React.FC = () => {
    const { t } = useTranslations();
    const { login, isLoginModalOpen, closeModal, modalMode } = useAuth();
    
    const [name, setName] = useState('');
    const [role, setRole] = useState<'farmer' | 'broker'>('farmer');
    const [error, setError] = useState('');
    const [activeMode, setActiveMode] = useState(modalMode);

    useEffect(() => {
        if (isLoginModalOpen) {
            setActiveMode(modalMode);
            // Reset form on open
            setName('');
            setRole('farmer');
            setError('');
        }
    }, [isLoginModalOpen, modalMode]);
    

    if (!isLoginModalOpen) return null;

    const handleSubmit = () => {
        if (name.trim() === '') {
            setError(t('login.error'));
            return;
        }
        setError('');
        login(name, role);
        closeModal();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md animate-slide-in" role="dialog" aria-modal="true">
                <div className="p-5 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-brand-dark">
                        {activeMode === 'login' ? t('login.loginTitle') : t('login.registerTitle')}
                    </h2>
                    <button onClick={closeModal} className="text-gray-500 hover:text-gray-800" aria-label="Close">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 space-y-5">
                    <div>
                        <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 mb-1">{t('login.nameLabel')}</label>
                        <input
                            type="text"
                            id="full-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('login.namePlaceholder')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('login.roleLabel')}</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setRole('farmer')}
                                className={`p-4 border rounded-md text-center transition-colors ${role === 'farmer' ? 'bg-brand-green text-white border-brand-green ring-2 ring-brand-green-light' : 'bg-gray-50 hover:bg-gray-100'}`}
                            >
                                {t('login.farmer')}
                            </button>
                            <button
                                onClick={() => setRole('broker')}
                                className={`p-4 border rounded-md text-center transition-colors ${role === 'broker' ? 'bg-brand-green text-white border-brand-green ring-2 ring-brand-green-light' : 'bg-gray-50 hover:bg-gray-100'}`}
                            >
                                {t('login.broker')}
                            </button>
                        </div>
                    </div>
                    <div className="pt-2">
                        <button
                            onClick={handleSubmit}
                            className="w-full bg-brand-green text-white font-semibold py-3 rounded-full hover:bg-brand-green-light transition-all duration-300"
                        >
                            {activeMode === 'login' ? t('login.loginButton') : t('login.registerButton')}
                        </button>
                    </div>
                     <div className="text-center text-sm text-gray-600">
                        {activeMode === 'login' ? (
                            <span>
                                {t('login.switchToRegisterPrompt')}{' '}
                                <button onClick={() => setActiveMode('register')} className="font-medium text-brand-green hover:underline">{t('login.switchToRegisterLink')}</button>
                            </span>
                        ) : (
                             <span>
                                {t('login.switchToLoginPrompt')}{' '}
                                <button onClick={() => setActiveMode('login')} className="font-medium text-brand-green hover:underline">{t('login.switchToLoginLink')}</button>
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginRegisterModal;