import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Trash,
  Edit,
  Plus,
} from "lucide-react";
import { Link } from "react-router";
import { getAllBlogs, deleteBlog } from "../../../hooks/BlogsHooks";

const BlogListingPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);

        const params = {
          status: filters.status,
          page: pagination.page,
          limit: pagination.limit,
        };

        const result = await getAllBlogs(params);

        if (result.success) {
          setBlogs(result.data);

          if (result.pagination) {
            setPagination(result.pagination);
          }
        } else {
          console.error("Error fetching blogs:", result.message);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [filters.status, pagination.page, pagination.limit]);

  // Handle sorting
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return null;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
  };

  // Apply sorting and filtering
  const filteredAndSortedBlogs = () => {
    let filtered = [...blogs];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog._id.toString().includes(searchTerm)
      );
    }

    // Apply date filters
    if (filters.startDate) {
      filtered = filtered.filter(
        (blog) => new Date(blog.createdAt) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(
        (blog) => new Date(blog.createdAt) <= new Date(filters.endDate)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      startDate: "",
      endDate: "",
    });
    setSearchTerm("");
  };

  const handleDeleteBlog = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const result = await deleteBlog(id);

        if (result.success) {
          // Remove the deleted blog from the state
          setBlogs(blogs.filter((blog) => blog._id !== id));
        } else {
          console.error("Error deleting blog:", result.message);
          alert(`Failed to delete blog: ${result.message}`);
        }
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Failed to delete blog. Please try again.");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Management</h1>
        <Link
          to="/admin/blogs/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Create New Blog
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div className="relative mb-4 md:mb-0 md:w-1/3">
            <input
              type="text"
              placeholder="Search by title or ID..."
              className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>

          <button
            className="flex items-center text-gray-600 hover:text-blue-600"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} className="mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {showFilters && (
          <div className="mb-6 p-4 bg-gray-50 rounded border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={resetFilters}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredAndSortedBlogs().length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No blogs found. Create your first blog!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th
                    className="px-4 py-2 cursor-pointer"
                    onClick={() => requestSort("_id")}
                  >
                    <div className="flex items-center">
                      ID {getSortIcon("_id")}
                    </div>
                  </th>
                  <th
                    className="px-4 py-2 cursor-pointer"
                    onClick={() => requestSort("title")}
                  >
                    <div className="flex items-center">
                      Title {getSortIcon("title")}
                    </div>
                  </th>
                  <th
                    className="px-4 py-2 cursor-pointer"
                    onClick={() => requestSort("status")}
                  >
                    <div className="flex items-center">
                      Status {getSortIcon("status")}
                    </div>
                  </th>
                  <th
                    className="px-4 py-2 cursor-pointer"
                    onClick={() => requestSort("createdAt")}
                  >
                    <div className="flex items-center">
                      Created At {getSortIcon("createdAt")}
                    </div>
                  </th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedBlogs().map((blog) => (
                  <tr key={blog._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{blog._id}</td>
                    <td className="px-4 py-2 font-medium">{blog.title}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          blog.status === "published"
                            ? "bg-green-100 text-green-800"
                            : blog.status === "draft"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {format(new Date(blog.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        <Link
                          to={`/admin/blogs/edit/${blog._id}`}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDeleteBlog(blog._id)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-600">
              Showing{" "}
              {Math.min(
                (pagination.page - 1) * pagination.limit + 1,
                pagination.total
              )}{" "}
              to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} blogs
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() =>
                  setPagination({
                    ...pagination,
                    page: Math.max(1, pagination.page - 1),
                  })
                }
                disabled={pagination.page === 1}
                className={`px-3 py-1 border rounded ${
                  pagination.page === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              {[...Array(pagination.pages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setPagination({ ...pagination, page: index + 1 })
                  }
                  className={`px-3 py-1 border rounded ${
                    pagination.page === index + 1
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setPagination({
                    ...pagination,
                    page: Math.min(pagination.pages, pagination.page + 1),
                  })
                }
                disabled={pagination.page === pagination.pages}
                className={`px-3 py-1 border rounded ${
                  pagination.page === pagination.pages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogListingPage;
