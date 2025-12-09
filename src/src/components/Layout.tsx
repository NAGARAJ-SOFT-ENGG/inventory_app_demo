import React, { useContext, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, LogOut, User, Bell } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { Sidebar } from "./Sidebar";
import { ProfileDialog } from "./ProfileDialog";

const routeTitles: { [key: string]: { title: string; subtitle: string } } = {
  "/dashboard": { title: "Dashboard", subtitle: "Overview of your inventory" },
  "/masters/items": { title: "Item Master", subtitle: "Manage your master items" },
  "/masters/suppliers": { title: "Supplier Master", subtitle: "Manage your master suppliers" },
  "/masters/prices": { title: "Price Master", subtitle: "Manage your pricing units" },
  "/masters/quantities": { title: "QTY Master", subtitle: "Manage your quantity units" },
  "/po-screen": { title: "Create Purchase Invoice", subtitle: "Generate a new purchase invoice" },
  "/scales-screen": { title: "Create Scales Invoice", subtitle: "Generate a new scales invoice" },
  "/purchase-returns": { title: "Purchase Returns", subtitle: "Process returns for purchase invoices" },
  "/reports": { title: "Reports Center", subtitle: "Generate and download system reports" },
  "/users": { title: "User Management", subtitle: "Manage system users and permissions" },
  "/employees": { title: "Employees", subtitle: "Manage your team members" },
  "/products": { title: "Products", subtitle: "Manage your product catalog" },
  "/inventory": { title: "Inventory", subtitle: "Track your inventory items" },
  "/sales": { title: "Sales", subtitle: "Create invoices and manage sales" },
};

export const Layout: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState<boolean>(false);
  const location = useLocation();

  const handleLogout = (): void => {
    logout();
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onLogout={handleLogout} />

      {/* Main Content Area - Now with its own scroll context */}
      <div className="flex-1 flex flex-col lg:ml-0 min-w-0">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search Bar - Optional */}
            <div className="flex-1 mx-2">
              <h2 className="text-lg font-semibold text-gray-900 hidden sm:block">
                {routeTitles[location.pathname]?.title || "Inventory System"}
              </h2>
              <p className="text-sm text-gray-500 hidden sm:block">{routeTitles[location.pathname]?.subtitle}</p>
            </div>

            {/* Right Side - User Menu */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Profile */}
              <button
                onClick={() => setIsProfileDialogOpen(true)}
                className="flex items-center gap-3 hover:bg-gray-100 rounded-lg p-2 transition-colors"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center ring-2 ring-blue-100">
                  <User className="w-6 h-6 text-white" />
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Profile Dialog */}
      <ProfileDialog
        open={isProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
      />
    </div>
  );
};
