
import React from 'react';

interface ToneChartProps {
  professionalism: number;
  clarity: number;
  warmth: number;
}

const ToneBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className="mb-3">
    <div className="flex justify-between text-xs font-medium mb-1">
      <span className="text-slate-600 uppercase tracking-wider">{label}</span>
      <span className="text-slate-900">{value}%</span>
    </div>
    <div className="w-full bg-slate-200 rounded-full h-1.5">
      <div 
        className={`h-1.5 rounded-full transition-all duration-1000 ${color}`} 
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

export const ToneChart: React.FC<ToneChartProps> = ({ professionalism, clarity, warmth }) => {
  return (
    <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
      <h4 className="text-sm font-semibold mb-4 text-slate-800">語調分析</h4>
      <ToneBar label="專業度" value={professionalism} color="bg-indigo-600" />
      <ToneBar label="清晰度" value={clarity} color="bg-emerald-500" />
      <ToneBar label="親和力" value={warmth} color="bg-amber-400" />
    </div>
  );
};
