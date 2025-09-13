// FIX: Removed self-import of 'ChatMessage' which caused a name collision.
export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface User {
    name: string;
    role: 'farmer' | 'broker';
}

export interface WeatherDay {
    day: string;
    condition: string;
    high_c: number;
    low_c: number;
    wind_kph: number;
    humidity_percent: number;
}

export interface WeatherForecast {
    forecast: WeatherDay[];
}

export interface RecommendedCrop {
    cropName: string;
    suitabilityScore: number;
    reasoning: string;
    marketDemand: 'High' | 'Medium' | 'Low';
}

export interface CropRecommendationResponse {
    recommendations: RecommendedCrop[];
}

export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';

export interface FertilizerRecommendation {
    issueDetected: string;
    recommendationText: string;
    recommendedFertilizers: string[];
    irrigationAdvice: string;
}

export interface FertilizerResponse {
    recommendations: FertilizerRecommendation[];
}

export interface MarketAnalysis {
    crop: string;
    priceHighUSD: number;
    priceAverageUSD: number;
    priceLowUSD: number;
    demandOutlook: 'Strong' | 'Stable' | 'Weak';
    marketInsights: string;
}
