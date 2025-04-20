// src/components/Footer.jsx
import React, { useState } from "react";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setTimeout(() => {
        toast.success("You have subscribed to our newsletter!");
      }, 500);
      setEmail(""); // clear input
    } else {
      setTimeout(() => {
        toast.error("Please enter a valid email address.");
      }, 500);
    }
  };

  return (
    <footer className="bg-gradient-to-r from-[#020535] to-[#4d1ae5] text-white py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Branding */}
          <div>
            <h4 className="text-xl font-semibold">SmartStitch</h4>
            <p className="mt-4 text-sm max-w-xs">
              Connecting you to skilled tailors for a seamless tailoring
              experience.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h5 className="text-lg font-semibold mb-4">Contact</h5>
            <ul className="text-sm space-y-2">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>contact@smartstitch.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Lahore, Pakistan</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-lg font-semibold mb-4">Quick Links</h5>
            <ul className="text-sm space-y-2">
              <li>
                <Link to="/about" className="hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:underline">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h5 className="text-lg font-semibold mb-4">Stay Updated</h5>
            <p className="text-sm mb-4">
              Sign up for news, tips, and special offers.
            </p>
            <form className="relative" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 pr-12 bg-white/10 border border-white/30 rounded-full placeholder-white focus:outline-none focus:ring-2 focus:ring-[#9760F4]"
              />
              <button
                type="submit"
                className="absolute top-1/2 -translate-y-1/2 right-1 w-9 h-9 flex items-center justify-center rounded-full bg-[#9760F4] text-white hover:bg-[#7c4de9] transition"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-white/30 text-center text-sm text-white/50">
          © {new Date().getFullYear()} SmartStitch. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
