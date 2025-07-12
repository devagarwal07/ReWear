import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/AddItem.module.css";
import { createItem, uploadItemImage } from "../api";
import { useAuth } from "../auth/AuthContext";

export default function AddItem() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    size: "",
    condition: "",
    tags: "",
    price: "",
    brand: "",
  });

  const [images, setImages] = useState([null, null, null, null, null]);
  const [previews, setPreviews] = useState([null, null, null, null, null]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle drop events
  const handleDrop = useCallback((e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(index, e.dataTransfer.files[0]);
    }
  }, []);

  // Remove image handler
  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previews];

    if (newPreviews[index]) {
      URL.revokeObjectURL(newPreviews[index]);
    }

    newImages[index] = null;
    newPreviews[index] = null;
    setImages(newImages);
    setPreviews(newPreviews);
  };

  // Handle text field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Handle image input and preview
  const handleImageChange = (index, file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    const newImages = [...images];
    const newPreviews = [...previews];

    // Revoke previous URL to prevent memory leaks
    if (newPreviews[index]) {
      URL.revokeObjectURL(newPreviews[index]);
    }

    newImages[index] = file;
    newPreviews[index] = URL.createObjectURL(file);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.type.trim()) newErrors.type = "Type is required";
    if (!form.size.trim()) newErrors.size = "Size is required";
    if (!form.condition) newErrors.condition = "Condition is required";
    if (!form.brand.trim()) newErrors.brand = "Brand is required";
    if (!form.price.trim()) newErrors.price = "Price is required";
    if (!previews[0]) newErrors.mainImage = "Main image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Upload images and get URLs
      const imageUrls = [];
      for (let i = 0; i < images.length; i++) {
        if (images[i]) {
          const res = await uploadItemImage(images[i]);
          imageUrls.push(res.url);
        }
      }

      // Prepare tags as array
      const tagsArr = form.tags
        ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      // Prepare payload
      const payload = {
        ...form,
        tags: tagsArr,
        images: imageUrls,
        price: Number(form.price),
        uploader: user?._id, // Set uploader from auth context
      };

      await createItem(payload);
      alert("Item listed successfully! 🎉");
      navigate("/dashboard");
      // Reset form
      setForm({
        title: "",
        description: "",
        category: "",
        type: "",
        size: "",
        condition: "",
        tags: "",
        price: "",
        brand: "",
      });
      setImages([null, null, null, null, null]);
      setPreviews([null, null, null, null, null]);
      setErrors({});
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>Add New Item</h1>
          <div className={styles.headerSpacer}></div>
        </div>
      </header>

      {/* Search Bar */}
      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search existing items..."
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>
      </div>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.contentWrapper}>
          <div className={styles.pageHeader}>
            <h2 className={styles.mainTitle}>List Your Item</h2>
            <p className={styles.subtitle}>Share your pre-loved items with the community</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formLayout}>
              {/* Left Column - Images */}
              <div className={styles.imageSection}>
                {/* Main Image */}
                <div className={styles.mainImageContainer}>
                  <label
                    className={`${styles.imageUploadLabel} ${dragActive ? styles.dragActive : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={(e) => handleDrop(e, 0)}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(0, e.target.files[0])}
                      className={styles.hiddenInput}
                    />
                    {previews[0] ? (
                      <div className={styles.imagePreviewWrapper}>
                        <img
                          src={previews[0]}
                          alt="Main product"
                          className={styles.mainImage}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(0)}
                          className={styles.removeImageBtn}
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className={styles.imagePlaceholder}>
                        <div className={styles.uploadIcon}>📷</div>
                        <div className={styles.uploadText}>Main Product Image</div>
                        <div className={styles.uploadSubtext}>
                          Drag & drop or click to upload
                        </div>
                      </div>
                    )}
                  </label>
                  {errors.mainImage && <div className={styles.error}>{errors.mainImage}</div>}
                </div>

                {/* Additional Images */}
                <div className={styles.additionalImages}>
                  <h3 className={styles.sectionTitle}>Additional Images</h3>
                  <div className={styles.thumbnailGrid}>
                    {[1, 2, 3, 4].map((index) => (
                      <label key={index} className={styles.thumbnailLabel}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(index, e.target.files[0])}
                          className={styles.hiddenInput}
                        />
                        {previews[index] ? (
                          <div className={styles.thumbnailWrapper}>
                            <img
                              src={previews[index]}
                              alt={`Product ${index + 1}`}
                              className={styles.thumbnail}
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className={styles.removeThumbnailBtn}
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <div className={styles.thumbnailPlaceholder}>
                            <span>+</span>
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Form Details */}
              <div className={styles.detailsSection}>
                <div className={styles.formCard}>
                  <h3 className={styles.cardTitle}>Item Details</h3>

                  <div className={styles.formGrid}>
                    {/* Title */}
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>
                        Item Title *
                        <input
                          type="text"
                          name="title"
                          value={form.title}
                          onChange={handleChange}
                          className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
                          placeholder="Enter item title"
                        />
                      </label>
                      {errors.title && <div className={styles.error}>{errors.title}</div>}
                    </div>

                    {/* Brand & Price */}
                    <div className={styles.inputRow}>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>
                          Brand *
                          <input
                            type="text"
                            name="brand"
                            value={form.brand}
                            onChange={handleChange}
                            className={`${styles.input} ${errors.brand ? styles.inputError : ''}`}
                            placeholder="Enter brand name"
                          />
                        </label>
                        {errors.brand && <div className={styles.error}>{errors.brand}</div>}
                      </div>

                      <div className={styles.inputGroup}>
                        <label className={styles.label}>
                          Price *
                          <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            className={`${styles.input} ${errors.price ? styles.inputError : ''}`}
                            placeholder="Enter price"
                          />
                        </label>
                        {errors.price && <div className={styles.error}>{errors.price}</div>}
                      </div>
                    </div>

                    {/* Category & Type */}
                    <div className={styles.inputRow}>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>
                          Category *
                          <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className={`${styles.select} ${errors.category ? styles.inputError : ''}`}
                          >
                            <option value="">Select category</option>
                            <option value="clothing">Clothing</option>
                            <option value="accessories">Accessories</option>
                            <option value="shoes">Shoes</option>
                            <option value="bags">Bags</option>
                          </select>
                        </label>
                        {errors.category && <div className={styles.error}>{errors.category}</div>}
                      </div>

                      <div className={styles.inputGroup}>
                        <label className={styles.label}>
                          Type *
                          <input
                            type="text"
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            className={`${styles.input} ${errors.type ? styles.inputError : ''}`}
                            placeholder="e.g., T-shirt, Jeans"
                          />
                        </label>
                        {errors.type && <div className={styles.error}>{errors.type}</div>}
                      </div>
                    </div>

                    {/* Size & Condition */}
                    <div className={styles.inputRow}>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>
                          Size *
                          <select
                            name="size"
                            value={form.size}
                            onChange={handleChange}
                            className={`${styles.select} ${errors.size ? styles.inputError : ''}`}
                          >
                            <option value="">Select size</option>
                            <option value="XS">XS</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                            <option value="XXL">XXL</option>
                          </select>
                        </label>
                        {errors.size && <div className={styles.error}>{errors.size}</div>}
                      </div>

                      <div className={styles.inputGroup}>
                        <label className={styles.label}>
                          Condition *
                          <select
                            name="condition"
                            value={form.condition}
                            onChange={handleChange}
                            className={`${styles.select} ${errors.condition ? styles.inputError : ''}`}
                          >
                            <option value="">Select condition</option>
                            <option value="new">New with tags</option>
                            <option value="like-new">Like new</option>
                            <option value="good">Good</option>
                            <option value="fair">Fair</option>
                          </select>
                        </label>
                        {errors.condition && <div className={styles.error}>{errors.condition}</div>}
                      </div>
                    </div>

                    {/* Description */}
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>
                        Description *
                        <textarea
                          name="description"
                          value={form.description}
                          onChange={handleChange}
                          className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
                          placeholder="Describe your item in detail..."
                          rows="4"
                        />
                      </label>
                      {errors.description && <div className={styles.error}>{errors.description}</div>}
                      <div className={styles.charCount}>
                        {form.description.length}/500 characters
                      </div>
                    </div>

                    {/* Tags */}
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>
                        Tags (Optional)
                        <input
                          type="text"
                          name="tags"
                          value={form.tags}
                          onChange={handleChange}
                          className={styles.input}
                          placeholder="e.g., vintage, summer, casual"
                        />
                      </label>
                      <div className={styles.helpText}>
                        Separate tags with commas to help others find your item
                      </div>
                    </div>
                  </div>
                </div>
              </div >
            </div >

            {/* Submit Section */}
            < div className={styles.submitSection} >
              <button
                type="submit"
                disabled={isSubmitting}
                className={`${styles.submitBtn} ${isSubmitting ? styles.submitting : ''}`}
              >
                {
                  isSubmitting ? (
                    <>
                      <span className={styles.spinner}></span>
                      Listing Item...
                    </>
                  ) : (
                    <>
                      <span className={styles.btnIcon}>✨</span>
                      List My Item
                    </>
                  )}
              </button >
              <p className={styles.submitNote}>
                By listing your item, you agree to our{" "}
                <a href="#" className={styles.link}>Terms of Service</a> and{" "}
                <a href="#" className={styles.link}>Privacy Policy</a>
              </p>
            </div >
          </form >
        </div >
      </main >
    </div >
  );
}
