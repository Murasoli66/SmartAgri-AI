import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import type { WeatherForecast, CropRecommendationResponse, Season, FertilizerResponse, MarketAnalysis } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const prompts = {
    soilAnalysis: {
        en: "Analyze this soil image for agricultural purposes. Provide a report on its likely type, texture, moisture level, and potential suitability for common crops. Suggest possible improvements if any deficiencies are apparent. Format the response as clear, actionable points for a farmer.",
        ta: "இந்த மண் படத்தை விவசாய நோக்கங்களுக்காக பகுப்பாய்வு செய்யவும். அதன் வகை, அமைப்பு, ஈரப்பதம் மற்றும் பொதுவான பயிர்களுக்கு அதன் சாத்தியமான பொருத்தம் குறித்த அறிக்கையை வழங்கவும். ஏதேனும் குறைபாடுகள் இருந்தால் சாத்தியமான மேம்பாடுகளை பரிந்துரைக்கவும். பதிலை ஒரு விவசாயிக்கு தெளிவான, செயல்படக்கூடிய புள்ளிகளாக வடிவமைக்கவும்.",
    },
    cropRecommendation: {
        en: (season: string) => `Based on this soil image and for the ${season} planting season, recommend the top 3-5 most suitable crops. For each crop, provide its name, a suitability score out of 10, a brief reasoning for the recommendation (considering soil type, texture, and season), and the current market demand (High, Medium, or Low).`,
        ta: (season: string) => `இந்த மண் படம் மற்றும் ${season} நடவுப் பருவத்தின் அடிப்படையில், மிகவும் பொருத்தமான 3-5 பயிர்களைப் பரிந்துரைக்கவும். ஒவ்வொரு பயிருக்கும், அதன் பெயர், 10க்கு ஒரு பொருத்தமான மதிப்பெண், பரிந்துரைக்கான சுருக்கமான காரணம் (மண் வகை, அமைப்பு மற்றும் பருவத்தைக் கருத்தில் கொண்டு), மற்றும் தற்போதைய சந்தை தேவை (உயர், நடுத்தர, அல்லது குறைந்த) ஆகியவற்றை வழங்கவும்.`,
    },
    fertilizerRecommendation: {
        en: (cropName: string) => `Act as an expert agronomist. Analyze the attached image of a ${cropName} leaf. Identify any visible signs of nutrient deficiency, disease, or water stress. Provide a diagnosis and a set of actionable recommendations. The recommendations should include a primary issue detected, a clear recommendation text, a list of specific fertilizer types to apply (e.g., 'NPK 10-20-10', 'Urea'), and advice on irrigation adjustments (e.g., 'Increase watering frequency to twice a day').`,
        ta: (cropName: string) => `ஒரு நிபுணர் வேளாண் விஞ்ஞானியாக செயல்படுங்கள். இணைக்கப்பட்டுள்ள ${cropName} இலையின் படத்தை பகுப்பாய்வு செய்யுங்கள். ஊட்டச்சத்து குறைபாடு, நோய் அல்லது நீர் அழுத்தத்தின் எந்தவொரு புலப்படும் அறிகுறிகளையும் அடையாளம் காணவும். ஒரு நோயறிதல் மற்றும் செயல்படுத்தக்கூடிய பரிந்துரைகளின் தொகுப்பை வழங்கவும். பரிந்துரைகளில் கண்டறியப்பட்ட முதன்மை சிக்கல், தெளிவான பரிந்துரை உரை, பயன்படுத்த வேண்டிய குறிப்பிட்ட உர வகைகளின் பட்டியல் (எ.கா., 'NPK 10-20-10', 'யூரியா'), மற்றும் நீர்ப்பாசன சரிசெய்தல் குறித்த ஆலோசனை (எ.கா., 'நீர்ப்பாசன அதிர்வெண்ணை ஒரு நாளைக்கு இரண்டு முறையாக அதிகரிக்கவும்') ஆகியவை அடங்கும்.`,
    },
    marketAnalysis: {
        en: (crop: string, season: string, month: string) => `Provide a market price analysis for ${crop} for the month of ${month} during the ${season} season. Use real-time market data. Respond ONLY with a JSON object in the following structure: \`\`\`json\n{"crop": "${crop}", "priceHighUSD": number, "priceAverageUSD": number, "priceLowUSD": number, "demandOutlook": "Strong" | "Stable" | "Weak", "marketInsights": "string"}\n\`\`\` Do not include any text before or after the JSON object.`,
        ta: (crop: string, season: string, month: string) => `${season} பருவத்தில் ${month} மாதத்திற்கான ${crop}-க்கான சந்தை விலை பகுப்பாய்வை வழங்கவும். நிகழ்நேர சந்தைத் தரவைப் பயன்படுத்தவும். இந்த அமைப்பில் ஒரு JSON பொருளுடன் மட்டும் பதிலளிக்கவும்: \`\`\`json\n{"crop": "${crop}", "priceHighUSD": number, "priceAverageUSD": number, "priceLowUSD": number, "demandOutlook": "Strong" | "Stable" | "Weak", "marketInsights": "string"}\n\`\`\` JSON பொருளுக்கு முன்னும் பின்னும் எந்த உரையும் சேர்க்க வேண்டாம்.`,
    },
    chatbotSystemInstruction: {
        en: 'You are AgriBot, an AI assistant for farmers. Your goal is to provide expert advice on agriculture, including crop management, soil health, pest control, and market trends. Keep your answers clear, concise, and easy for a farmer to understand and act upon. Respond in the language of the user\'s query.',
        ta: 'நீங்கள் அக்ரிபாட், விவசாயிகளுக்கான ஒரு AI உதவியாளர். பயிர் மேலாண்மை, மண் ஆரோக்கியம், பூச்சி கட்டுப்பாடு மற்றும் சந்தை போக்குகள் உள்ளிட்ட விவசாயம் குறித்த நிபுணர் ஆலோசனைகளை வழங்குவதே உங்கள் குறிக்கோள். உங்கள் பதில்களை தெளிவாகவும், சுருக்கமாகவும், ஒரு விவசாயி எளிதில் புரிந்துகொண்டு செயல்படக்கூடியதாகவும் வைத்திருங்கள். பயனரின் கேள்விக்கு அவர்களின் மொழியிலேயே பதிலளிக்கவும்.',
    },
    weatherForecast: {
        en: (location: string) => `Provide a 5-day weather forecast for ${location}. Include the day of the week, a short, one or two-word weather condition description (e.g., 'Sunny', 'Partly Cloudy', 'Rain', 'Thunderstorm', 'Snow'), high and low temperatures in Celsius, wind speed in km/h, and humidity percentage. Respond ONLY with a JSON object. Ensure the 'day' is the name of the day (e.g., "Monday").`,
        ta: (location: string) => `Provide a 5-day weather forecast for ${location}. Include the day of the week, a short, one or two-word weather condition description (e.g., 'Sunny', 'Partly Cloudy', 'Rain', 'Thunderstorm', 'Snow'), high and low temperatures in Celsius, wind speed in km/h, and humidity percentage. Respond ONLY with a JSON object. Ensure the 'day' is the name of the day (e.g., "Monday").`,
    }
}

// Schemas for structured JSON responses
const cropRecommendationSchema = {
    type: Type.OBJECT,
    properties: {
        recommendations: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    cropName: { type: Type.STRING },
                    suitabilityScore: { type: Type.NUMBER },
                    reasoning: { type: Type.STRING },
                    marketDemand: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
                },
                required: ['cropName', 'suitabilityScore', 'reasoning', 'marketDemand']
            }
        }
    },
    required: ['recommendations']
};

const fertilizerRecommendationSchema = {
    type: Type.OBJECT,
    properties: {
        recommendations: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    issueDetected: { type: Type.STRING },
                    recommendationText: { type: Type.STRING },
                    recommendedFertilizers: { type: Type.ARRAY, items: { type: Type.STRING } },
                    irrigationAdvice: { type: Type.STRING }
                },
                required: ['issueDetected', 'recommendationText', 'recommendedFertilizers', 'irrigationAdvice']
            }
        }
    },
    required: ['recommendations']
};

const weatherForecastSchema = {
    type: Type.OBJECT,
    properties: {
        forecast: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.STRING },
                    condition: { type: Type.STRING },
                    high_c: { type: Type.NUMBER },
                    low_c: { type: Type.NUMBER },
                    wind_kph: { type: Type.NUMBER },
                    humidity_percent: { type: Type.NUMBER },
                },
                required: ['day', 'condition', 'high_c', 'low_c', 'wind_kph', 'humidity_percent']
            }
        }
    },
    required: ['forecast']
};


export const getSoilAnalysis = async (imageBase64: string, mimeType: string, language: 'en' | 'ta'): Promise<string> => {
  try {
    const imagePart = { inlineData: { data: imageBase64, mimeType } };
    const textPart = { text: prompts.soilAnalysis[language] };
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });
    return response.text;
  } catch (error) {
    console.error("Error getting soil analysis:", error);
    return "Sorry, I couldn't analyze the soil image. Please try again.";
  }
};

export const getCropRecommendations = async (imageBase64: string, mimeType: string, season: Season, language: 'en' | 'ta'): Promise<CropRecommendationResponse> => {
    try {
        const imagePart = { inlineData: { data: imageBase64, mimeType } };
        const textPart = { text: prompts.cropRecommendation[language](season) };
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: cropRecommendationSchema,
            },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error getting crop recommendations:", error);
        throw new Error("Could not retrieve or parse crop recommendation data.");
    }
};

export const getFertilizerRecommendations = async (imageBase64: string, mimeType: string, cropName: string, language: 'en' | 'ta'): Promise<FertilizerResponse> => {
    try {
        const imagePart = { inlineData: { data: imageBase64, mimeType } };
        const textPart = { text: prompts.fertilizerRecommendation[language](cropName) };
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: fertilizerRecommendationSchema,
            },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error getting fertilizer recommendations:", error);
        throw new Error("Could not retrieve or parse fertilizer recommendation data.");
    }
};

export const getMarketAnalysis = async (crop: string, season: string, month: string, language: 'en' | 'ta'): Promise<MarketAnalysis> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompts.marketAnalysis[language](crop, season, month),
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        const text = response.text.trim();
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
        const jsonString = jsonMatch ? jsonMatch[1] : text;
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error getting market analysis:", error);
        throw new Error("Could not retrieve or parse market analysis data.");
    }
};


export const getWeatherForecast = async (location: string, language: 'en' | 'ta'): Promise<WeatherForecast> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompts.weatherForecast[language](location),
            config: {
                responseMimeType: "application/json",
                responseSchema: weatherForecastSchema,
            },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error getting weather forecast:", error);
        throw new Error("Could not retrieve or parse weather forecast data.");
    }
};


let chats: { en: Chat | null, ta: Chat | null } = { en: null, ta: null };

export const startChat = (language: 'en' | 'ta'): Chat => {
    if (!chats[language]) {
        chats[language] = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: prompts.chatbotSystemInstruction[language],
            },
        });
    }
    return chats[language] as Chat;
}

export const sendMessageToChatStream = async (message: string, language: 'en' | 'ta') => {
    const chatInstance = startChat(language);
    try {
        const response = await chatInstance.sendMessageStream({ message });
        return response;
    } catch (error) {
        console.error("Error sending message to chat stream:", error);
        throw new Error("Failed to get response from AI assistant.");
    }
};