import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  X,
  BarChart2,
  Database,
  ChevronDown,
  Box,
  Truck,
  DollarSign,
  Scale,
  FileText,
  Ruler,
  Package,
  Undo2,
} from "lucide-react";
import { useRBAC } from "../hooks/useRBAC";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { isAdmin } = useRBAC();
  const [isMastersOpen, setIsMastersOpen] = React.useState(false);

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 bg-white border-r border-gray-200 z-50 transition-transform duration-300 lg:translate-x-0 lg:static ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "280px" }}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-gray-900">InvenTrack</h2>
                <p className="text-xs text-gray-500">Inventory System</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <NavLink
              to="/dashboard"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative group ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
              {location.pathname === "/dashboard" && (
                <motion.div
                  layoutId="activeNavItem"
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg -z-10"
                />
              )}
            </NavLink>

            {isAdmin && (
              <>
                <button
                  onClick={() => setIsMastersOpen(!isMastersOpen)}
                  className="w-full flex items-center gap-3 text-left px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Database className="w-5 h-5" />
                  <span className="flex-1">Masters</span>
                  <motion.div
                    animate={{ rotate: isMastersOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isMastersOpen && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="pl-8 mt-1 space-y-1 overflow-hidden"
                    >
                      <li>
                        <NavLink
                          to="/masters/items"
                          onClick={handleLinkClick}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 text-sm rounded-md ${
                              isActive
                                ? "bg-blue-100 text-blue-600"
                                : "text-gray-600 hover:bg-gray-100"
                            }`
                          }
                        >
                          <Box className="w-4 h-4" />
                          <span>Item Master</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/masters/suppliers"
                          onClick={handleLinkClick}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 text-sm rounded-md ${
                              isActive
                                ? "bg-blue-100 text-blue-600"
                                : "text-gray-600 hover:bg-gray-100"
                            }`
                          }
                        >
                          <Truck className="w-4 h-4" />
                          <span>Supplier Master</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/masters/prices"
                          onClick={handleLinkClick}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 text-sm rounded-md ${
                              isActive
                                ? "bg-blue-100 text-blue-600"
                                : "text-gray-600 hover:bg-gray-100"
                            }`
                          }
                        >
                          <DollarSign className="w-4 h-4" />
                          <span>Price Master</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/masters/quantities"
                          onClick={handleLinkClick}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 text-sm rounded-md ${
                              isActive
                                ? "bg-blue-100 text-blue-600"
                                : "text-gray-600 hover:bg-gray-100"
                            }`
                          }
                        >
                          <Scale className="w-4 h-4" />
                          <span>QTY Master</span>
                        </NavLink>
                      </li>
                    </motion.ul>
                  )}
                </AnimatePresence>
                <NavLink
                  to="/po-screen"
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`
                  }
                >
                  <FileText className="w-5 h-5" />
                  <span className="flex-1">Purchases</span>
                </NavLink>
                <NavLink
                  to="/purchase-returns"
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`
                  }
                >
                  <Undo2 className="w-5 h-5" />
                  <span className="flex-1">Purchase Returns</span>
                </NavLink>
                <NavLink
                  to="/scales-screen"
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`
                  }
                >
                  <Ruler className="w-5 h-5" />
                  <span className="flex-1">Scales</span>
                </NavLink>
              </>
            )}

            <NavLink
              to="/reports"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative group ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <BarChart2 className="w-5 h-5" />
              <span>Reports</span>
              {location.pathname === "/reports" && (
                <motion.div
                  layoutId="activeNavItem"
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg -z-10"
                />
              )}
            </NavLink>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Need Help?</p>
              <p className="text-xs text-gray-500 mt-1">
                Contact support for assistance
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
