import React from "react";
import { FileDown } from "lucide-react";

interface PDFButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export const PDFButton: React.FC<PDFButtonProps> = ({
  onClick,
  label = "Generate PDF",
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors ${className}`}
    >
      <FileDown className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
};
