import Navbar from "../components/Navbar";
import TeamSection from "../components/TeamSection";
import FaqSection  from "../components/FaqSection";
import Footer from "../components/Footer";

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white text-gray-900 px-6 py-12">
        <TeamSection />
        <FaqSection />
        <Footer />
      </div>
    </>
  );
};

export default AboutUs;
