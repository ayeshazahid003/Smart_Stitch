import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { format } from "date-fns";
import { getBlogBySlug } from "../../hooks/BlogsHooks";
import Header from "../../components/client/Header";
import Footer from "../../components/client/Footer";

const SingleBlogPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const result = await getBlogBySlug(slug);

        if (result.success) {
          setBlog(result.data);
          // In a real app, you would fetch related blogs here
          // For now, we'll just show an empty array
          setRelatedBlogs([]);
        } else {
          setError(result.message || "Failed to fetch blog");
        }
      } catch (error) {
        setError("An error occurred while fetching the blog");
        console.error("Blog fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#9760F4]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex justify-center items-center flex-col p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Blog Not Found
            </h2>
            <p className="text-gray-700 mb-6">
              {error ||
                "The blog you're looking for doesn't exist or has been removed."}
            </p>
            <Link
              to="/blogs"
              className="inline-block bg-[#9760F4] text-white py-2 px-6 rounded-full hover:bg-[#7b4bdb] transition-colors duration-300"
            >
              Back to Blogs
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section with Featured Image */}
      <section className="relative w-full bg-gradient-to-r from-[#020535] to-[#4d1ae5] overflow-hidden">
        {blog.featuredImage ? (
          <div className="w-full h-[50vh] relative">
            <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center px-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-4xl mx-auto leading-tight">
                  {blog.title}
                </h1>
                <div className="flex justify-center items-center space-x-4 text-white">
                  <span>
                    {format(new Date(blog.createdAt), "MMMM d, yyyy")}
                  </span>
                  <span>•</span>
                  <span>By {blog.author?.name || "Admin"}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-16 md:py-24 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-4xl mx-auto px-6 leading-tight">
              {blog.title}
            </h1>
            <div className="flex justify-center items-center space-x-4 text-white">
              <span>{format(new Date(blog.createdAt), "MMMM d, yyyy")}</span>
              <span>•</span>
              <span>By {blog.author?.name || "Admin"}</span>
            </div>
          </div>
        )}
      </section>

      {/* Blog Content */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg mx-auto">
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>

            {/* Tags and Share */}
            <div className="border-t border-b border-gray-200 py-6 mt-12 flex flex-wrap justify-between items-center">
              <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
                <span className="text-gray-600">Tags:</span>
                <span className="px-3 py-1 bg-[#F3F1F5] text-[#9760F4] rounded-full text-sm">
                  Fashion
                </span>
                <span className="px-3 py-1 bg-[#F3F1F5] text-[#9760F4] rounded-full text-sm">
                  Tailoring
                </span>
                <span className="px-3 py-1 bg-[#F3F1F5] text-[#9760F4] rounded-full text-sm">
                  Style
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-gray-600">Share:</span>
                <button className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700">
                  f
                </button>
                <button className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500">
                  t
                </button>
                <button className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700">
                  p
                </button>
              </div>
            </div>

            {/* Author Bio */}
            <div className="mt-12 bg-gray-50 rounded-xl p-6 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-4 border-[#9760F4]">
                <img
                  src={
                    blog.author?.profilePicture ||
                    "https://via.placeholder.com/80"
                  }
                  alt={blog.author?.name || "Author"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-gray-800">
                  {blog.author?.name || "Admin"}
                </h3>
                <p className="text-[#9760F4] mb-2">
                  {blog.author?.role || "Author"}
                </p>
                <p className="text-gray-600">
                  Professional tailor with over 10 years of experience in the
                  fashion industry, specializing in custom suits and wedding
                  dresses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedBlogs.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-10">
              Related Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedBlogs.map((relatedBlog) => (
                <div
                  key={relatedBlog._id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Related blog card content */}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-[#9760F4] to-[#4d1ae5] rounded-2xl p-8 md:p-12 shadow-xl text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mt-20 -mr-20"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -mb-16 -ml-16"></div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10">
                Ready to Create Your Custom Design?
              </h2>
              <p className="text-gray-200 mb-8 max-w-xl mx-auto relative z-10">
                Connect with our expert tailors today and turn your fashion
                vision into reality.
              </p>

              <Link
                to="/search"
                className="inline-block bg-white text-[#9760F4] px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors duration-300 shadow-lg relative z-10"
              >
                Find a Tailor
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SingleBlogPage;
