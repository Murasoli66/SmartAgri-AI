import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTranslations } from '../hooks/useTranslations';

const ProfileDropdown: React.FC = () => {
    const { user, logout } = useAuth();
    const { t } = useTranslations();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isToggling, setIsToggling] = useState(false);
    const [pushSupport, setPushSupport] = useState(false);

    const getInitials = (name: string) => {
        const names = name.split(' ');
        const initials = names.map(n => n[0]).join('');
        return initials.slice(0, 2).toUpperCase();
    };
    
    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setPushSupport(true);
            navigator.serviceWorker.ready.then(registration => {
                registration.pushManager.getSubscription().then(subscription => {
                    if (subscription) {
                        setIsSubscribed(true);
                    }
                });
            });
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    const handleToggleClick = useCallback(async () => {
        if (isToggling) return;
        setIsToggling(true);

        const registration = await navigator.serviceWorker.ready;

        if (isSubscribed) {
            const subscription = await registration.pushManager.getSubscription();
            if (subscription) {
                await subscription.unsubscribe();
                console.log('User unsubscribed successfully.');
                setIsSubscribed(false);
            }
        } else {
            try {
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') {
                    console.warn('Notification permission not granted.');
                    setIsToggling(false);
                    return;
                }
                
                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    // In a real application, you would provide a VAPID public key
                    // from your server to secure the push notifications.
                    // applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY'
                });

                console.log('User subscribed:', JSON.stringify(subscription));
                // In a real app, you would send this subscription object to your backend.
                setIsSubscribed(true);
            } catch (error) {
                console.error('Failed to subscribe the user: ', error);
                if (Notification.permission === 'denied') {
                    alert('You have blocked notifications. Please enable them in your browser settings to use this feature.');
                }
            }
        }

        setIsToggling(false);
    }, [isSubscribed, isToggling]);

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-brand-green text-white flex items-center justify-center font-bold text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green"
            >
                {getInitials(user.name)}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 origin-top-right animate-fade-in" style={{ animationDuration: '150ms' }}>
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <div className="px-4 py-2 border-b">
                            <p className="text-sm font-semibold text-gray-900 truncate" title={user.name}>{user.name}</p>
                            <p className="text-sm text-gray-500">{t(`profile.role_${user.role}`)}</p>
                        </div>
                        
                        {pushSupport && (
                             <div className="px-4 py-3 border-b" role="menuitem">
                                <div className="flex justify-between items-center">
                                    <label htmlFor="notifications-toggle" className="text-sm font-medium text-gray-800">{t('profile.notifications')}</label>
                                    <button
                                        id="notifications-toggle"
                                        onClick={handleToggleClick}
                                        disabled={isToggling}
                                        role="switch"
                                        aria-checked={isSubscribed}
                                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green disabled:opacity-50 ${isSubscribed ? 'bg-brand-green' : 'bg-gray-200'}`}
                                    >
                                        <span
                                            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${isSubscribed ? 'translate-x-6' : 'translate-x-1'}`}
                                        />
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{t('profile.notificationsDesc')}</p>
                            </div>
                        )}

                        <button
                            onClick={logout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            role="menuitem"
                        >
                            {t('profile.logout')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;