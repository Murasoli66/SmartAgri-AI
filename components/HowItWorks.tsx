import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

const Step: React.FC<{ number: number; title: string; description: string; isLast?: boolean }> = ({ number, title, description, isLast = false }) => (
    <div className="flex items-start">
        <div className="flex flex-col items-center mr-6">
            <div className="w-12 h-12 rounded-full bg-brand-green text-white flex items-center justify-center text-xl font-bold z-10">
                {number}
            </div>
            {!isLast && <div className="w-0.5 h-full bg-gray-300 mt-2"></div>}
        </div>
        <div className="pb-10">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    </div>
);

const HowItWorks: React.FC = () => {
    const { t } = useTranslations();

    const steps = [
        {
            title: t('howItWorks.step1Title'),
            description: t('howItWorks.step1Desc')
        },
        {
            title: t('howItWorks.step2Title'),
            description: t('howItWorks.step2Desc')
        },
        {
            title: t('howItWorks.step3Title'),
            description: t('howItWorks.step3Desc')
        },
        {
            title: t('howItWorks.step4Title'),
            description: t('howItWorks.step4Desc')
        }
    ];

    return (
        <section id="how-it-works" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">{t('howItWorks.title')}</h2>
                    <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
                        {t('howItWorks.subtitle')}
                    </p>
                </div>
                <div className="max-w-2xl mx-auto">
                    {steps.map((step, index) => (
                        <Step
                            key={index}
                            number={index + 1}
                            title={step.title}
                            description={step.description}
                            isLast={index === steps.length - 1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;