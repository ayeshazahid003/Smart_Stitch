import React from "react";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Left Section - Branding */}
          <div>
            <h4 className="text-xl font-semibold tracking-wide">SmartStitch</h4>
            <p className="mt-4 text-sm text-gray-400 max-w-xs">
              Discover the finest tailor and haute couture studio in town, get in touch with us and let’s start the work on your new suit together.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                🌐
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                🎥
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                📸
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                📌
              </a>
            </div>
          </div>

          {/* Middle Section - Contact Info */}
          <div>
            <h5 className="text-lg font-semibold mb-4">Information:</h5>
            <ul className="text-sm text-gray-400 space-y-2">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span>info.tailor@example.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>+345 8892 7413</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>35 Savile Row, London W1S</span>
              </li>
              <li>Monday to Saturday: 10am - 6pm</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-lg font-semibold mb-4">Quick Links:</h5>
            <ul className="text-sm text-gray-400 space-y-2">
              <li className="hover:text-white transition">
                <a href="#">ABOUT</a>
              </li>
              <li className="hover:text-white transition">
                <a href="#">SERVICES</a>
              </li>
              <li className="hover:text-white transition">
                <a href="#">OUR HERITAGE</a>
              </li>
              <li className="hover:text-white transition">
                <a href="#">TAILORS</a>
              </li>
              <li className="hover:text-white transition">
                <a href="#">CONTACT US</a>
              </li>
            </ul>
          </div>

          {/* Join Us Section */}
          <div>
            <h5 className="text-lg font-semibold mb-4">Join Us:</h5>
            <p className="text-sm text-gray-400">
              Sign up for exclusive offers, original stories, events and more.
            </p>
            <form className="mt-4 relative">
              <input
                type="email"
                placeholder="Your email *"
                className="w-full px-4 py-2 bg-transparent border border-gray-600 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                className="absolute top-0 right-0 h-full px-4 flex items-center justify-center bg-transparent border-l border-gray-600 text-gray-400 hover:text-white"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-6 border-t border-gray-700 text-center text-sm text-gray-500">
          © 2024 SmartStitch. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
