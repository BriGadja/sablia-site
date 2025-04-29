
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RoiCalculator from "@/components/RoiCalculator";
import ParticlesBackground from "@/components/ParticlesBackground";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Roi() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div 
      className="min-h-screen bg-gray-900 text-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Navbar />
      <main className="bg-gray-900">
        <div className="pt-20">
          <RoiCalculator />
        </div>
      </main>
      <Footer />
    </motion.div>
  );
}
