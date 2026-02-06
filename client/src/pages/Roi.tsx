import Navigation from "@/components/landing/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import RoiCalculator from "@/components/RoiCalculator";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Roi() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO page="/roi" />
      <motion.div
        className="min-h-screen bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <Navigation />
          <main>
            <div className="pt-20">
              <RoiCalculator />
            </div>
          </main>
          <Footer />
          <ScrollToTop />
        </div>
      </motion.div>
    </>
  );
}
