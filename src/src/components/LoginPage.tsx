import React, { useState, useContext } from "react";
import { motion } from "motion/react";
import { Package, Loader2, Mail, Lock, AlertCircle } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { AuthService } from "../services/auth.service";
import { toast } from "sonner@2.0.3";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";

interface FormErrors {
  email?: string;
  password?: string;
}

export const LoginPage: React.FC = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [lampPulled, setLampPulled] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    setIsLoading(true);

    try {
      const response = await AuthService.signIn(email, password);
      login(response.user, response.token);
      toast.success(`Welcome back, ${response.user.name}!`);
    } catch (error) {
      toast.error("Invalid credentials. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLampPull = (): void => {
    setLampPulled(!lampPulled);
    setIsAdminMode(!isAdminMode);
  };

  const clearError = (field: keyof FormErrors): void => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Night Lamp */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              className="relative cursor-pointer"
              onClick={handleLampPull}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Lamp Bulb */}
              <motion.div
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                  lampPulled
                    ? "bg-gradient-to-br from-yellow-400 to-orange-500 shadow-2xl shadow-yellow-500/50"
                    : "bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl shadow-blue-500/50"
                }`}
                animate={{
                  boxShadow: lampPulled
                    ? [
                        "0 0 20px rgba(251, 191, 36, 0.5)",
                        "0 0 40px rgba(251, 191, 36, 0.8)",
                        "0 0 20px rgba(251, 191, 36, 0.5)",
                      ]
                    : [
                        "0 0 20px rgba(59, 130, 246, 0.5)",
                        "0 0 40px rgba(59, 130, 246, 0.8)",
                        "0 0 20px rgba(59, 130, 246, 0.5)",
                      ],
                  transition: { duration: 2, repeat: Infinity },
                }}
              >
                <Package className="w-10 h-10 text-white" />
              </motion.div>

              {/* Lamp Rope */}
              <motion.div
                className="absolute top-full left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-gray-400 to-gray-600"
                style={{ height: "40px" }}
                animate={{ height: lampPulled ? "50px" : "40px" }}
                transition={{ duration: 0.3 }}
              />

              {/* Rope Handle */}
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gray-600 border-2 border-gray-400"
                style={{ top: "100px" }}
                animate={{ top: lampPulled ? "110px" : "100px" }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>

            <motion.p
              className="mt-6 text-white/80 text-sm text-center"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Pull the lamp to switch mode
            </motion.p>
          </div>

          {/* Logo and Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl text-white mb-2">
              InvenTrack
            </h1>
            <p className="text-white/60">
              {isAdminMode ? "Administrator Login" : "Customer Login"}
            </p>
          </div>

          {/* Mode Switch */}
          <div className="flex items-center justify-center gap-3 mb-6 p-4 bg-white/5 rounded-xl">
            <Label htmlFor="mode-switch" className="text-white/80">
              Customer
            </Label>
            <Switch
              id="mode-switch"
              checked={isAdminMode}
              onCheckedChange={(checked: boolean) => {
                setIsAdminMode(checked);
                setLampPulled(checked);
              }}
            />
            <Label htmlFor="mode-switch" className="text-white/80">
              Admin
            </Label>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/90">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none z-10" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEmail(e.target.value);
                    clearError("email");
                  }}
                  className={`w-full pl-10 pr-10 py-3 bg-white/10 border ${
                    errors.email
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-white/20"
                  } rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/90">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none z-10" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setPassword(e.target.value);
                    clearError("password");
                  }}
                  className={`w-full pl-10 pr-10 py-3 bg-white/10 border ${
                    errors.password
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-white/20"
                  } rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                lampPulled
                  ? "bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              } text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin flex-shrink-0" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-white/5 rounded-lg">
            <p className="text-white/60 text-sm text-center mb-2">Demo Credentials:</p>
            <div className="text-white/80 text-xs space-y-1">
              <p>
                <span className="text-yellow-400">Admin:</span> admin@example.com / password
              </p>
              <p>
                <span className="text-blue-400">Customer:</span> customer@example.com / password
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(-20px, -20px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};
