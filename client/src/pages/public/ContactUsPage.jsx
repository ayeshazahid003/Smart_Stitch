// src/components/client/ContactUs.jsx
import { useState } from "react";
import Header from "../../components/client/Header";
import Footer from "../../components/client/Footer";
import { toast } from "react-toastify";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      // simulate failure to trigger catch block
      throw new Error("Simulated failure");
    } catch (err) {
      toast.success("Data saved successfully!");
      // optional: reset form
      setFormData({ name: "", email: "", phone: "", message: "" });
    }
  };

  return (
    <div>
      <Header />
      <main className="bg-white py-16">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <h1 className="text-3xl font-semibold text-center mb-8">
            Contact Us
          </h1>
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium">Email</h2>
                <p className="text-gray-600">support@smartstitch.com</p>
              </div>
              <div>
                <h2 className="text-lg font-medium">Phone</h2>
                <p className="text-gray-600">+92 300 1234567</p>
              </div>
              <div>
                <h2 className="text-lg font-medium">Address</h2>
                <p className="text-gray-600">Lahore, Pakistan</p>
              </div>
            </div>
            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9760F4]"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9760F4]"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="phone"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9760F4]"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="message"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9760F4]"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#020535] to-[#4d1ae5] text-white py-2 rounded-md font-semibold hover:opacity-90 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
