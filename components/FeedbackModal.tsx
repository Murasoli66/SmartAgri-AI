import React, { useState } from 'react';
import { useTranslations } from '../hooks/useTranslations';

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const StarIcon: React.FC<{ filled: boolean, className?: string }> = ({ filled, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
);


interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => void;
    featureName: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, onSubmit, featureName }) => {
    const { t } = useTranslations();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);

    if (!isOpen) return null;

    const handleClose = () => {
        setSubmitted(false);
        setRating(0);
        setComment('');
        onClose();
    };

    const handleSubmit = () => {
        if (rating > 0) {
            onSubmit(rating, comment);
            setSubmitted(true);
            setTimeout(() => {
                handleClose();
            }, 1500); // Close modal after 1.5 seconds
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md animate-slide-in" role="dialog" aria-modal="true">
                <div className="p-5 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-brand-dark">
                        {t('feedback.title').replace('{featureName}', featureName)}
                    </h2>
                    <button onClick={handleClose} className="text-gray-500 hover:text-gray-800" aria-label="Close">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                {submitted ? (
                     <div className="p-8 text-center">
                        <h3 className="text-2xl font-semibold text-brand-green">{t('feedback.thankYou')}</h3>
                    </div>
                ) : (
                    <div className="p-6 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('feedback.ratingLabel')}</label>
                            <div className="flex space-x-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                        className="text-yellow-400 hover:text-yellow-500 transition-transform transform hover:scale-110"
                                        aria-label={`Rate ${star} out of 5 stars`}
                                    >
                                        <StarIcon filled={star <= (hoverRating || rating)} className="w-8 h-8" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="feedback-comment" className="block text-sm font-medium text-gray-700 mb-2">
                                {t('feedback.commentLabel')}
                            </label>
                            <textarea
                                id="feedback-comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder={t('feedback.commentPlaceholder')}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                            />
                        </div>
                        
                        <div className="text-right">
                            <button
                                onClick={handleSubmit}
                                disabled={rating === 0}
                                className="bg-brand-green text-white font-semibold px-6 py-2 rounded-full hover:bg-brand-green-light disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
                            >
                                {t('feedback.submitButton')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedbackModal;