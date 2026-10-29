import React from 'react';

export default function CrowdBadge({ level = 'low', size = 'normal', showLabel = true, className = '' }) {
  const normalizedLevel = String(level).toLowerCase();

  const config = {
    low: {
      label: 'Low Crowd',
      bgClass: 'bg-green-100 text-green-800 border-green-300',
      dotClass: 'bg-green-500',
      highContrastBg: 'high-contrast:bg-black high-contrast:text-green-400 high-contrast:border-green-400',
      ariaText: 'Crowd level: Low, comfortable navigation'
    },
    medium: {
      label: 'Moderate',
      bgClass: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      dotClass: 'bg-yellow-500',
      highContrastBg: 'high-contrast:bg-black high-contrast:text-yellow-300 high-contrast:border-yellow-300',
      ariaText: 'Crowd level: Moderate footfall'
    },
    high: {
      label: 'Heavy Rush',
      bgClass: 'bg-red-100 text-red-800 border-red-300',
      dotClass: 'bg-red-500 animate-pulse',
      highContrastBg: 'high-contrast:bg-black high-contrast:text-red-400 high-contrast:border-red-400',
      ariaText: 'Crowd level: High congestion, delays likely'
    }
  };

  const current = config[normalizedLevel] || config.low;

  const sizeClasses = {
    small: 'text-xs px-2 py-0.5',
    normal: 'text-sm px-2.5 py-1',
    large: 'text-base px-3.5 py-1.5 font-semibold'
  };

  return (
    <span
      role="status"
      aria-label={current.ariaText}
      title={current.ariaText}
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${sizeClasses[size] || sizeClasses.normal} ${current.bgClass} ${current.highContrastBg} ${className}`}
    >
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${current.dotClass}`} aria-hidden="true" />
      {showLabel && <span>{current.label}</span>}
    </span>
  );
}
