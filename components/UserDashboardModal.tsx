import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { useAuth } from '../hooks/useAuth';

// Add a global declaration for window.Recharts to resolve TypeScript error for CDN-loaded libraries.
declare global {
    interface Window {
        Recharts: any;
    }
}

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const cropHealthData = [
  { name: 'Jan', health: 85 }, { name: 'Feb', health: 88 }, { name: 'Mar', health: 90 },
  { name: 'Apr', health: 87 }, { name: 'May', health: 92 }, { name: 'Jun', health: 95 },
];
const yieldData = [
  { name: 'Corn', '2022': 4000, '2023': 4800 }, { name: 'Wheat', '2022': 3000, '2023': 3200 },
  { name: 'Soy', '2022': 2400, '2023': 2900 }, { name: 'Cotton', '2022': 1800, '2023': 2100 },
];
const marketPriceData = [
    { name: 'Jan', Corn: 4.50, Wheat: 6.20, Soy: 12.10 }, { name: 'Feb', Corn: 4.65, Wheat: 6.50, Soy: 12.50 },
    { name: 'Mar', Corn: 4.80, Wheat: 6.45, Soy: 12.30 }, { name: 'Apr', Corn: 4.75, Wheat: 6.80, Soy: 12.80 },
    { name: 'May', Corn: 4.90, Wheat: 7.10, Soy: 13.00 }, { name: 'Jun', Corn: 5.10, Wheat: 7.00, Soy: 13.20 },
];
const farmerConnections = [
  { name: 'John Doe', location: 'Iowa, USA', crops: ['Corn', 'Soy'] },
  { name: 'Maria Garcia', location: 'California, USA', crops: ['Grapes', 'Almonds'] },
  { name: 'Anika Patel', location: 'Punjab, India', crops: ['Wheat', 'Rice'] },
];

const Icons = {
    Export: (props: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
    TrendUp: (props: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    TrendDown: (props: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>,
    Minus: (props: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>,
    Users: (props: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
};

const FarmerDashboard: React.FC<{ name: string }> = ({ name }) => {
    const { t } = useTranslations();
    const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Brush } = window.Recharts;
    const tooltipStyle = { backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #e2e8f0', borderRadius: '0.5rem', backdropFilter: 'blur(5px)' };
    return (
        <div className="space-y-8"><div className="grid grid-cols-1 lg:grid-cols-3 gap-8"><div className="lg:col-span-2 space-y-8"><div><div className="flex justify-between items-center mb-4"><h3 className="text-xl font-semibold">{t('dashboard.yieldTitle')}</h3><button className="flex items-center bg-gray-100 text-gray-600 font-semibold px-4 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"><Icons.Export className="w-4 h-4 mr-2" />{t('dashboard.exportButton')}</button></div><ResponsiveContainer width="100%" height={300}><BarChart data={yieldData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip contentStyle={tooltipStyle} cursor={{fill: 'rgba(22, 163, 74, 0.1)'}}/><Legend /><Bar dataKey="2022" fill="#a16207" name={t('dashboard.yield2022Label')} /><Bar dataKey="2023" fill="#16a34a" name={t('dashboard.yield2023Label')} /></BarChart></ResponsiveContainer></div><div><div className="flex justify-between items-center mb-4"><h3 className="text-xl font-semibold">{t('dashboard.healthTitle')}</h3><button className="flex items-center bg-gray-100 text-gray-600 font-semibold px-4 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"><Icons.Export className="w-4 h-4 mr-2" />{t('dashboard.exportButton')}</button></div><ResponsiveContainer width="100%" height={350}><LineChart data={cropHealthData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis domain={[70, 100]}/><Tooltip contentStyle={tooltipStyle}/><Legend /><Line type="monotone" dataKey="health" name={t('dashboard.healthLabel')} stroke="#16a34a" strokeWidth={3} activeDot={{ r: 8 }} /><Brush dataKey="name" height={30} stroke="#16a34a" fill="#f1f5f9" /></LineChart></ResponsiveContainer></div></div><div className="bg-gray-50 p-6 rounded-lg"><h3 className="text-xl font-semibold mb-4">{t('dashboard.suggestionsTitle')}</h3><div className="space-y-4"><div className="bg-green-100 p-4 rounded-lg"><p className="font-semibold text-green-800">{t('dashboard.suggestion1Title')}</p><p className="text-sm text-green-700">{t('dashboard.suggestion1Desc')}</p></div><div className="bg-yellow-100 p-4 rounded-lg"><p className="font-semibold text-yellow-800">{t('dashboard.suggestion2Title')}</p><p className="text-sm text-yellow-700">{t('dashboard.suggestion2Desc')}</p></div><div className="bg-blue-100 p-4 rounded-lg"><p className="font-semibold text-blue-800">{t('dashboard.suggestion3Title')}</p><p className="text-sm text-blue-700">{t('dashboard.suggestion3Desc')}</p></div><div className="bg-gray-200 p-4 rounded-lg"><p className="font-semibold text-gray-800">{t('dashboard.suggestion4Title')}</p><p className="text-sm text-gray-700">{t('dashboard.suggestion4Desc')}</p></div></div></div></div></div>
    );
};
const BrokerDashboard: React.FC<{ name: string }> = ({ name }) => {
    const { t } = useTranslations();
    const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = window.Recharts;
    const tooltipStyle = { backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #e2e8f0', borderRadius: '0.5rem'};
    const supplyDemandData = [{ name: t('dashboard.crop_corn'), status: 'high_demand' }, { name: t('dashboard.crop_wheat'), status: 'stable' }, { name: t('dashboard.crop_soy'), status: 'high_supply' }, { name: t('dashboard.crop_cotton'), status: 'stable' }];
    const getStatusIndicator = (status: string) => { switch (status) { case 'high_demand': return <div className="flex items-center text-green-600"><Icons.TrendUp className="w-5 h-5 mr-2" /> {t('dashboard.status_high_demand')}</div>; case 'high_supply': return <div className="flex items-center text-yellow-600"><Icons.TrendDown className="w-5 h-5 mr-2" /> {t('dashboard.status_high_supply')}</div>; default: return <div className="flex items-center text-gray-600"><Icons.Minus className="w-5 h-5 mr-2" /> {t('dashboard.status_stable')}</div>; } };
    return (
        <div className="space-y-8"><div className="grid grid-cols-1 lg:grid-cols-3 gap-8"><div className="lg:col-span-2"><h3 className="text-xl font-semibold mb-4">{t('dashboard.marketTrendsTitle')}</h3><ResponsiveContainer width="100%" height={400}><LineChart data={marketPriceData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis tickFormatter={(value) => `$${value.toFixed(2)}`} /><Tooltip contentStyle={tooltipStyle} formatter={(value: number) => `$${value.toFixed(2)}`} /><Legend /><Line type="monotone" dataKey="Corn" stroke="#f59e0b" strokeWidth={2} name={t('dashboard.crop_corn')} /><Line type="monotone" dataKey="Wheat" stroke="#a16207" strokeWidth={2} name={t('dashboard.crop_wheat')} /><Line type="monotone" dataKey="Soy" stroke="#16a34a" strokeWidth={2} name={t('dashboard.crop_soy')} /></LineChart></ResponsiveContainer></div><div className="space-y-8"><div className="bg-gray-50 p-6 rounded-lg"><h3 className="text-xl font-semibold mb-4">{t('dashboard.supplyDemandTitle')}</h3><ul className="space-y-3">{supplyDemandData.map(item => <li key={item.name} className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm"><span className="font-semibold text-gray-800">{item.name}</span>{getStatusIndicator(item.status)}</li>)}</ul></div><div className="bg-gray-50 p-6 rounded-lg"><h3 className="text-xl font-semibold mb-4 flex items-center"><Icons.Users className="w-6 h-6 mr-2 text-brand-green" />{t('dashboard.farmerConnectionsTitle')}</h3><ul className="space-y-3">{farmerConnections.map(farmer => <li key={farmer.name} className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm"><div><p className="font-semibold text-gray-800">{farmer.name}</p><p className="text-xs text-gray-500">{farmer.location}</p></div><button className="bg-brand-green text-white font-semibold px-4 py-1 rounded-full text-sm hover:bg-brand-green-light transition-colors">{t('dashboard.connectButton')}</button></li>)}</ul></div></div></div></div>
    );
};

const UserDashboardModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { t } = useTranslations();
    const { user } = useAuth();

    if (!window.Recharts) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl text-center p-8">{t('dashboard.loading')}</div>
            </div>
        );
    }
    
    if (!user) return null;

    const dashboardTitle = user.role === 'farmer' 
        ? t('dashboard.farmerDashboardTitle').replace('{name}', user.name)
        : t('dashboard.brokerDashboardTitle').replace('{name}', user.name);
        
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto animate-slide-in">
                <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-2xl font-bold text-brand-dark">{dashboardTitle}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><CloseIcon className="w-6 h-6" /></button>
                </div>
                <div className="p-6">
                    {user.role === 'farmer' ? <FarmerDashboard name={user.name} /> : <BrokerDashboard name={user.name} />}
                </div>
            </div>
        </div>
    );
};

export default UserDashboardModal;
