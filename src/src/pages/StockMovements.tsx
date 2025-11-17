import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { InventoryService } from "../services/inventory.service";
import { StockMovement } from "../models/inventory.model";
import { Spinner } from "../components/Spinner";

export const StockMovements: React.FC = () => {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("all");

  useEffect(() => {
    loadMovements();
  }, []);

  const loadMovements = async () => {
    try {
      const data = await InventoryService.getStockMovements();
      setMovements(data);
    } catch (error) {
      console.error("Failed to load stock movements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMovements =
    typeFilter === "all"
      ? movements
      : movements.filter((m) => m.type === typeFilter);

  const totalIn = movements
    .filter((m) => m.type === "in")
    .reduce((sum, m) => sum + m.quantity, 0);
  const totalOut = movements
    .filter((m) => m.type === "out")
    .reduce((sum, m) => sum + m.quantity, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-gray-900 mb-2">Stock Movements</h2>
        <p className="text-gray-600">
          Track all incoming and outgoing inventory movements
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Movements</p>
              <p className="text-2xl text-gray-900">{movements.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
              <ArrowUpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Stock In</p>
              <p className="text-2xl text-gray-900">{totalIn}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
              <ArrowDownCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Stock Out</p>
              <p className="text-2xl text-gray-900">{totalOut}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <label className="text-gray-600">Filter by type:</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Movements</option>
            <option value="in">Stock In</option>
            <option value="out">Stock Out</option>
          </select>
        </div>
      </div>

      {/* Movements Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          {filteredMovements.map((movement, index) => (
            <motion.div
              key={movement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {/* Icon */}
              <div
                className={`p-3 rounded-lg ${
                  movement.type === "in"
                    ? "bg-green-100"
                    : "bg-red-100"
                }`}
              >
                {movement.type === "in" ? (
                  <ArrowUpCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <ArrowDownCircle className="w-6 h-6 text-red-600" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-gray-900">{movement.itemName}</h4>
                    <p className="text-sm text-gray-600">{movement.reason}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      movement.type === "in"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {movement.type === "in" ? "+" : "-"}
                    {movement.quantity} units
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>
                    {new Date(movement.date).toLocaleDateString()} at{" "}
                    {new Date(movement.date).toLocaleTimeString()}
                  </span>
                  <span>•</span>
                  <span>By {movement.performedBy}</span>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredMovements.length === 0 && (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No stock movements found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
