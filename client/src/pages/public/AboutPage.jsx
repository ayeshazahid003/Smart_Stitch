// src/components/AboutPage.jsx
import React from "react";
import { Disclosure } from "@headlessui/react";
import Header from "../../components/client/Header";

const faqs = [
  {
    question: "How does the platform work?",
    answer:
      "Users browse through profiles of skilled tailors, submit custom orders with their measurements and design preferences, and pay securely—all in one place.",
  },
  {
    question: "Can I track my orders?",
    answer:
      "Yes—once you place an order, you can monitor its status in real time and chat directly with your tailor for updates.",
  },
  {
    question: "How are tailors vetted?",
    answer:
      "Each tailor goes through a quality review process including portfolio verification and customer feedback to ensure top-notch craftsmanship.",
  },
  {
    question: "What payment methods are supported?",
    answer:
      "We accept major credit/debit cards and popular digital wallets; all payments are processed securely.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero */}
      <Header />
      <section className="py-16 bg-gradient-to-r from-[#020535] to-[#4d1ae5] text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            About Our Tailor Management System
          </h1>
          <p className="text-xl">
            Connecting You to Skilled Tailors for a Seamless, Hassle‑Free
            Tailoring Experience.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-6 text-center">
            Our Mission
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-center">
            We empower both customers and tailors with an intuitive platform
            that streamlines the custom clothing process, ensures high‑quality
            workmanship, and fosters trust through transparency and
            communication.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-6 text-center">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-2xl font-bold mb-2">Browse Tailors</h3>
              <p>
                Discover skilled tailors with detailed profiles, portfolios, and
                customer reviews.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-2xl font-bold mb-2">Place Orders</h3>
              <p>
                Submit custom tailoring requests—include measurements, fabrics,
                and design preferences.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-2xl font-bold mb-2">Track Progress</h3>
              <p>
                Monitor order status, chat with your tailor, and get notified at
                every step.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-6 text-center">
            How It Works
          </h2>
          <ol className="list-decimal list-inside max-w-2xl mx-auto space-y-4 text-lg">
            <li>Select a tailor and customize your order details.</li>
            <li>Confirm measurements, design, and pricing.</li>
            <li>Place your order and make a secure payment.</li>
            <li>
              Receive updates, chat with your tailor, and track delivery to your
              doorstep.
            </li>
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <Disclosure key={idx}>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-left bg-white rounded-lg shadow hover:bg-gray-50 focus:outline-none">
                      <span className="font-medium">{faq.question}</span>
                      <span className="ml-2 select-none">
                        {open ? "−" : "+"}
                      </span>
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-4 py-2 text-gray-700">
                      {faq.answer}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#020535] to-[#4d1ae5] rounded-2xl p-8 md:p-12 shadow-xl text-white text-center relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mt-20 -mr-20"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -mb-16 -ml-16"></div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-gray-200 mb-8 max-w-xl mx-auto relative z-10">
              Get the latest fashion tips, tailoring advice, and exclusive
              offers directly to your inbox.
            </p>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 max-w-md mx-auto relative z-10">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#9760F4]"
              />
              <button className="bg-[#9760F4] px-6 py-3 rounded-full hover:bg-[#8A53E9] transition-colors duration-300 shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#020535] to-[#4d1ae5] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-4">Ready to Get Started?</h2>
          <p className="mb-6">
            Join now and experience the future of custom tailoring.
          </p>
          <a
            href="/register"
            className="inline-block px-8 py-3 bg-[#9760F4] text-white font-semibold rounded-full hover:bg-[#8A53E9] transition-colors duration-300"
          >
            Sign Up Now
          </a>
        </div>
      </section>
    </div>
  );
}
