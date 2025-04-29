import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RoiCalculator from "@/components/RoiCalculator";
import ParticlesBackground from "@/components/ParticlesBackground";

export default function Roi() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 relative">
      <ParticlesBackground />
      <Navbar />
      <div className="pt-20">
        <RoiCalculator />
      </div>
      <Footer />
    </div>
  );
}