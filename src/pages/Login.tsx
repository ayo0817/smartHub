import React from "react";
import { Sparkles, LogIn } from "lucide-react";
import { signInWithGoogle } from "../firebase";
import { motion } from "motion/react";

export function Login() {
  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card max-w-md w-full text-center space-y-8 p-12"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/10 text-accent rounded-[32px]">
          <Sparkles size={40} />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Smart Student Hub</h1>
          <p className="text-secondary text-lg">Your AI-powered academic companion.</p>
        </div>

        <button
          onClick={handleLogin}
          className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-lg"
        >
          <LogIn size={20} />
          Sign in with Google
        </button>

        <p className="text-sm text-secondary">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}
