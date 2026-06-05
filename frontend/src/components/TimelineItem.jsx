import React from 'react';

export default function TimelineItem({ icon, title, description, date }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-lg flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <h5 className="text-sm font-semibold">{title}</h5>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <span className="text-xs text-gray-400 whitespace-nowrap">{date}</span>
    </div>
  );
}