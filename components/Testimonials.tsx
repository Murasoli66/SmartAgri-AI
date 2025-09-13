import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

const TestimonialCard: React.FC<{ quote: string; name: string; location: string; image: string }> = ({ quote, name, location, image }) => (
    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <img src={image} alt={name} className="w-20 h-20 rounded-full mx-auto -mt-16 border-4 border-white" />
        <p className="text-gray-600 italic my-6">"{quote}"</p>
        <h4 className="font-semibold text-lg">{name}</h4>
        <p className="text-gray-500">{location}</p>
    </div>
);

const Testimonials: React.FC = () => {
    const { t } = useTranslations();
    const testimonials = [
        {
            quote: "This AI platform is a game-changer. My corn yield increased by 20% in the first season thanks to the precise irrigation schedules.",
            name: "John Doe",
            location: "Corn Farmer, Iowa",
            image: "https://picsum.photos/seed/farmer1/100/100"
        },
        {
            quote: "The disease prediction feature saved my vineyard. I got an alert for downy mildew and was able to act before it spread. Incredible technology!",
            name: "Maria Garcia",
            location: "Vineyard Owner, California",
            image: "https://picsum.photos/seed/farmer2/100/100"
        },
        {
            quote: "As a young farmer, the AI chatbot has been like having a mentor 24/7. It helps me make confident decisions every single day.",
            name: "Samuel Chen",
            location: "Vegetable Farmer, Ohio",
            image: "https://picsum.photos/seed/farmer3/100/100"
        }
    ];

    return (
        <section id="testimonials" className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold">{t('testimonials.title')}</h2>
                    <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
                        {t('testimonials.subtitle')}
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24 md:gap-8 pt-12">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard key={index} {...testimonial} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;