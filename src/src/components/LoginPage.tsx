import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { AuthService } from "../services/auth.service";
import { Loader2 } from "lucide-react";

export const LoginPage: React.FC = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isSignIn) {
        const response = await AuthService.signIn(email, password);
        login(response.user, response.token);
      } else {
        const response = await AuthService.signUp(email, password, name);
        login(response.user, response.token);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignIn(!isSignIn);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Night Lamp */}
        <motion.div
          className="mb-8 flex flex-col items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Lamp shade and bulb */}
          <div className="relative">
            {/* Hanging cord */}
            <motion.div
              className="w-1 bg-gradient-to-b from-gray-400 to-gray-600 mx-auto"
              style={{ height: "60px" }}
              animate={{ scaleY: [1, 0.98, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

{/* Pull rope with toggle */}
<motion.div
  className="absolute cursor-pointer select-none"
  style={{ top: "20px", left: "calc(50% + 70px)" }}  // SHIFT RIGHT BY 100px
  whileHover={{ scale: 1.15, rotate: -3 }}
  whileTap={{ scale: 0.9, y: 10 }} // small pull-down effect
  animate={{ y: [0, 3, 0] }}
  transition={{ duration: 1.8, repeat: Infinity }}
  onClick={toggleMode}  // ← FIX: toggle light
>
  {/* Rope line */}
  <div
    className="w-1.5 mx-auto bg-gradient-to-b from-gray-200 to-gray-500 shadow-md"
    style={{ height: "40px", borderRadius: "4px" }}
  />

  {/* Rope handle */}
  <motion.div
    className="w-2 h-12 mx-auto rounded-full border-2 bg-gradient-to-b 
               from-gray-300 to-gray-500 border-gray-700 shadow-xl"
    animate={{
      boxShadow: [
        "0 0 6px rgba(255,255,255,0.2)",
        "0 0 14px rgba(255,255,255,0.35)",
        "0 0 6px rgba(255,255,255,0.2)",
      ],
    }}
    transition={{ duration: 2, repeat: Infinity }}
  />
</motion.div>


            {/* Lamp shade */}
            <motion.div
              className="mt-3 w-32 h-20 bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-full relative overflow-hidden border-4 border-gray-600"
              style={{
                clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
              }}
            >
              {/* Light glow effect */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={isSignIn ? "signin" : "signup"}
                  className={`absolute inset-0 ${isSignIn ? "bg-yellow-600/20" : "bg-blue-600/20"
                    } blur-xl`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              </AnimatePresence>

              {/* Bulb */}
              <motion.div
                className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-10 rounded-full ${isSignIn ? "bg-yellow-300" : "bg-blue-300"
                  }`}
                animate={{
                  boxShadow: isSignIn
                    ? [
                      "0 0 20px rgba(253, 224, 71, 0.8)",
                      "0 0 30px rgba(253, 224, 71, 0.6)",
                      "0 0 20px rgba(253, 224, 71, 0.8)",
                    ]
                    : [
                      "0 0 20px rgba(147, 197, 253, 0.8)",
                      "0 0 30px rgba(147, 197, 253, 0.6)",
                      "0 0 20px rgba(147, 197, 253, 0.8)",
                    ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            {/* Light beam */}
            <motion.div
              className="absolute top-full left-1/2 -translate-x-1/2 w-48 h-96 pointer-events-none"
              style={{
                background: isSignIn
                  ? "linear-gradient(180deg, rgba(253, 224, 71, 0.3) 0%, transparent 70%)"
                  : "linear-gradient(180deg, rgba(147, 197, 253, 0.3) 0%, transparent 70%)",
                clipPath: "polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Mode indicator text */}
          <motion.p
            className="mt-24 text-white/80 text-sm"
            key={isSignIn ? "signin-text" : "signup-text"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Pull the rope to switch to {isSignIn ? "Sign Up" : "Sign In"}
          </motion.p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignIn ? "signin-form" : "signup-form"}
              initial={{ opacity: 0, x: isSignIn ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isSignIn ? 20 : -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl text-white mb-2 text-center">
                {isSignIn ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-white/60 text-center mb-6 text-sm">
                {isSignIn
                  ? "Sign in to access your inventory"
                  : "Sign up to get started"}
              </p>

              {error && (
                <motion.div
                  className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isSignIn && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-white/80 mb-2 text-sm">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="John Doe"
                      required
                    />
                  </motion.div>
                )}

                <div>
                  <label className="block text-white/80 mb-2 text-sm">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="admin@example.com or user@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/80 mb-2 text-sm">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>{isSignIn ? "Sign In" : "Sign Up"}</span>
                  )}
                </button>
              </form>

              <p className="text-white/60 text-center mt-6 text-sm">
                Use <strong>admin@example.com</strong> for admin access
                <br />
                or any other email for customer access
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Branding */}
        <motion.div
          className="text-center mt-6 text-white/60 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Inventory Management System
        </motion.div>
      </div>
    </div>
  );
};
