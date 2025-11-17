import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./src/context/AuthContext";
import { LoginPage } from "./src/components/LoginPage";
import { Layout } from "./src/components/Layout";
import { ProtectedRoute } from "./src/routes/ProtectedRoute";
import { Dashboard } from "./src/pages/Dashboard";
import { Products } from "./src/pages/Products";
import { Inventory } from "./src/pages/Inventory";
import { Sales } from "./src/pages/Sales";
import { Orders } from "./src/pages/Orders";
import { Purchases } from "./src/pages/Purchases";
import { Suppliers } from "./src/pages/Suppliers";
import { Employees } from "./src/pages/Employees";
import { Users } from "./src/pages/Users";
import { StockMovements } from "./src/pages/StockMovements";
import { Toaster } from "sonner@2.0.3";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = React.useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        }
      />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="sales" element={<Sales />} />
        <Route path="orders" element={<Orders />} />
        <Route
          path="purchases"
          element={
            <ProtectedRoute requireAdmin>
              <Purchases />
            </ProtectedRoute>
          }
        />
        <Route
          path="suppliers"
          element={
            <ProtectedRoute requireAdmin>
              <Suppliers />
            </ProtectedRoute>
          }
        />
        <Route
          path="employees"
          element={
            <ProtectedRoute requireAdmin>
              <Employees />
            </ProtectedRoute>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedRoute requireAdmin>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="stock-movements"
          element={
            <ProtectedRoute requireAdmin>
              <StockMovements />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
