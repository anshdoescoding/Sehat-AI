import React from 'react';

const badgeColors = {
  blue: 'bg-blue-50 text-primary',
  gray: 'bg-gray-100 text-gray-600',
  orange: 'bg-orange-50 text-orange-600',
  green: 'bg-green-50 text-green-600',
};

export default function VitalCard({ icon, label, value, unit, badge, badgeColor = 'blue' }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{icon}</span>
        <span className="text-xs text-gray-500 font-medium">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <span className="text-2xl font-bold">{value}</span>
          <span className="text-sm text-gray-400 ml-1">{unit}</span>
        </div>
        {badge && (
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${badgeColors[badgeColor]}`}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}