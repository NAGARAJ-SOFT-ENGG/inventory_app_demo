import React from "react";
import { NavLink } from "react-router-dom";
import { useRBAC } from "../hooks/useRBAC";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Database, Box, Truck, DollarSign, Scale, FileText, Ruler   } from "lucide-react";

interface MasterMenuProps {
  onClose: () => void;
}

export const MasterMenu: React.FC<MasterMenuProps> = ({ onClose }) => {
  const { isAdmin } = useRBAC();
  const [isOpen, setIsOpen] = React.useState(false);

  if (!isAdmin) {
    return null;
  }

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) onClose();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 text-left px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Database className="w-5 h-5" />
        <span className="flex-1">Masters</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="pl-8 mt-1 space-y-1 overflow-hidden"
          >
            <li>
              <NavLink to="/masters/items" onClick={handleLinkClick} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 text-sm rounded-md ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Box className="w-4 h-4" />
                <span>Item Master</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/masters/suppliers" onClick={handleLinkClick} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 text-sm rounded-md ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Truck className="w-4 h-4" />
                <span>Supplier Master</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/masters/prices" onClick={handleLinkClick} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 text-sm rounded-md ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                <DollarSign className="w-4 h-4" />
                <span>Price Master</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/masters/quantities" onClick={handleLinkClick} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 text-sm rounded-md ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Scale className="w-4 h-4" />
                <span>QTY Master</span>
              </NavLink>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
       <NavLink to="/po-screen" onClick={handleLinkClick} className={({ isActive }) => `w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
        <FileText className="w-5 h-5" />
        <span className="flex-1">Purchases</span>
      </NavLink>
       <NavLink to="/scales-screen" onClick={handleLinkClick} className={({ isActive }) => `w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
        <Ruler   className="w-5 h-5" />
        <span className="flex-1">Scales</span>
      </NavLink>
    </>
  );
};