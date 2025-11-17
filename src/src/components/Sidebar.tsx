import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  LayoutDashboard,
  Users,
  FileText,
  Truck,
  Box,
  X,
  UserCog,
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

  const baseNavigation: NavigationItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/products", icon: Box },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Sales", href: "/sales", icon: FileText },
    { name: "Orders", href: "/orders", icon: ShoppingCart },
  ];

  const adminNavigation: NavigationItem[] = [
    { name: "Purchases", href: "/purchases", icon: ShoppingCart },
    { name: "Suppliers", href: "/suppliers", icon: Truck },
    { name: "Employees", href: "/employees", icon: Users },
    { name: "Users", href: "/users", icon: UserCog },
    { name: "Stock Movements", href: "/stock-movements", icon: TrendingUp },
  ];

  const navigation: NavigationItem[] = isAdmin
    ? [...baseNavigation, ...adminNavigation]
    : baseNavigation;

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
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => {
                    // Close mobile menu when clicking a link
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative group ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavItem"
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg -z-10"
                    />
                  )}
                </Link>
              );
            })}
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
