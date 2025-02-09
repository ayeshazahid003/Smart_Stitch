import React, { useState } from "react";
import { Link } from "react-router"; // or "react-router" if you're using v5
import Header from "../../components/client/Header"; // Your existing navbar
import HeroSection from "../../components/client/HeroSection";
import FeatureSection from "../../components/client/FeatureSection";
import BespokeSection from "../../components/client/BespokeSection";
import NewsSection from "../../components/client/NewsSection";
import Footer from "../../components/client/Footer";

// Example FAQ data:
const faqData = [
  {
    question: "Can I customise or alter any of your designs?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor. Ad dolore magna ut enim veniam velit.",
  },
  {
    question: "How do I take my measurements to purchase a gown?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor. Ad dolore magna ut enim veniam velit.",
  },
  {
    question: "Where are your dresses made?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor. Ad dolore magna ut enim veniam velit.",
  },
  {
    question: "How to pick the right material?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor. Ad dolore magna ut enim veniam velit.",
  },
];

export default function HomePage() {
  const [openFAQ, setOpenFAQ] = useState(-1);

  const toggleFAQ = (index) => {
    setOpenFAQ(index === openFAQ ? -1 : index);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar: using your existing Header component */}
      <Header />

      <HeroSection />

      {/* Work on your new suit section */}
      <section className="bg-white py-16">
        <div className="mx-16 px-6 md:px-12 lg:px-16 flex flex-col md:flex-row items-center md:items-start">
          {/* Left Column */}
          <div className="md:w-1/2 text-left">
            <h2 className="text-4xl md:text-5xl font-sans text-gray-900 leading-tight">
              Individuality of your design.
            </h2>
            <h3 className="text-4xl md:text-5xl font-sans text-gray-900">
              Create your style.
            </h3>
            <p className="text-md font-ibarra italic text-gray-600 mt-2">
              High Quality Tailor
            </p>
          </div>

          {/* Right Column */}
          <div className="md:w-1/2 mt-6 md:mt-0 text-gray-700 leading-relaxed text-lg">
            <p>
              Ut enim ad minima veniam, quis nostrum exercitationem ullam
              corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
              consequatur? Quis autem vel eum iure reprehenderit qui in ea
              voluptate velit esse quam nihil molestiae consequatur, vel illum
              qui dolorem eum fugiat quo voluptas.
            </p>
          </div>
        </div>
      </section>

      <FeatureSection />

      {/* Individuality of your style + Price Table */}
      <section className="py-8 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-xl md:text-2xl font-light text-center mb-8">
            Individuality of your style.
          </h3>
          {/* Price Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="px-2 py-3 font-semibold text-sm">Item</th>
                  <th className="px-2 py-3 font-semibold text-sm">Price</th>
                  <th className="px-2 py-3 font-semibold text-sm">Item</th>
                  <th className="px-2 py-3 font-semibold text-sm">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-2 py-3 text-sm text-gray-700">Skirts</td>
                  <td className="px-2 py-3 text-sm text-gray-700">$65</td>
                  <td className="px-2 py-3 text-sm text-gray-700">Dress</td>
                  <td className="px-2 py-3 text-sm text-gray-700">$145</td>
                </tr>
                <tr className="border-b">
                  <td className="px-2 py-3 text-sm text-gray-700">Trousers</td>
                  <td className="px-2 py-3 text-sm text-gray-700">$85</td>
                  <td className="px-2 py-3 text-sm text-gray-700">
                    Accessories
                  </td>
                  <td className="px-2 py-3 text-sm text-gray-700">$25</td>
                </tr>
                <tr className="border-b">
                  <td className="px-2 py-3 text-sm text-gray-700">Coats</td>
                  <td className="px-2 py-3 text-sm text-gray-700">$120</td>
                  <td className="px-2 py-3 text-sm text-gray-700">Blouses</td>
                  <td className="px-2 py-3 text-sm text-gray-700">$65</td>
                </tr>
                <tr>
                  <td className="px-2 py-3 text-sm text-gray-700">Suits</td>
                  <td className="px-2 py-3 text-sm text-gray-700">$175</td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <BespokeSection/>

      {/* Frequently Asked Questions */}
      <section className="bg-gray-50 py-10 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-xl md:text-2xl font-light text-center">
            Frequently Asked Questions
          </h3>
          <div className="mt-8 space-y-4">
            {faqData.map((item, index) => (
              <div key={index} className="border-b">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center py-3 text-left"
                >
                  <span className="font-semibold text-gray-800">
                    {item.question}
                  </span>
                  <span className="text-gray-600">
                    {openFAQ === index ? "-" : "+"}
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFAQ === index ? "max-h-40" : "max-h-0"
                  }`}
                >
                  <p className="text-gray-700 pb-4">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom image gallery */}
      <NewsSection/>

      {/* Footer */}
      <Footer />
    </div>
  );
}
