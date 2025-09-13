import React, { useState, useCallback } from 'react';
import FeedbackModal from '../components/FeedbackModal';
import { useTranslations } from './useTranslations';

const FEEDBACK_KEY = 'agri_ai_feedback';
const FEEDBACK_COOLDOWN = 1000 * 60 * 60 * 24 * 7; // 7 days in milliseconds

interface Feedback {
    featureKey: string;
    rating: number;
    comment: string;
    timestamp: number;
}

export const useFeedback = (featureKey: 'soilAnalyzer' | 'chatbot') => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { t } = useTranslations();

    const shouldRequestFeedback = useCallback(() => {
        try {
            const storedFeedback: Feedback[] = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '[]');
            const lastFeedbackForFeature = storedFeedback
                .filter(f => f.featureKey === featureKey)
                .sort((a, b) => b.timestamp - a.timestamp)[0];

            if (!lastFeedbackForFeature) {
                return true; // No feedback given yet for this feature
            }

            // Check if the last feedback was more than the cooldown period ago
            return Date.now() - lastFeedbackForFeature.timestamp > FEEDBACK_COOLDOWN;
        } catch (error) {
            console.error("Failed to read feedback from localStorage", error);
            return false; // Don't show modal if localStorage is broken
        }
    }, [featureKey]);

    const showFeedbackModal = useCallback(() => {
        if (shouldRequestFeedback()) {
            setIsModalOpen(true);
        }
    }, [shouldRequestFeedback]);

    const handleClose = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = useCallback((rating: number, comment: string) => {
        try {
            const storedFeedback: Feedback[] = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '[]');
            const newFeedback: Feedback = {
                featureKey,
                rating,
                comment,
                timestamp: Date.now()
            };
            const updatedFeedback = [...storedFeedback, newFeedback];
            localStorage.setItem(FEEDBACK_KEY, JSON.stringify(updatedFeedback));
        } catch (error) {
            console.error("Failed to save feedback to localStorage", error);
        } finally {
            handleClose();
        }
    }, [featureKey]);

    const translatedFeatureName = t(`feedback.feature.${featureKey}`);

    // FIX: Replaced JSX with React.createElement because this is a .ts file, not a .tsx file.
    // JSX syntax is not valid in .ts files and was causing a cascade of parsing errors.
    const FeedbackModalComponent = () => (
        React.createElement(FeedbackModal, {
            isOpen: isModalOpen,
            onClose: handleClose,
            onSubmit: handleSubmit,
            featureName: translatedFeatureName,
        })
    );

    return { showFeedbackModal, FeedbackModalComponent };
};
