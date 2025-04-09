import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Save, X, Image } from "lucide-react";
import { createBlog, updateBlog, getBlogById } from "../../../hooks/BlogsHooks";
import axios from "axios";

// Cloudinary upload function
const uploadSingleFile = async (base64Image, folder) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/uploadimage",
      {
        file: base64Image,
        folder,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

const BlogCreationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get blog ID from URL if editing
  const isEditMode = Boolean(id);

  const [blog, setBlog] = useState({
    title: "",
    content: "",
    status: "draft",
    featuredImage: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingBlog, setLoadingBlog] = useState(isEditMode);
  const [errors, setErrors] = useState({});
  const [uploadingImage, setUploadingImage] = useState(false);

  const fileInputRef = useRef(null);
  const quillImageInputRef = useRef(null); // Separate ref for Quill editor image uploads
  const quillRef = useRef();

  // Fetch blog data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchBlog = async () => {
        try {
          setLoadingBlog(true);
          const result = await getBlogById(id);

          if (result.success) {
            setBlog({
              title: result.data.title,
              content: result.data.content,
              status: result.data.status,
              featuredImage: result.data.featuredImage,
            });
          } else {
            console.error("Error fetching blog:", result.message);
            setErrors((prev) => ({
              ...prev,
              form: `Failed to fetch blog: ${result.message}`,
            }));
          }
          setLoadingBlog(false);
        } catch (error) {
          console.error("Error fetching blog:", error);
          setErrors((prev) => ({
            ...prev,
            form: "Failed to fetch blog. Please try again.",
          }));
          setLoadingBlog(false);
        }
      };

      fetchBlog();
    }
  }, [id, isEditMode]);

  // Memoized image handler for Quill editor to keep its reference stable
  const imageHandler = useCallback(() => {
    if (quillImageInputRef.current) {
      quillImageInputRef.current.click();
    }
  }, []);

  // Memoize the modules configuration for ReactQuill to prevent re-initialization
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    [imageHandler]
  );

  const handleFeaturedImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.includes("image")) {
      setErrors((prev) => ({
        ...prev,
        featuredImage: "Please select an image file",
      }));
      return;
    }

    try {
      setUploadingImage(true);

      // Convert image to base64
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });

      // Upload image to cloudinary
      const imageUrl = await uploadSingleFile(base64Image, "Blog");

      setBlog((prevBlog) => ({
        ...prevBlog,
        featuredImage: imageUrl,
      }));

      setUploadingImage(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrors((prev) => ({
        ...prev,
        featuredImage: "Failed to upload image",
      }));
      setUploadingImage(false);
    }
  };

  const handleQuillImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.includes("image")) {
      alert("Please select an image file");
      return;
    }

    try {
      setUploadingImage(true);

      // Convert image to base64
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });

      // Upload image to cloudinary
      const imageUrl = await uploadSingleFile(base64Image, "Blog");

      // Insert image into Quill editor
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      quill.insertEmbed(range.index, "image", imageUrl);

      setUploadingImage(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
      setUploadingImage(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlog((prevBlog) => ({
      ...prevBlog,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleEditorChange = (content) => {
    setBlog((prevBlog) => ({
      ...prevBlog,
      content,
    }));

    if (errors.content) {
      setErrors((prev) => ({
        ...prev,
        content: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!blog.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!blog.content.trim()) {
      newErrors.content = "Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      let result;

      if (isEditMode) {
        // Update existing blog
        result = await updateBlog(id, blog);
      } else {
        // Create new blog
        result = await createBlog(blog);
      }

      if (!result.success) {
        throw new Error(
          result.message || `Failed to ${isEditMode ? "update" : "create"} blog`
        );
      }

      navigate("/platform-admin/blogs");
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} blog:`,
        error
      );
      setErrors((prev) => ({
        ...prev,
        form: error.message,
      }));
      setLoading(false);
    }
  };

  if (loadingBlog) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Edit Blog" : "Create New Blog"}
        </h1>
        <button
          onClick={() => navigate("/platform-admin/blogs")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded flex items-center"
        >
          <X size={18} className="mr-2" />
          Cancel
        </button>
      </div>

      {errors.form && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errors.form}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="mb-6">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title*
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={blog.title}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter blog title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="featuredImage"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Featured Image
          </label>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded flex items-center"
              disabled={uploadingImage}
            >
              <Image size={18} className="mr-2" />
              {uploadingImage ? "Uploading..." : "Upload Image"}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFeaturedImageChange}
              className="hidden"
              accept="image/*"
            />
            {blog.featuredImage && (
              <span className="ml-4 text-sm text-green-600">
                Image uploaded successfully
              </span>
            )}
          </div>
          {blog.featuredImage && (
            <div className="mt-2">
              <img
                src={blog.featuredImage}
                alt="Featured"
                className="object-contain rounded border"
              />
            </div>
          )}
          {errors.featuredImage && (
            <p className="mt-1 text-sm text-red-500">{errors.featuredImage}</p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Content*
          </label>
          <div
            className={`border rounded ${
              errors.content ? "border-red-500" : "border-gray-300"
            }`}
          >
            <ReactQuill
              ref={quillRef}
              value={blog.content}
              onChange={handleEditorChange}
              modules={modules}
              theme="snow"
              placeholder="Write your blog content here..."
              className="h-64"
            />
          </div>
          {errors.content && (
            <p className="mt-1 text-sm text-red-500">{errors.content}</p>
          )}

          {/* Hidden file input for Quill image upload using separate ref */}
          <input
            type="file"
            onChange={handleQuillImageUpload}
            className="hidden"
            accept="image/*"
            ref={quillImageInputRef}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={blog.status}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded flex items-center"
          >
            <Save size={18} className="mr-2" />
            {loading
              ? isEditMode
                ? "Updating..."
                : "Saving..."
              : isEditMode
              ? "Update Blog"
              : "Save Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogCreationPage;
