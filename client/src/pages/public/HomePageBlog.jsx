import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getAllBlogs } from "../../hooks/BlogsHooks";
import { format } from "date-fns";
import Header from "../../components/client/Header";
import Footer from "../../components/client/Footer";

const HomePageBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const params = {
          status: "published", // Only fetch published blogs
          page: currentPage,
          limit: 6, // Show 6 blogs per page
        };

        const result = await getAllBlogs(params);

        if (result.success) {
          setBlogs(result.data);

          if (result.pagination) {
            setTotalPages(result.pagination.pages);
          }
        } else {
          setError(result.message || "Failed to fetch blogs");
        }
      } catch (error) {
        setError("An error occurred while fetching blogs");
        console.error("Blog fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-r from-[#020535] to-[#4d1ae5]">
        <div className="absolute inset-0 overflow-hidden">
          {/* Blob 1 */}
          <div className="absolute top-0 right-0 w-72 h-72 animate-blob animation-delay-2000 opacity-30">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="#9760F4"
                d="M53,-11.5C61.8,9.8,57.2,41.1,40.6,52.3C24,63.5,-4.6,54.6,-28.3,37.6C-52.1,20.6,-71.1,-4.3,-65.6,-21.1C-60.1,-37.9,-30,-46.5,-3.9,-45.2C22.1,-43.9,44.3,-32.8,53,-11.5Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>

          {/* Blob 2 */}
          <div className="absolute bottom-0 left-0 w-64 h-64 animate-blob animation-delay-4000 opacity-30">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="#51cbff"
                d="M53,-11.5C61.8,9.8,57.2,41.1,40.6,52.3C24,63.5,-4.6,54.6,-28.3,37.6C-52.1,20.6,-71.1,-4.3,-65.6,-21.1C-60.1,-37.9,-30,-46.5,-3.9,-45.2C22.1,-43.9,44.3,-32.8,53,-11.5Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Our Blog
            </h1>
            <h3
              className="text-2xl md:text-3xl font-sans bg-gradient-to-r from-[#cf63ff] to-[#ffffff] text-transparent bg-clip-text mb-6"
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Explore the latest in fashion and tailoring
            </h3>
            <p className="text-gray-200 max-w-2xl mx-auto">
              Stay up-to-date with the latest trends, styling tips, and
              tailoring advice from our expert community.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Cards Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#9760F4]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-[#9760F4] text-white px-6 py-2 rounded-md hover:bg-[#7b4bdb] transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 text-xl">
                No blog posts available yet. Check back soon!
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#E5D5FA] flex flex-col h-full"
                  >
                    {blog.featuredImage ? (
                      <div className="h-56 overflow-hidden">
                        <img
                          src={blog.featuredImage}
                          alt={blog.title}
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 ease-in-out"
                        />
                      </div>
                    ) : (
                      <div className="h-56 bg-gradient-to-r from-[#9760F4] to-[#4d1ae5] flex items-center justify-center">
                        <span className="text-5xl text-white">📝</span>
                      </div>
                    )}

                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex-grow">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-semibold text-gray-500">
                            {format(new Date(blog.createdAt), "MMM d, yyyy")}
                          </span>
                          <span className="inline-block bg-[#F3F1F5] text-[#9760F4] text-xs px-2 py-1 rounded-full">
                            {blog.status}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                          {blog.title}
                        </h3>

                        <div
                          className="text-gray-600 mb-4 line-clamp-3 text-sm"
                          dangerouslySetInnerHTML={{
                            __html:
                              blog.content
                                .replace(/<[^>]*>/g, " ")
                                .substring(0, 150) + "...",
                          }}
                        />
                      </div>

                      <Link
                        to={`/blogs/${blog.slug}`}
                        className="inline-block bg-[#9760F4] text-white py-2 px-5 rounded-full hover:bg-[#7b4bdb] transition-colors duration-300 text-center"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-md ${
                        currentPage === 1
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-[#9760F4] text-white hover:bg-[#7b4bdb]"
                      } transition-colors duration-300`}
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-md ${
                            currentPage === page
                              ? "bg-[#4d1ae5] text-white"
                              : "bg-[#F3F1F5] text-[#9760F4] hover:bg-[#E5D5FA]"
                          } transition-colors duration-300`}
                        >
                          {page}
                        </button>
                      )
                    )}

                    <button
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-md ${
                        currentPage === totalPages
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-[#9760F4] text-white hover:bg-[#7b4bdb]"
                      } transition-colors duration-300`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
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

      <Footer />
    </div>
  );
};

export default HomePageBlog;
