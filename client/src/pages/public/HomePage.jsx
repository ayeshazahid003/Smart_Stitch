import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Scissors,
  Clock,
  Star,
  ChevronRight,
  Search,
  Shield,
  Briefcase,
} from "lucide-react";
import Header from "../../components/client/Header";

// Dummy data
const platformBenefits = [
  {
    icon: <Search className="w-6 h-6" />,
    title: "Find Expert Tailors",
    description:
      "Browse through verified tailors in your area and choose based on ratings and specialties.",
    forCustomers: true,
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: "Grow Your Business",
    description:
      "Reach more customers and manage your tailoring business efficiently on our platform.",
    forCustomers: false,
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure Payments",
    description:
      "Safe and secure payment processing for all services through our platform.",
    forCustomers: true,
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Easy Scheduling",
    description:
      "Book appointments and manage your calendar with our intuitive scheduling system.",
    forCustomers: true,
  },
];

const featuredTailors = [
  {
    image:
      "https://cdn.pixabay.com/photo/2023/08/08/09/20/wedding-8176868_640.jpg",
    name: "Elite Fashion Studio",
    rating: 4.8,
    reviews: 156,
    specialty: "Wedding & Formal Wear",
    location: "New York, NY",
  },
  {
    image:
      "https://cdn.pixabay.com/photo/2022/12/04/07/03/woman-7633843_1280.jpg",
    name: "Contemporary Cuts",
    rating: 4.9,
    reviews: 203,
    specialty: "Modern Fashion & Alterations",
    location: "Los Angeles, CA",
  },
  {
    image:
      "https://cdn.pixabay.com/photo/2020/06/26/14/46/india-5342927_1280.jpg",
    name: "Business Wear Experts",
    rating: 4.7,
    reviews: 178,
    specialty: "Corporate & Business Attire",
    location: "Chicago, IL",
  },
];

const testimonials = [
  {
    name: "John Smith",
    role: "Customer",
    content:
      "Found the perfect tailor for my wedding suit. The platform made it easy to compare options and book appointments.",
    rating: 5,
  },
  {
    name: "Sarah Johnson",
    role: "Professional Tailor",
    content:
      "This platform has helped me grow my business significantly. The scheduling and payment systems are seamless.",
    rating: 5,
  },
  {
    name: "Michael Brown",
    role: "Customer",
    content:
      "Great selection of professional tailors. I love being able to read reviews and see previous work before booking.",
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Sectio n */}

      <Header />

      <section className="relative bg-indigo-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center lg:text-left lg:w-2/3">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Connect with Expert Tailors Near You
            </h1>
            <p className="text-lg md:text-xl text-indigo-200 mb-8">
              Find skilled tailors for your custom clothing needs or grow your
              tailoring business by joining our platform.
            </p>
            <div className="space-x-4">
              <Link to="/search-tailors">
                <Button
                  size="lg"
                  className="bg-white text-indigo-950 hover:bg-indigo-100"
                >
                  Find a Tailor
                </Button>
              </Link>
              <Link to="/become-tailor">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-green-900 hover:bg-black hover:text-white"
                >
                  Join as a Tailor
                </Button>
              </Link>
              {/* Sign In Button */}
              <Link to="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-green-900 hover:bg-black hover:text-white"
                >
                  Have An Account? Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-indigo-950 mb-4">
              Why Choose Our Platform
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Whether you're looking for a tailor or are one yourself, we make
              the process simple and secure.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {platformBenefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-indigo-950 mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-indigo-950 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tailors */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-indigo-950 mb-4">
              Featured Tailors
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover top-rated tailors in your area.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTailors.map((tailor, index) => (
              <Link
                to={`/tailor-profile/${index}`}
                key={index}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="relative h-64">
                    <img
                      src={tailor.image}
                      alt={tailor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-semibold text-indigo-950">
                        {tailor.name}
                      </h3>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-gray-600">
                          {tailor.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{tailor.specialty}</p>
                    <p className="text-sm text-gray-500">{tailor.location}</p>
                    <p className="text-sm text-gray-500">
                      {tailor.reviews} reviews
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/search-tailors">
              <Button className="bg-indigo-950 text-white hover:bg-indigo-900">
                View All Tailors <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-indigo-950 mb-4">
              Platform Success Stories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from our community of tailors and satisfied customers.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-950 font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-indigo-950">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-indigo-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/testimonials">
              <Button
                variant="outline"
                className="border-indigo-950 text-indigo-950 hover:bg-indigo-950 hover:text-white"
              >
                Read More Success Stories
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-indigo-950 mb-4">
              How It Works
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h3 className="text-2xl font-bold text-indigo-950 mb-6">
                For Customers
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-950 text-white rounded-full flex items-center justify-center">
                    1
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold">Search Tailors</h4>
                    <p className="text-gray-600">
                      Browse through our verified tailors and read reviews.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-950 text-white rounded-full flex items-center justify-center">
                    2
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold">Book Appointment</h4>
                    <p className="text-gray-600">
                      Schedule a fitting at your convenience.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-950 text-white rounded-full flex items-center justify-center">
                    3
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold">
                      Get Your Perfect Fit
                    </h4>
                    <p className="text-gray-600">
                      Work with your chosen tailor and pay securely through our
                      platform.
                    </p>
                  </div>
                </div>
                {/* Added Get Started Button */}
                <div className="text-center mt-8">
                  <Link to="/register">
                    <Button className="bg-indigo-950 text-white hover:bg-indigo-900">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-indigo-950 mb-6">
                For Tailors
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-950 text-white rounded-full flex items-center justify-center">
                    1
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold">
                      Create Your Profile
                    </h4>
                    <p className="text-gray-600">
                      Showcase your work and specialties.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-950 text-white rounded-full flex items-center justify-center">
                    2
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold">Receive Bookings</h4>
                    <p className="text-gray-600">
                      Accept appointments and manage your schedule.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-950 text-white rounded-full flex items-center justify-center">
                    3
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold">
                      Grow Your Business
                    </h4>
                    <p className="text-gray-600">
                      Get paid securely and build your client base.
                    </p>
                  </div>
                </div>
                {/* Added Join Now Button */}
                <div className="text-center mt-8">
                  <Link to="/become-tailor">
                    <Button className="bg-indigo-950 text-white hover:bg-indigo-900">
                      Join Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Looking for a Tailor?</h2>
              <p className="text-indigo-200 mb-6">
                Find the perfect tailor for your needs.
              </p>
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-white text-indigo-950 hover:bg-indigo-100"
                >
                  Find Tailors Near You
                </Button>
              </Link>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Are You a Tailor?</h2>
              <p className="text-indigo-200 mb-6">
                Join our platform and grow your business.
              </p>
              <Link to="/become-tailor">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-green-900 hover:bg-white hover:text-indigo-950"
                >
                  Join as a Tailor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Scissors className="w-6 h-6 text-indigo-950" />
              <span className="text-xl font-bold text-indigo-950">
                TailorMatch
              </span>
            </div>
            <div className="space-x-6">
              <Link to="/about" className="text-gray-600 hover:text-indigo-950">
                About
              </Link>
              <Link
                to="/search-tailors"
                className="text-gray-600 hover:text-indigo-950"
              >
                Find Tailors
              </Link>
              <Link
                to="/become-tailor"
                className="text-gray-600 hover:text-indigo-950"
              >
                Become a Tailor
              </Link>
              <Link
                to="/contact"
                className="text-gray-600 hover:text-indigo-950"
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>© 2024 TailorMatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
