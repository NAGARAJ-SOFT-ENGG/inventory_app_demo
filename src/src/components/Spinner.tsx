import React from "react";

export const Spinner: React.FC<{ size?: "sm" | "md" | "lg" }> = ({
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  return (
    <div className="flex items-center justify-center w-full h-full min-h-[400px]">
      <div className={`${sizeClasses[size]} relative`}>
        {/* Logo-based spinner with custom inventory icon */}
        <svg
          className="animate-spin"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="70 200"
            strokeLinecap="round"
            className="text-blue-500"
          />
          
          {/* Inner logo - Inventory box icon */}
          <g transform="translate(50, 50)">
            {/* Box shape */}
            <rect
              x="-15"
              y="-15"
              width="30"
              height="30"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-blue-600"
              rx="2"
            />
            
            {/* Horizontal lines representing shelves */}
            <line
              x1="-15"
              y1="-5"
              x2="15"
              y2="-5"
              stroke="currentColor"
              strokeWidth="2"
              className="text-blue-600"
            />
            <line
              x1="-15"
              y1="5"
              x2="15"
              y2="5"
              stroke="currentColor"
              strokeWidth="2"
              className="text-blue-600"
            />
            
            {/* Checkmark in the center */}
            <polyline
              points="-5,0 -2,5 8,-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-500"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};

export const FullPageSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 z-50">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600 animate-pulse">Loading...</p>
      </div>
    </div>
  );
};
