import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTranslations } from '../hooks/useTranslations';

const ProfileDropdown: React.FC = () => {
    const { user, logout } = useAuth();
    const { t } = useTranslations();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const getInitials = (name: string) => {
        const names = name.split(' ');
        const initials = names.map(n => n[0]).join('');
        return initials.slice(0, 2).toUpperCase();
    };
    
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
