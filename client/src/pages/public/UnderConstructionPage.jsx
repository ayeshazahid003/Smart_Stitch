import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Construction, HomeIcon, Clock, Bell } from "lucide-react";

const UnderConstructionPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center p-4">
      {/* Main Content */}
      <div className="text-center max-w-2xl mx-auto">
        {/* Icon */}
        <div className="mb-8 relative">
          <Construction className="w-24 h-24 text-indigo-950 mx-auto animate-bounce" />
          <div className="absolute top-0 right-1/4 animate-ping">
            <Clock className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="absolute bottom-0 left-1/4 animate-pulse">
            <Bell className="w-6 h-6 text-indigo-600" />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-4xl font-bold text-indigo-950 mb-4">
          Under Construction
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          We&apos;re working hard to bring you something amazing. This page will
          be ready soon!
        </p>

        {/* Features Coming Soon */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 text-left">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-indigo-950 mb-2">
              Coming Features
            </h3>
            <ul className="text-gray-600 space-y-2">
              <li>✨ Enhanced User Profiles</li>
              <li>✨ Advanced Search Options</li>
              <li>✨ Booking System</li>
              <li>✨ Portfolio Showcase</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-indigo-950 mb-2">Stay Updated</h3>
            <p className="text-gray-600">
              Want to know when we launch? Subscribe to our newsletter for
              updates!
            </p>
            <div className="mt-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-2 border rounded-lg mb-2"
              />
              <Button className="w-full bg-indigo-950 text-white hover:bg-indigo-900">
                Notify Me
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="space-y-4">
          <Link to="/">
            <Button
              size="lg"
              className="bg-indigo-950 text-white hover:bg-indigo-900"
            >
              <HomeIcon className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Progress Indicator */}
        <div className="mt-12">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-indigo-600 h-2.5 rounded-full w-3/4 animate-pulse"></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Approximately 75% Complete
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>© 2024 TailorMatch. All rights reserved.</p>
        <p className="mt-1">We appreciate your patience!</p>
      </footer>
    </div>
  );
};

export default UnderConstructionPage;
