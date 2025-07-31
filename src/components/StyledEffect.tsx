import React from 'react';

// Dofus-themed colors for stats
const statColorMap: { [key: string]: string } = {
    'PA': 'text-yellow-300 font-bold',
    'PM': 'text-yellow-300 font-bold',
    'Portée': 'text-teal-300',
    'Invocation': 'text-lime-400',
    '% Résistance Neutre': 'text-gray-300',
    '% Résistance Terre': 'text-orange-400',
    '% Résistance Feu': 'text-red-400',
    '% Résistance Eau': 'text-blue-400',
    '% Résistance Air': 'text-green-400',
    'Dommages Neutre': 'text-gray-300',
    'Dommages Terre': 'text-orange-400',
    'Dommages Feu': 'text-red-400',
    'Dommages Eau': 'text-blue-400',
    'Dommages Air': 'text-green-400',
    'Vitalité': 'text-pink-400',
    'Force': 'text-orange-500',
    'Intelligence': 'text-red-500',
    'Chance': 'text-blue-500',
    'Agilité': 'text-green-500',
    'Sagesse': 'text-purple-400',
    'Puissance': 'text-amber-400',
    'Critique': 'text-amber-300',
    'Soins': 'text-emerald-300',
    'Initiative': 'text-indigo-400',
    'Prospection': 'text-sky-400',
    'Esquive PA': 'text-slate-400',
    'Esquive PM': 'text-slate-400',
    'Retrait PA': 'text-slate-400',
    'Retrait PM': 'text-slate-400',
    'Tacle': 'text-stone-400',
    'Fuite': 'text-stone-400',
    'Pods': 'text-gray-500',
    'Dommages': 'text-red-500',
    'Résistance': 'text-gray-300',
    'Esquive': 'text-slate-400',
};

const getStatStyle = (statName: string): string => {
    if (statColorMap[statName]) return statColorMap[statName];
    const keywords = Object.keys(statColorMap).sort((a, b) => b.length - a.length);
    for (const keyword of keywords) {
        if (statName.includes(keyword)) return statColorMap[keyword];
    }
    return 'text-gray-200';
};

const StyledEffect: React.FC<{ text: string }> = ({ text }) => {
    const regex = /^((\d+\sà\s\d+)|-?\d+)\s(.*)/;
    const match = text.match(regex);

    if (match) {
        const value = match[1];
        const stat = match[3];
        const styleClass = getStatStyle(stat);

        return (
            <li className="flex items-baseline">
                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                <div>
                    <span className="font-medium text-white mr-2">{value}</span>
                    <span className={`font-semibold ${styleClass}`}>{stat}</span>
                </div>
            </li>
        );
    }

    return (
        <li className="flex items-baseline">
            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
            <span className="text-gray-300">{text}</span>
        </li>
    );
};

export default StyledEffect;