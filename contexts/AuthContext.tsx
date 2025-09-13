import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { User } from '../types';

interface AuthContextType {
    user: User | null;
    login: (name: string, role: 'farmer' | 'broker') => void;
    logout: () => void;
    isLoginModalOpen: boolean;
    modalMode: 'login' | 'register';
    openModal: (mode: 'login' | 'register') => void;
    closeModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'agri_ai_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'login' | 'register'>('login');

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem(USER_STORAGE_KEY);
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.removeItem(USER_STORAGE_KEY);
        }
    }, []);

    const login = (name: string, role: 'farmer' | 'broker') => {
        const newUser: User = { name, role };
        try {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
            setUser(newUser);
        } catch (error) {
            console.error("Failed to save user to localStorage", error);
        }
    };

    const logout = () => {
        try {
            localStorage.removeItem(USER_STORAGE_KEY);
            setUser(null);
        } catch (error) {
            console.error("Failed to remove user from localStorage", error);
        }
    };

    const openModal = (mode: 'login' | 'register') => {
        setModalMode(mode);
        setIsLoginModalOpen(true);
    };

    const closeModal = () => {
        setIsLoginModalOpen(false);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoginModalOpen, modalMode, openModal, closeModal }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};