import React from 'react';

const severityStyles = {
  medium: 'text-orange-600 bg-orange-50',
  low: 'text-gray-600 bg-gray-100',
  high: 'text-red-600 bg-red-50',
};

export default function RecommendationCard({ icon, title, severity, description, link }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-3">
      <div className="text-2xl flex-shrink-0">{icon}</div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-sm">{title}</h4>
          {severity && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${severityStyles[severity]}`}>
              {severity}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mb-2">{description}</p>
        {link && (
          <span className="text-primary text-xs font-medium cursor-pointer hover:underline">{link} →</span>
        )}
      </div>
    </div>
  );
}