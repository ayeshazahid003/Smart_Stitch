import { Outlet } from "react-router";
import { Scissors } from "lucide-react"; // Import the scissors icon for a tailor theme

function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Fashion/Tailor themed hero section */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-950 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute transform rotate-45 -left-1/4 -top-1/4 w-full h-full border-[40px] border-white rounded-full"></div>
          <div className="absolute transform rotate-45 -right-1/4 -bottom-1/4 w-full h-full border-[40px] border-white rounded-full"></div>
        </div>

        <div className="relative">
          {/* Logo/Brand name */}
          <div className="flex items-center space-x-2 text-2xl font-bold">
            <Scissors className="w-8 h-8" />
            <span>StitchMaster</span>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Crafting Perfect Fits,
            <br />
            Tailored to Perfection
          </h1>
          <p className="text-lg text-indigo-200">
            Streamline your tailoring business with our comprehensive management
            platform designed specifically for fashion professionals.
          </p>

          {/* Tailor-specific features */}
          <div className="mt-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-6 h-6 border-2 border-indigo-300 rounded-full flex items-center justify-center">
                  ✓
                </div>
                <p className="text-indigo-200">
                  Customer Measurements Management
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-6 h-6 border-2 border-indigo-300 rounded-full flex items-center justify-center">
                  ✓
                </div>
                <p className="text-indigo-200">Appointment Scheduling</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-6 h-6 border-2 border-indigo-300 rounded-full flex items-center justify-center">
                  ✓
                </div>
                <p className="text-indigo-200">Order Tracking & Management</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-6 h-6 border-2 border-indigo-300 rounded-full flex items-center justify-center">
                  ✓
                </div>
                <p className="text-indigo-200">Style Catalog & Design Tools</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with fashion quote */}
        <div className="relative">
          <blockquote className="text-indigo-200 italic">
            "Style is a way to say who you are without having to speak"
          </blockquote>
          <div className="mt-4 text-sm text-indigo-300">
            © 2024 StitchMaster. Elevating the Art of Tailoring.
          </div>
        </div>
      </div>

      {/* Right side - Auth forms with fashion-themed background */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md relative">
          {/* Decorative elements */}
          <div className="absolute -top-6 -left-6 w-12 h-12 border-t-2 border-l-2 border-indigo-950 opacity-20"></div>
          <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b-2 border-r-2 border-indigo-950 opacity-20"></div>

          {/* Auth forms will be rendered here */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
