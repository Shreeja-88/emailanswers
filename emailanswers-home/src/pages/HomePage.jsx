import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import HowItWorks from "../components/HowItWorks/HowItWorks";
import Products from "../components/Products/Products";
import Agencies from "../components/Agencies/Agencies";
import Pricing from "../components/Pricing/Pricing";
import FAQ from "../components/FAQ/FAQ";
import Footer from "../components/Footer/Footer";

function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Products />
        <Agencies />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}

export default HomePage;